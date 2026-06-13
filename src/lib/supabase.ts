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

/**
 * Safely retrieves the current session, handling stale refresh tokens.
 */
export const safeGetSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      if (error.message.toLowerCase().includes('refresh token')) {
        console.error('Safe Auth: Invalid refresh token detected. Clearing storage.');
        localStorage.clear();
        await supabase.auth.signOut().catch(() => {});
        return { session: null, error };
      }
      return { session: null, error };
    }
    return { session: data.session, error: null };
  } catch (err: any) {
    console.error('Safe Auth: getSession threw an unexpected error', err);
    return { session: null, error: err };
  }
};

/**
 * Common handler for authentication errors.
 */
export const handleAuthError = (error: any) => {
  if (!error) return;
  const msg = error.message?.toLowerCase() || '';
  if (msg.includes('refresh token')) {
    console.error('Safe Auth: Refresh token error detected. Resetting session...');
    localStorage.clear();
    supabase.auth.signOut().catch(() => {});
    window.location.reload(); // Force a clean state
    return true;
  }
  return false;
};
