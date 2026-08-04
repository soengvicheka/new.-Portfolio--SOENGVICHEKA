# Enabling "Upload my CV" (published for all visitors)

The site already lets **you** upload a new CV — but only **you** (with your secret
key in the URL) can upload. Visitors only ever see a plain **Download CV** button.

By default the uploaded CV/photo is saved only in your browser, so visitors keep
seeing the old file. This guide makes the upload *published* — so once you upload,
**every visitor downloads your new CV**.

It uses **Supabase** (free tier): a cloud storage bucket (public reads) plus one
tiny serverless function that checks your secret key, so only you can upload.

---

## Step 1 — Create a free Supabase project

1. Go to <https://supabase.com> → **Start your project** (free plan).
2. Create an organization and a project (any name, e.g. `vicheka-portfolio`, region
   near you, password of your choice — save it).
3. Open your project dashboard.

## Step 2 — Run the setup SQL

1. In the dashboard open **SQL Editor → New query**.
2. Copy everything from `supabase/setup.sql` and run it.
   (Creates the `cvs` and `photos` buckets and makes them publicly readable.)

## Step 3 — Grab your API keys

1. In the dashboard go to **Settings → API**.
2. Copy the **Project URL** and the **anon public key**.
3. Create (or edit) a `.env` file at the project root with:

   ```env
   VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-public-key>
   ```

## Step 4 — Deploy the upload function (needs Supabase CLI once)

1. Install the Supabase CLI:
   - npm: `npm install -g supabase`
   - or Scoop: `scoop install supabase`
2. In a terminal inside this project folder:

   ```bash
   supabase login
   supabase link --project-ref <your-project-ref>
   supabase secrets set ADMIN_KEY=vicheka-cv-2026
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   supabase functions deploy upload-asset
   ```

   - `ADMIN_KEY` must equal the `adminKey` value in `src/data.js` (change both to
     your own secret before going live).
   - The **service role key** is found under **Settings → API** (Secret). It never
     leaves the server — it is only read by the function.

That's it — no other backend needed.

## Step 5 — Upload your CV

1. Visit your site with your key in the URL: `https://your-site.com/?key=vicheka-cv-2026`
2. Open **About → Curriculum Vitae → upload icon** (or the hero **Download CV**
   menu → **Upload new CV**), pick a **PDF under 3 MB**.
3. Everyone who visits the site now downloads **that** CV from
   `https://<ref>.supabase.co/storage/v1/object/public/cvs/latest-cv.pdf`.

You can also upload your **profile photo** the same way (owner only).

---

## Notes & limits

- **Who can upload?** Only the owner. The upload function rejects any request
  without the correct `ADMIN_KEY`. Visitors never even see the upload buttons.
- **Honest security note:** the key is embedded in the site's JS bundle, so a
  determined attacker who reads the source could still call the function. This
  protects against accidental/casual uploads — perfect for a portfolio. True
  hard security would require a login system.
- **File limits:** CV up to 3 MB (PDF only), photo up to 2 MB after downscaling.
- **No Supabase configured?** The site still works — the buttons just use the
  default `/cv.pdf` and photo. Upload controls remain visible to the owner and
  will show a short "not set up yet" hint.
- **Default CV file:** `public/cv.pdf` is a placeholder. Regenerate it with
  `npm run generate:cv`, or replace it with your real resume so the site works
  even before you finish the Supabase setup.
