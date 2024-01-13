import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wbvmhnwnhxhqohzjvrnw.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indidm1obnduaHhocW9oemp2cm53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUxMDIyNjgsImV4cCI6MjAyMDY3ODI2OH0.LLV01jid73j66BIjz7GKSV2v2wMBYIug5HJ2CopiSG8";
export const supabase = createClient(supabaseUrl, supabaseKey);
