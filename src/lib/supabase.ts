import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://asmcllodvcizayyrgvet.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbWNsbG9kdmNpemF5eXJndmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MjE1MzksImV4cCI6MjA3OTQ5NzUzOX0.i0MEr0J0pqJ2VHGPsIh40R7T_VoUPWWaRdoCV6-fjvk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
