import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const MPESA_CONSUMER_KEY = Deno.env.get("MPESA_CONSUMER_KEY") || "";
const MPESA_CONSUMER_SECRET = Deno.env.get("MPESA_CONSUMER_SECRET") || "";
const MPESA_PASSKEY = Deno.env.get("MPESA_PASSKEY") || "";
const MPESA_SHORTCODE = "174379"; // Safaricom test shortcode

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  phoneNumber: string;
  amount: number;
  bookingId: string;
  userId: string;
  bookingDetails: {
    routeFrom: string;
    routeTo: string;
    seatNumber: number;
    date: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { phoneNumber, amount, bookingId, userId, bookingDetails } = await req.json() as PaymentRequest;

    // Format phone number
    const formattedPhone = phoneNumber.startsWith('0') 
      ? '254' + phoneNumber.slice(1) 
      : phoneNumber;

    // Get OAuth token
    const auth = btoa(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`);
    const tokenResponse = await fetch(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const { access_token } = await tokenResponse.json();

    // Generate timestamp and password
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = btoa(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`);

    // Initiate STK Push
    const stkResponse = await fetch(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          BusinessShortCode: MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: amount,
          PartyA: formattedPhone,
          PartyB: MPESA_SHORTCODE,
          PhoneNumber: formattedPhone,
          CallBackURL: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mpesa-callback`,
          AccountReference: 'Mark.Suma Trans-Kenya',
          TransactionDesc: `Booking: ${bookingDetails.routeFrom} to ${bookingDetails.routeTo}`,
        }),
      }
    );

    const stkResult = await stkResponse.json();

    // Store payment record in Supabase
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        booking_id: bookingId,
        user_id: userId,
        amount,
        phone_number: formattedPhone,
        merchant_request_id: stkResult.MerchantRequestID,
        checkout_request_id: stkResult.CheckoutRequestID,
        status: 'pending'
      })
      .select()
      .single();

    if (paymentError) {
      throw new Error(`Failed to create payment record: ${paymentError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        ...stkResult,
        paymentId: payment.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});