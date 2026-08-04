// ---------------------------------------------------------------------------
//  Remote asset publishing (CV + profile photo)
//  ---------------------------------------------------------------------------
//  The uploaded CV and photo are published to a Supabase Storage bucket so
//  EVERY visitor sees them (not just the owner's browser). Uploads go through
//  a Supabase Edge Function that checks the owner's secret key (adminKey)
//  server-side, so only the owner can upload or reset.
//
//  When Supabase isn't configured (no VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
//  in .env), uploads are saved to THIS browser's localStorage instead — so the
//  owner can add their photo / CV instantly with zero setup. Visitors still
//  see the local defaults in data.js. Once Supabase IS configured, the
//  published remote file takes priority.
// ---------------------------------------------------------------------------
import { adminKey, profile } from '../data'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const FUNCTION_URL = SUPABASE_URL ? `${SUPABASE_URL}/functions/v1/upload-asset` : ''

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

export const ASSET_DEFS = {
  cv: {
    remotePath: 'cvs/latest-cv.pdf',
    fallbackUrl: profile.cv,
    fallbackName: profile.cvFileName,
  },
  photo: {
    remotePath: 'photos/profile.jpg',
    fallbackUrl: profile.image,
    fallbackName: 'profile.jpg',
  },
}

const publicUrl = (remotePath) => `${SUPABASE_URL}/storage/v1/object/public/${remotePath}`

export class AssetError extends Error {
  constructor(code) {
    super(code)
    this.code = code
  }
}

// ---------------------------------------------------------------------------
//  Browser-local fallback storage
//  ---------------------------------------------------------------------------
const LOCAL_PREFIX = 'portfolio:asset:'
const localKey = (type) => `${LOCAL_PREFIX}${type}`

function readLocal(type) {
  try {
    return localStorage.getItem(localKey(type))
  } catch {
    return null
  }
}

function writeLocal(type, dataUrl) {
  try {
    localStorage.setItem(localKey(type), dataUrl)
  } catch {
    throw new AssetError('storage')
  }
}

function removeLocal(type) {
  try {
    localStorage.removeItem(localKey(type))
  } catch {
    /* ignore */
  }
}

// Cached resolutions so we only probe the remote file once per session.
const resolutionCache = {}

/**
 * Lightweight "does this file exist?" probe. Uses a 1-byte range GET instead
 * of HEAD so it works on every CDN edge.
 */
async function remoteFileExists(path) {
  try {
    const res = await fetch(publicUrl(path), {
      method: 'GET',
      headers: { Range: 'bytes=0-0' },
    })
    return res.ok
  } catch {
    return false
  }
}

/**
 * Returns { url, name, exists } for an asset type ('cv' | 'photo').
 * Priority: published remote file (when Supabase is configured) →
 * browser-local upload → the local default in data.js.
 */
export function resolveAsset(type) {
  const def = ASSET_DEFS[type]
  if (!resolutionCache[type]) {
    if (isSupabaseConfigured) {
      resolutionCache[type] = remoteFileExists(def.remotePath).then((exists) => {
        const local = readLocal(type)
        return {
          url: exists ? publicUrl(def.remotePath) : local || def.fallbackUrl,
          name: def.fallbackName,
          exists: exists || Boolean(local),
        }
      })
    } else {
      const local = readLocal(type)
      resolutionCache[type] = Promise.resolve(
        local
          ? { url: local, name: def.fallbackName, exists: true }
          : { url: def.fallbackUrl, name: def.fallbackName, exists: false },
      )
    }
  }
  return resolutionCache[type]
}

/**
 * Uploads an asset (as a base64 data URL). Without Supabase configured this
 * saves to this browser's localStorage so the owner sees it immediately;
 * otherwise it publishes via the owner-only edge function.
 * Throws AssetError with a machine-readable code on failure.
 */
export async function uploadAsset(type, dataUrl) {
  if (!isSupabaseConfigured) {
    // Browser-local mode — instant, no backend needed.
    writeLocal(type, dataUrl)
    const resolved = { url: dataUrl, name: ASSET_DEFS[type].fallbackName, exists: true }
    resolutionCache[type] = Promise.resolve(resolved)
    return resolved
  }
  const res = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey,
    },
    body: JSON.stringify({ type, data: dataUrl }),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new AssetError(body.error === 'Unauthorized' ? 'unauthorized' : 'server')
  }
  const resolved = {
    url: body.url || publicUrl(ASSET_DEFS[type].remotePath),
    name: ASSET_DEFS[type].fallbackName,
    exists: true,
  }
  resolutionCache[type] = Promise.resolve(resolved)
  removeLocal(type) // the published version now wins over any old local copy
  return resolved
}

/**
 * Removes the stored asset and re-resolves the fallback. Without Supabase
 * configured this clears the browser-local copy; otherwise it deletes the
 * published file via the edge function. Throws AssetError on failure.
 */
export async function resetAsset(type) {
  if (!isSupabaseConfigured) {
    removeLocal(type)
    delete resolutionCache[type]
    return resolveAsset(type)
  }
  const res = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey,
    },
    body: JSON.stringify({ type, action: 'reset' }),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new AssetError(body.error === 'Unauthorized' ? 'unauthorized' : 'server')
  }
  removeLocal(type)
  delete resolutionCache[type]
  return resolveAsset(type)
}
