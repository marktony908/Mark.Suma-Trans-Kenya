import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';  // Ensure the correct import path for your supabase client

interface MpesaPaymentProps {
  amount: number;
  bookingId: string;
  onPaymentComplete: () => void;
  bookingDetails?: {
    routeFrom: string;
    routeTo: string;
    seatNumber: number;
    date: string;
    departureTime: string;
    arrivalTime: string;
  };
}

export default function MpesaPayment({ amount, bookingId, onPaymentComplete, bookingDetails }: MpesaPaymentProps) {
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const PAYMENT_PHONE = '0755944317';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handlePayment = async (confirmed: boolean) => {
    if (!confirmed) {
      setShowConfirmation(false);
      return;
    }

    setIsProcessing(true);
    setShowConfirmation(false);

    try {
      const toastId = toast.loading(`Sending M-Pesa prompt to ${phoneNumber}...`);

      // Making the POST request to Supabase Edge Function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mpesa-payment`, // Your Supabase function URL
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phoneNumber,
            amount,
            bookingId,
            userId: user?.id,
            bookingDetails: {
              routeFrom: bookingDetails?.routeFrom,
              routeTo: bookingDetails?.routeTo,
              seatNumber: bookingDetails?.seatNumber,
              date: bookingDetails?.date,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to contact the payment API. Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error.message || 'Error during payment processing');
      }

      // Update the booking status in the database
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ status: 'payment_pending' })
        .eq('id', bookingId);

      if (bookingError) {
        throw new Error(`Failed to update booking status: ${bookingError.message}`);
      }

      // Success message and call onPaymentComplete callback
      toast.success('M-Pesa prompt sent! Please check your phone.', { id: toastId });

      // Wait briefly to display the success message
      setTimeout(() => {
        onPaymentComplete();
      }, 2000);

    } catch (error: any) {
      // Handle errors during payment processing
      toast.error(`Error: ${error.message || 'Failed to process payment'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">M-Pesa Payment</h3>
      <div className="mb-4">
        <p className="text-gray-600">Amount to pay:</p>
        <p className="text-2xl font-bold text-blue-600">KES {amount.toFixed(2)}</p>
      </div>

      {showConfirmation ? (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
          <p className="text-gray-700 mb-4">
            Confirm payment of <span className="font-bold">KES {amount.toFixed(2)}</span> to{' '}
            <span className="font-bold">Mark.Suma Trans-Kenya ({PAYMENT_PHONE})</span>?
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => handlePayment(true)}
              disabled={isProcessing}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 font-medium"
            >
              Yes, Proceed
            </button>
            <button
              onClick={() => handlePayment(false)}
              disabled={isProcessing}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              M-Pesa Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="254700000000"
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                pattern="^(?:254|\+254|0)([7-9]{1}[0-9]{8})$"
                title="Please enter a valid Kenyan phone number"
              />
            </div>
          </div>

          {bookingDetails && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Booking Summary</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Route: {bookingDetails.routeFrom} → {bookingDetails.routeTo}</p>
                <p>Date: {bookingDetails.date}</p>
                <p>Time: {bookingDetails.departureTime} - {bookingDetails.arrivalTime}</p>
                <p>Seat: {bookingDetails.seatNumber}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full py-2 px-4 rounded-md text-white font-medium
              ${isProcessing ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}
            `}
          >
            {isProcessing ? 'Processing...' : 'Pay with M-Pesa'}
          </button>
        </form>
      )}

      <div className="mt-4 text-sm text-gray-500">
        <p>Instructions:</p>
        <ol className="list-decimal ml-4 space-y-1">
          <li>Enter your M-Pesa registered phone number</li>
          <li>Click "Pay with M-Pesa"</li>
          <li>Confirm the payment details</li>
          <li>Wait for the M-Pesa prompt on your phone</li>
          <li>Enter your M-Pesa PIN to complete the payment</li>
        </ol>
      </div>
    </div>
  );
}
