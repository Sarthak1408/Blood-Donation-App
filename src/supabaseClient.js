import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jfxhrtzcwgpspafnjuua.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmeGhydHpjd2dwc3BhZm5qdXVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NDYwNzUsImV4cCI6MjA3MTAyMjA3NX0.fvdZ5d6l4fuYyO-wh4z-lUbqhl54vW96Hl8d_mePLMo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);