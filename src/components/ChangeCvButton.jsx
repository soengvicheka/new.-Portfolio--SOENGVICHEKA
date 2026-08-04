import { useRef, useState } from 'react'
import { useProfileCv } from '../hooks/useProfileCv'
import { useLanguage } from '../hooks/useLanguage'
import { Icon } from './Icons'

/**
 * Reusable upload button + hidden file input for replacing the CV.
 * Calls `onSaved` after a PDF is successfully stored, or `onError(message)`
 * when the file is rejected (wrong type / too large).
 */
export default function ChangeCvButton({ className = '', onSaved, onError }) {
  const { updateFromFile } = useProfileCv()
  const { t } = useLanguage()
  const fileInputRef = useRef(null)
  const [busy, setBusy] = useState(false)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    try {
      await updateFromFile(file)
      onSaved?.()
    } catch (err) {
      onError?.(err?.message || t.cvErrors.generic)
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
        aria-label={t.about.uploadCv}
        title={t.about.uploadCv}
        className={className}
      >
        {busy ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <Icon name="upload" className="h-4 w-4" />
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  )
}
