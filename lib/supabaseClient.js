import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[supabase] NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não estão definidas. ' +
      'Copia .env.example para .env.local e preenche os valores.'
  );
}

// Cliente Supabase partilhado por toda a app.
// Importar assim: import { supabase } from '@/lib/supabaseClient'
export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');
