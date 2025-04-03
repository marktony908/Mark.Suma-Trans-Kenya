import { createClient } from '@supabase/supabase-js';

// Define the Supabase URL and API Key
const supabaseUrl = "https://qawiwttqvjmngkwaccyr.supabase.co"
 // Use your actual Supabase URL
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhd2l3dHRxdmptbmdrd2FjY3lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNjExMTMsImV4cCI6MjA1ODgzNzExM30.h0-L-IZe3YcAoQoSkDxcE9ehFRgS4UTNVx9f20PhKJs"

// Create a Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
