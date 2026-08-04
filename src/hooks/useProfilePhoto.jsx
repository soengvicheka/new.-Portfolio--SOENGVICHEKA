import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLanguage } from './useLanguage'
import { resolveAsset, uploadAsset, resetAsset, AssetError, ASSET_DEFS } from '../lib/assets'

const ProfilePhotoContext = createContext(null)

/**
 * Reads an image file, downscales it to keep the stored size small,
 * and returns a JPEG data URL.
 */
function readAndDownscale(file, maxSize = 640) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const width = Math.round(img.width * scale)
        const height = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.onerror = reject
      img.src = reader.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/** Maps low-level error codes to the translated message for the current language. */
function translateError(t, err) {
  const code = err instanceof AssetError ? err.code : null
  if (code === 'notConfigured') return t.photoErrors.notConfigured
  if (code === 'unauthorized') return t.photoErrors.unauthorized
  if (code === 'storage') return t.photoErrors.storage
  return t.photoErrors.server
}

/**
 * Publishes the profile photo to remote storage so every visitor sees it.
 * Falls back to the default profile.image when nothing is uploaded.
 */
export function ProfilePhotoProvider({ children }) {
  const { t } = useLanguage()
  // { url, exists } | null (null until the first resolution finishes)
  const [photo, setPhoto] = useState(null)

  useEffect(() => {
    let mounted = true
    resolveAsset('photo').then((resolved) => {
      if (mounted) setPhoto(resolved)
    })
    return () => {
      mounted = false
    }
  }, [])

  const updateFromFile = useCallback(
    async (file) => {
      if (!file) return
      if (!file.type.startsWith('image/')) {
        throw new Error(t.photoErrors.type)
      }
      // Cheap guard before the (slow) client-side downscale step.
      if (file.size > 10 * 1024 * 1024) {
        throw new Error(t.photoErrors.size)
      }
      let dataUrl
      try {
        dataUrl = await readAndDownscale(file)
      } catch {
        throw new Error(t.photoErrors.read)
      }
      try {
        const resolved = await uploadAsset('photo', dataUrl)
        setPhoto(resolved)
      } catch (err) {
        throw new Error(translateError(t, err))
      }
    },
    [t],
  )

  const clear = useCallback(() => {
    resetAsset('photo').catch(() => {})
    setPhoto({ url: ASSET_DEFS.photo.fallbackUrl, name: ASSET_DEFS.photo.fallbackName, exists: false })
  }, [])

  const value = useMemo(() => ({ photo, updateFromFile, clear }), [photo, updateFromFile, clear])

  return <ProfilePhotoContext.Provider value={value}>{children}</ProfilePhotoContext.Provider>
}

export function useProfilePhoto() {
  return useContext(ProfilePhotoContext)
}
