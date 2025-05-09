import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseAnonKey = 'your-anon-key';

// Create and export the supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
