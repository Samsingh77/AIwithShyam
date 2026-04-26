import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseUrl.startsWith('http') && 
  !supabaseUrl.includes('your_supabase_url') &&
  supabaseAnonKey &&
  !supabaseAnonKey.includes('your_supabase_anon_key')
);

if (!isSupabaseConfigured && supabaseUrl) {
  console.warn('Supabase credentials appears to be placeholder or invalid. Check your environment variables.');
}

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl! : 'https://placeholder-ignore.supabase.co',
  supabaseAnonKey || 'placeholder'
);
