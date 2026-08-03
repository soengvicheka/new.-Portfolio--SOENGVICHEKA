import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const STORAGE_KEY = 'vs-portfolio-photo'

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

export function ProfilePhotoProvider({ children }) {
  const [photo, setPhoto] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY)
    } catch {
      return null
    }
  })

  const updateFromFile = useCallback(async (file) => {
    const dataUrl = await readAndDownscale(file)
    try {
      localStorage.setItem(STORAGE_KEY, dataUrl)
    } catch {
      // Quota exceeded — still show the photo for this session.
    }
    setPhoto(dataUrl)
  }, [])

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
    setPhoto(null)
  }, [])

  const value = useMemo(() => ({ photo, updateFromFile, clear }), [photo, updateFromFile, clear])

  return <ProfilePhotoContext.Provider value={value}>{children}</ProfilePhotoContext.Provider>
}

export function useProfilePhoto() {
  return useContext(ProfilePhotoContext)
}
