// src/supabaseClient.ts

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Replace with your own Supabase URL and Key
const supabaseUrl: string = 'https://your-project-id.supabase.co';
const supabaseKey: string = 'your-anon-public-key';

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export default supabase;
