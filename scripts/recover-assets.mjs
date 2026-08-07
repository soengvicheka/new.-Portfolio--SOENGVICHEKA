// Recovers the owner's uploaded photo (and CV) from browser localStorage
// leveldb files, so they can be committed to public/ and ship with the site.
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const LOCAL_APP_DATA = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local')
const APPDATA = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming')

const roots = []
const addIfExists = (p) => {
  try {
    if (fs.statSync(p).isDirectory()) roots.push(p)
  } catch {}
}

// Chrome / Edge / Brave profile leveldb dirs
for (const base of [
  path.join(LOCAL_APP_DATA, 'Google', 'Chrome', 'User Data'),
  path.join(LOCAL_APP_DATA, 'Microsoft', 'Edge', 'User Data'),
  path.join(LOCAL_APP_DATA, 'BraveSoftware', 'Brave-Browser', 'User Data'),
]) {
  let profiles = []
  try {
    profiles = fs.readdirSync(base).map((n) => path.join(base, n))
  } catch {}
  for (const profile of profiles) {
    try {
      if (!fs.statSync(profile).isDirectory()) continue
    } catch {
      continue
    }
    addIfExists(path.join(profile, 'Local Storage', 'leveldb'))
  }
}

// Firefox localStorage (stored in a sqlite-ish file; only grep-able as text)
for (const base of [
  path.join(APPDATA, 'Mozilla', 'Firefox', 'Profiles'),
  path.join(APPDATA, 'Waterfox', 'Profiles'),
]) {
  let profiles = []
  try {
    profiles = fs.readdirSync(base).map((n) => path.join(base, n))
  } catch {}
  for (const p of profiles) addIfExists(p)
}

const TARGETS = [
  { key: 'portfolio:asset:photo', out: 'recovered-photo', kind: 'image' },
  { key: 'portfolio:asset:cv', out: 'recovered-cv', kind: 'pdf' },
]

const findings = [] // { key, origin, file, bytes }

function extractDataUrl(buf, startIdx, maxLen = 2 * 1024 * 1024) {
  // Data URLs are stored as plain strings after the key in leveldb log files.
  const window = buf.subarray(startIdx, Math.min(buf.length, startIdx + maxLen))
  const s = window.toString('latin1')
  const markers = ['data:image/jpeg;base64,', 'data:image/png;base64,', 'data:image/webp;base64,', 'data:application/pdf;base64,']
  let best = null
  for (const m of markers) {
    const i = s.indexOf(m)
    if (i === -1) continue
    // grab base64 until a non-base64 char (allow = and newlines)
    let j = i + m.length
    let end = j
    for (; end < s.length; end++) {
      const c = s[end]
      if (/[A-Za-z0-9+/=]/.test(c)) continue
      break
    }
    const b64 = s.slice(j, end).replace(/\s/g, '')
    try {
      const bytes = Buffer.from(b64, 'base64')
      if (bytes.length > 1000 && (!best || bytes.length > best.bytes.length)) {
        best = { mime: m.slice(5, m.indexOf(';')), bytes }
      }
    } catch {}
  }
  return best
}

function findKeyNearOrigin(buf, key, origin) {
  // LevelDB localStorage keys look like: \x00<origin>\x00<key>
  let idx = 0
  while (idx < buf.length) {
    const rel = buf.indexOf(key, idx)
    if (rel === -1) break
    idx = rel + key.length
    const slice = buf.subarray(rel - 128, rel).toString('latin1')
    const orgMatch = slice.match(/[^\x00]{1,80}$/)
    const originHere = orgMatch ? orgMatch[0] : 'unknown'
    if (origin && originHere !== origin) continue
    return { idx: rel, origin: originHere }
  }
  return null
}

function scanFile(file) {
  let buf
  try {
    buf = fs.readFileSync(file)
  } catch {
    return
  }
  const text = buf.toString('latin1')
  for (const t of TARGETS) {
    const keyMatch = findKeyNearOrigin(buf, t.key)
    if (!keyMatch) {
      // maybe present in text-only form (some browsers)
      const ti = text.indexOf(t.key)
      if (ti === -1) continue
      const hit = extractDataUrl(buf, ti)
      if (hit) findings.push({ key: t.key, origin: 'unknown', file, bytes: hit.bytes })
      continue
    }
    const hit = extractDataUrl(buf, keyMatch.idx)
    if (hit) findings.push({ key: t.key, origin: keyMatch.origin, file, bytes: hit.bytes })
  }
}

for (const root of roots) {
  let files = []
  try {
    files = fs.readdirSync(root)
  } catch {
    continue
  }
  for (const f of files) {
    if (/(\.log|\.ldb|\.sst)$/.test(f) || f === 'CURRENT' || f.startsWith('MANIFEST')) {
      scanFile(path.join(root, f))
    }
  }
}

if (findings.length === 0) {
  console.log('NO_ASSETS_FOUND')
  process.exit(0)
}

const outDir = path.join(process.cwd(), 'scripts', '.recovered')
fs.mkdirSync(outDir, { recursive: true })

const bestByKey = {}
for (const f of findings) {
  if (!bestByKey[f.key] || f.bytes.length > bestByKey[f.key].bytes.length) {
    bestByKey[f.key] = f
  }
}

for (const t of TARGETS) {
  const hit = bestByKey[t.key]
  if (!hit) {
    console.log(`${t.key}: not found`)
    continue
  }
  const ext = t.kind === 'pdf' ? 'pdf' : hit.bytes[0] === 0xff && hit.bytes[1] === 0xd8 ? 'jpg' : 'png'
  const out = path.join(outDir, `${t.out}.${ext}`)
  fs.writeFileSync(out, hit.bytes)
  console.log(`${t.key}: FOUND ${(hit.bytes.length / 1024).toFixed(0)}KB from ${hit.origin} -> ${out}`)
}
