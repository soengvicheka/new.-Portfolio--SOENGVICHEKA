// ---------------------------------------------------------------------------
//  upload-asset — owner-only publishing for the portfolio CV & profile photo.
//  ---------------------------------------------------------------------------
//  The owner visits the site with `?key=<adminKey>` and uploads a PDF or a
//  photo. This function checks that key against the ADMIN_KEY secret stored
//  on the Supabase project BEFORE touching storage, so visitors can never
//  upload. The service-role key never leaves the server.
//
//  Deploy (after `supabase login` + `supabase link`):
//      supabase secrets set ADMIN_KEY=YOUR_SECRET
//      supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
//      supabase functions deploy upload-asset
//
//  ADMIN_KEY must match the `adminKey` value in src/data.js.
//
//  Request body: { "type": "cv" | "photo", "action": "upload" | "reset",
//                  "data": "<data-url>" }
// ---------------------------------------------------------------------------
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ADMIN_KEY = Deno.env.get('ADMIN_KEY')
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')

const ASSET_SPECS = {
  cv: {
    bucket: 'cvs',
    path: 'latest-cv.pdf',
    maxBytes: 3 * 1024 * 1024, // 3 MB
    mime: ['application/pdf', 'application/octet-stream'],
  },
  photo: {
    bucket: 'photos',
    path: 'profile.jpg',
    maxBytes: 2 * 1024 * 1024, // 2 MB (downscaled JPEG)
    mime: ['image/jpeg', 'image/png', 'image/webp', 'application/octet-stream'],
  },
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function cors(res) {
  res.headers.set('Access-Control-Allow-Origin', '*')
  res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.headers.set('Access-Control-Allow-Headers', 'content-type, x-admin-key')
  return res
}

function unauthorized() {
  return cors(json({ error: 'Unauthorized' }, 401))
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return cors(new Response(null, { status: 204 }))
  if (req.method !== 'POST') return cors(json({ error: 'Method not allowed' }, 405))

  // Owner check — only the site owner knows ADMIN_KEY.
  if (!ADMIN_KEY || req.headers.get('x-admin-key') !== ADMIN_KEY) {
    return unauthorized()
  }

  let body
  try {
    body = await req.json()
  } catch {
    return cors(json({ error: 'Invalid JSON' }, 400))
  }

  const spec = ASSET_SPECS[body?.type]
  if (!spec) return cors(json({ error: 'Unknown asset type' }, 400))

  const supabase = createClient(SUPABASE_URL ?? '', SERVICE_ROLE_KEY ?? '')

  // Reset — delete the published file.
  if (body.action === 'reset') {
    const { error } = await supabase.storage.from(spec.bucket).remove([spec.path])
    if (error) {
      console.error('reset failed', error)
      return cors(json({ error: 'Reset failed' }, 500))
    }
    return cors(json({ ok: true, reset: true }))
  }

  // Upload — expects a base64 data URL.
  if (typeof body.data !== 'string' || !body.data.startsWith('data:')) {
    return cors(json({ error: 'Missing file data' }, 400))
  }

  const [header, base64] = body.data.split(',')
  const mime = header.match(/^data:([^;]+)/)?.[1] || ''
  if (!spec.mime.includes(mime)) {
    return cors(json({ error: 'Wrong file type' }, 400))
  }

  let bytes
  try {
    bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
  } catch {
    return cors(json({ error: 'Invalid file data' }, 400))
  }
  if (bytes.byteLength > spec.maxBytes) {
    return cors(json({ error: 'File too large' }, 400))
  }

  // upsert: true overwrites the single "latest" file each time.
  const { error } = await supabase.storage
    .from(spec.bucket)
    .upload(spec.path, bytes, { contentType: mime, upsert: true })
  if (error) {
    console.error('upload failed', error)
    return cors(json({ error: 'Upload failed' }, 500))
  }

  const { data } = supabase.storage.from(spec.bucket).getPublicUrl(spec.path)
  return cors(json({ ok: true, url: data.publicUrl }))
})
