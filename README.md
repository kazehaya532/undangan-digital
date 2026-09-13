# **Digital Wedding Invitation**

Static digital wedding invitation

## Preview Locally

```bash
npm run start
```

## Check

```bash
npm run check
```

## Wedding Wish Backend (Supabase)

The wish form stores messages in a hosted PostgreSQL database (Supabase) while the site itself stays on GitHub Pages. This requires no server to run: the browser talks to Supabase directly, guarded by Row Level Security.

1. Create a free project at supabase.com, then open **Project Settings -> API Keys** and copy the **Project URL** and **publishable key**.
2. Paste those values into `assets/js/config.js`. The publishable key is safe to publish because RLS below only lets visitors read approved rows and insert unapproved ones. Never put a secret key in the browser.
3. Run this SQL in the Supabase **SQL Editor**:

```sql
create table public.wedding_wishes (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 80),
  message text not null check (char_length(message) between 1 and 500),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.wedding_wishes enable row level security;

create policy "read approved" on public.wedding_wishes
  for select to anon using (approved = true);

create policy "insert pending" on public.wedding_wishes
  for insert to anon with check (approved = false);
```

### Moderating wishes

New wishes are saved with `approved = false` and stay hidden from the site. In the Supabase dashboard open **Table Editor -> wedding_wishes**, review pending rows, and set `approved = true` to publish one. The form includes a honeypot field and client-side length caps for basic spam control; if spam ever becomes a problem, add a Supabase Edge Function (or move to Vercel functions) for rate limiting/CAPTCHA.

## Custom Domain

The production site is `https://undangan-fahrur-aurum.my.id`, registered through Exabytes and delegated to Cloudflare DNS.

1. Exabytes uses the two nameservers assigned by the Cloudflare zone instead of the original Masterweb parking nameservers. Keep Registrar Lock enabled.
2. Cloudflare has DNS-only (grey-cloud) CNAME records for both `@` and `www`, targeting `kazehaya532.github.io`.
3. GitHub **Settings -> Pages** uses `undangan-fahrur-aurum.my.id` as the custom domain with **Enforce HTTPS** enabled.
4. The root `CNAME` file preserves the domain across GitHub Pages deployments.

## Personalized Guest Links

The invitation reads the recipient from `to`, `kepada`, `for`, or `u` query parameters without case sensitivity. When present, the recipient replaces `Bapak/Ibu/Saudara/i` on the opening card and hides the `Tamu Undangan` fallback. Without a recipient, the default card remains unchanged.

```text
https://undangan-fahrur-aurum.my.id/?to=Reni+Furqon
https://undangan-fahrur-aurum.my.id/?to=Reni+%26+Furqon
```

Names are displayed as provided after URL decoding and whitespace cleanup. The page uses `textContent`, so query-string content cannot inject HTML. The local-only helper `tools/guest-links.html` accepts one name per line, removes blank lines and duplicates, then generates correctly encoded links with copy and download actions. Open it directly in a browser; `/tools/` is intentionally ignored by Git.

Social preview metadata and a dedicated 1200x630 preview image are deferred.

## Structure

- `index.html` - GitHub Pages entry page
- `assets/css/styles.css` - visual system and responsive layout
- `assets/js/script.js` - countdown, invitation gate, replayable section transitions, photo sliders, wish form (Supabase-backed), gift reveal, and navigation state
- `assets/js/config.js` - public Supabase project URL and publishable key for the wish form (RLS-protected; never add a secret key)
- `CNAME` - GitHub Pages custom domain declaration
- `assets/images/` - optimized images published with the invitation
- `assets/audio/` - optimized, attributed background music published with the invitation
- `wedd_picture/` - ignored local source photography; never published to GitHub
- `PRODUCT.md` - product context
- `DESIGN.md` - design system notes
- `THIRD_PARTY_NOTICES.md` - third-party asset provenance and license terms

## Invitation Content

The invitation presents Fahrur and Aurum's wedding in a guided, mobile-first experience. Guests open a personalized cover, meet the couple and their families, view the ceremony and reception schedule, follow the countdown, save the date, open the venue map, share a moderated wedding wish, and view the digital gift information. The invitation also includes wedding moments, wedding wish section, background music, and a closing message from the couple.

## Background Music

Opening the invitation starts `Stoic Morning` by Kevin MacLeod at 40% volume. The track loops while the invitation is open, pauses while the page is hidden, and can be paused or resumed with the fixed music control. A sibling info button reveals a compact credit popover with the source and license; full provenance and encoding details live in `THIRD_PARTY_NOTICES.md`.
