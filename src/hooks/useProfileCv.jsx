import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLanguage } from './useLanguage'
import { resolveAsset, uploadAsset, resetAsset, AssetError, ASSET_DEFS } from '../lib/assets'

// Keep the base64 payload comfortably under the edge function request limits.
const MAX_FILE_BYTES = 3 * 1024 * 1024

const ProfileCvContext = createContext(null)

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('read'))
    reader.readAsDataURL(file)
  })
}

/** Maps low-level error codes to the translated message for the current language. */
function translateError(t, err) {
  const code = err instanceof AssetError ? err.code : null
  if (code === 'notConfigured') return t.cvErrors.notConfigured
  if (code === 'unauthorized') return t.cvErrors.unauthorized
  if (code === 'storage') return t.cvErrors.storage
  return t.cvErrors.server
}

/**
 * Publishes the CV to remote storage so every visitor downloads the owner's
 * file. Falls back to the default profile.cv when nothing is uploaded (or
 * when Supabase isn't configured yet).
 */
export function ProfileCvProvider({ children }) {
  const { t } = useLanguage()
  // { url, name, exists } | null (null until the first resolution finishes)
  const [cv, setCv] = useState(null)

  useEffect(() => {
    let mounted = true
    resolveAsset('cv').then((resolved) => {
      if (mounted) setCv(resolved)
    })
    return () => {
      mounted = false
    }
  }, [])

  const updateFromFile = useCallback(
    async (file) => {
      if (!file) return
      if (!/\.pdf$/i.test(file.name) && file.type !== 'application/pdf') {
        throw new Error(t.cvErrors.type)
      }
      if (file.size > MAX_FILE_BYTES) {
        throw new Error(t.cvErrors.size)
      }
      let dataUrl
      try {
        dataUrl = await readFileAsDataUrl(file)
      } catch {
        throw new Error(t.cvErrors.read)
      }
      try {
        const resolved = await uploadAsset('cv', dataUrl)
        setCv(resolved)
      } catch (err) {
        throw new Error(translateError(t, err))
      }
    },
    [t],
  )

  const clear = useCallback(() => {
    resetAsset('cv').catch(() => {})
    setCv({ url: ASSET_DEFS.cv.fallbackUrl, name: ASSET_DEFS.cv.fallbackName, exists: false })
  }, [])

  const value = useMemo(() => ({ cv, updateFromFile, clear }), [cv, updateFromFile, clear])

  return <ProfileCvContext.Provider value={value}>{children}</ProfileCvContext.Provider>
}

export function useProfileCv() {
  return useContext(ProfileCvContext)
}
