// Public, RLS-protected configuration for the wish form backend.
// These values are safe to expose on a public GitHub Pages site because Row
// Level Security limits the anon role to reading approved rows and inserting
// unapproved ones. NEVER put the Supabase secret key in this file.
//
// Environment split by hostname:
//   - localhost, 127.0.0.1, ::1, file://  -> development project (local testing)
//   - every other host (live domain)      -> production project (real wishes)
(() => {
  const localHostnames = ["localhost", "127.0.0.1", "::1"];
  const isLocalDevelopment =
    window.location.protocol === "file:" ||
    localHostnames.includes(window.location.hostname);

  window.WEDDING_CONFIG = isLocalDevelopment
    ? {
        ENVIRONMENT: "development",
        SUPABASE_URL: "https://owtzgtmgkyiwowmzjnvw.supabase.co",
        SUPABASE_ANON_KEY: "sb_publishable_65p7Dfq-84fX8Kqmzi22NQ_CoqjxnZO"
      }
    : {
        ENVIRONMENT: "production",
        SUPABASE_URL: "https://uniwtapyahlnezqdivci.supabase.co",
        SUPABASE_ANON_KEY: "sb_publishable_g63rCRR4IGo-QdFZ-f6XeQ_mPLq6Lg6"
      };
})();
