// Public, RLS-protected configuration for the wish form backend.
// These values are safe to expose on a public GitHub Pages site because Row
// Level Security limits the anon role to reading approved rows and inserting
// unapproved ones. NEVER put the Supabase service_role key in this file.
//
// Replace the two placeholders below with the values from
// Supabase dashboard -> Project Settings -> API Keys:
//   - Project URL        -> SUPABASE_URL
//   - publishable key    -> SUPABASE_ANON_KEY
window.WEDDING_CONFIG = {
  SUPABASE_URL: "https://owtzgtmgkyiwowmzjnvw.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_65p7Dfq-84fX8Kqmzi22NQ_CoqjxnZO"
};
