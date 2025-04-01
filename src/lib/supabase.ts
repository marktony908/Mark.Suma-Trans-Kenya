import { createClient } from '@supabase/supabase-js';

// Define the Supabase URL and API Key
const supabaseUrl = 'https://your-project-id.supabase.co';
 // Use your actual Supabase URL
const supabaseAnonKey = 'your-anon-key'; // Replace with your actual anon key

// Create a Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
