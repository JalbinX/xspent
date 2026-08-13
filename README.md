# xSpent — deploy to Vercel

## What's in here
- `index.html` — the app (works offline once loaded; syncs to Supabase when signed in and online)
- `manifest.json` + `sw.js` — makes it installable to your phone's homescreen with offline caching
- `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` — app icons
- `api/review.js` — serverless function that talks to Claude for your monthly AI review (keeps your API key private, off the phone)
- `supabase-setup.sql` — run this once in Supabase to create the expenses table with proper security and turn on live sync

## Steps

1. **Create a Supabase project**
   - supabase.com → New Project
   - Once it's ready: Settings → API → copy your **Project URL** and **anon public key**

2. **Set up the database**
   - In Supabase: SQL Editor → New query
   - Paste the contents of `supabase-setup.sql` from this folder → Run
   - This creates the `expenses` table with row-level security, so each user can only see their own data

3. **Add your Supabase keys to the app**
   - Open `index.html`, find this near the top of the `<script>` block:
     ```
     const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
     const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
     ```
   - Replace both with the values from step 1. (The anon key is safe to expose in frontend code — it's designed for this. Row-level security is what actually protects the data.)

4. **Get an Anthropic API key**
   Go to https://console.anthropic.com → API Keys → create one.

5. **Push this folder to a GitHub repo**
   ```
   git init
   git add .
   git commit -m "xSpent"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

6. **Import into Vercel**
   - vercel.com → New Project → import your repo
   - Framework preset: "Other" (no build step needed)

7. **Add your Anthropic key to Vercel**
   - In the Vercel project → Settings → Environment Variables
   - Add `ANTHROPIC_API_KEY` = your key from step 4
   - Redeploy

8. **Add to homescreen**
   - Open your live Vercel URL on your phone in Safari (iOS) or Chrome (Android)
   - Sign up for an account in the app (or tap "Skip for now" to use it offline-only on that device)
   - Safari: Share button → "Add to Home Screen"
   - Chrome: menu (⋮) → "Add to Home screen" / it may prompt automatically
   - Sign in with the same account on another device to see your data sync there too

## Notes
- Signed-in mode: your data lives in Supabase and syncs **live** across every device signed into the same account — add an expense on your phone, it shows up instantly on your laptop too, no refresh needed. A local copy is also kept in `localStorage` so the app still works fully offline.
- "Skip for now" mode: data stays local to that one device only, no account needed.
- The AI review only works when you're online (it calls your `/api/review` function).
- Adding, editing, viewing categories/summary all work fully offline once the app has loaded once; changes made offline sync up the next time you're online.
