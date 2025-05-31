import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Release {
  id: number;
  title: string;
  date: string;
  description: string;
  status: 'Alpha' | 'Beta';
  documentation: string;
  created_at: string;
}