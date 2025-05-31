import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Release {
  id: number;
  title: string;
  date: string;
  description: string;
  status: 'Beta';
  documentation: string;
  created_at: string;
}