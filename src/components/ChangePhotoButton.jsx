import { useRef, useState } from 'react'
import { useProfilePhoto } from '../hooks/useProfilePhoto'
import { Icon } from './Icons'

/**
 * Reusable camera button + hidden file input for updating the profile photo.
 * Calls `onSaved` after a photo is successfully stored.
 */
export default function ChangePhotoButton({ className = '', onSaved }) {
  const { updateFromFile } = useProfilePhoto()
  const fileInputRef = useRef(null)
  const [busy, setBusy] = useState(false)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    try {
      await updateFromFile(file)
      onSaved?.()
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        aria-label="Change your photo"
        title="Change your photo"
        className={className}
      >
        {busy ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        ) : (
          <Icon name="camera" className="h-4 w-4" />
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  )
}
