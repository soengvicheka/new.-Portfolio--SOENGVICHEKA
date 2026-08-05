import { useEffect, useRef, useState } from 'react'
import { useProfilePhoto } from '../hooks/useProfilePhoto'
import { useLanguage } from '../hooks/useLanguage'
import { Icon } from './Icons'

/**
 * Photo upload overlay. Renders absolutely over the profile photo:
 *  - click anywhere on the photo to pick an image file
 *  - the whole photo is also a drag & drop target
 *
 * No visible buttons are rendered here — the camera button in the corner of
 * the photo card (ChangePhotoButton) is the visible affordance.
 *
 * Without Supabase the photo is saved to this browser's localStorage only;
 * with Supabase the publish step is still validated server-side by the
 * upload-asset edge function.
 *
 * Wrap the photo in a `relative` container and place this as a sibling that
 * covers the image area (pass `className` like "inset-2 rounded-[...]" to
 * match the image's own bounds).
 */
export default function ChangePhotoOverlay({ onSaved, onError, className = 'inset-0' }) {
  const { updateFromFile } = useProfilePhoto()
  const { t } = useLanguage()
  const fileInputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)
  const dragDepth = useRef(0)

  // If a drag is cancelled or ends outside the window, drop/dragleave never
  // fire — reset the highlight on the window-level dragend instead.
  useEffect(() => {
    const reset = () => {
      dragDepth.current = 0
      setDragging(false)
    }
    window.addEventListener('dragend', reset)
    return () => window.removeEventListener('dragend', reset)
  }, [])

  const isFileDrag = (e) => Array.from(e.dataTransfer?.types || []).includes('Files')

  const openPicker = () => {
    if (busy) return
    fileInputRef.current?.click()
  }

  const saveFile = async (file) => {
    if (!file) return
    setBusy(true)
    try {
      await updateFromFile(file)
      onSaved?.()
    } catch (err) {
      onError?.(err?.message || t.photoErrors.server)
    } finally {
      setBusy(false)
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    await saveFile(file)
    e.target.value = ''
  }

  const handleDragOver = (e) => {
    if (!isFileDrag(e)) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDragEnter = (e) => {
    if (!isFileDrag(e)) return
    dragDepth.current += 1
    setDragging(true)
  }

  const handleDragLeave = (e) => {
    if (!isFileDrag(e)) return
    dragDepth.current = Math.max(0, dragDepth.current - 1)
    if (dragDepth.current === 0) setDragging(false)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    dragDepth.current = 0
    setDragging(false)
    await saveFile(e.dataTransfer.files?.[0])
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <div
        onClick={openPicker}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`absolute z-10 cursor-pointer ${className}`}
      >
        {/* Dashed highlight while dragging a file over the photo */}
        <div
          className={`absolute inset-0 rounded-[inherit] border-2 border-dashed border-cyan-300/90 bg-cyan-400/10 transition-opacity duration-200 ${
            dragging ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        />

        {dragging && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="flex items-center gap-2 rounded-full bg-slate-950/80 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur">
              <Icon name="upload" className="h-4 w-4" />
              {t.hero.dropPhoto}
            </span>
          </div>
        )}

      </div>
    </>
  )
}
