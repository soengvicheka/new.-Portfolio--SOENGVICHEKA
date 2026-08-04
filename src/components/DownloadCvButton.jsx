import { useEffect, useRef, useState } from 'react'
import { profile } from '../data'
import { useProfileCv } from '../hooks/useProfileCv'
import { useIsOwner } from '../hooks/useIsOwner'
import { useLanguage } from '../hooks/useLanguage'
import { Icon } from './Icons'

/**
 * The hero "Download CV" button. Clicking it opens a small menu that lets you
 * either download the current CV or upload a new one (PDF, saved in localStorage).
 */
export default function DownloadCvButton() {
  const { cv, updateFromFile, clear } = useProfileCv()
  const isOwner = useIsOwner()
  const { t } = useLanguage()
  const rootRef = useRef(null)
  const fileInputRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState(null)
  const noticeTimerRef = useRef(null)

  const cvSource = cv?.url || profile.cv
  const cvName = cv?.name || profile.cvFileName

  // Close the menu on outside click or Escape.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  // Clear any pending notice timer on unmount.
  useEffect(() => () => {
    if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current)
  }, [])

  // Visitors (no secret key in the URL) just get a plain download button.
  if (!isOwner) {
    return (
      <a
        href={cvSource}
        download={cvName}
        className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/5 px-5 py-3 text-sm font-semibold text-indigo-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-500/10 dark:text-indigo-300"
      >
        <Icon name="download" className="h-4 w-4" />
        {t.cvMenu.download}
      </a>
    )
  }

  const showNotice = (type, text) => {
    if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current)
    setNotice({ type, text })
    noticeTimerRef.current = window.setTimeout(() => setNotice(null), 3200)
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    try {
      await updateFromFile(file)
      showNotice('success', t.cvMenu.saved)
    } catch (err) {
      showNotice('error', err?.message || t.cvErrors.generic)
    } finally {
      setBusy(false)
      setOpen(false)
      e.target.value = ''
    }
  }

  const handleReset = () => {
    clear()
    setOpen(false)
    showNotice('success', t.cvMenu.resetMsg)
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/5 px-5 py-3 text-sm font-semibold text-indigo-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-500/10 dark:text-indigo-300"
      >
        <Icon name="download" className="h-4 w-4" />
        {t.cvMenu.download}
        <Icon
          name="chevron-down"
          className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label={t.cvMenu.options}
          className="absolute left-0 top-full z-30 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-white/10 dark:bg-slate-900"
        >
          <p className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 text-[11px] font-medium text-slate-500 dark:border-white/5 dark:text-slate-400">
            <Icon name="file" className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
            <span className="truncate" title={cvName}>
              {cvName}
            </span>
          </p>
          <div className="p-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-indigo-500/10 hover:text-indigo-600 dark:text-slate-200 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
            >
              {busy ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Icon name="upload" className="h-4 w-4" />
              )}
              {t.cvMenu.uploadNew}
            </button>
            <a
              role="menuitem"
              href={cvSource}
              download={cvName}
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-indigo-500/10 hover:text-indigo-600 dark:text-slate-200 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
            >
              <Icon name="download" className="h-4 w-4" />
              {t.cvMenu.download}
            </a>
            {cv?.exists && (
              <button
                type="button"
                role="menuitem"
                onClick={handleReset}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-rose-500/10 hover:text-rose-600 dark:text-slate-200 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
              >
                <Icon name="refresh" className="h-4 w-4" />
                {t.cvMenu.reset}
              </button>
            )}
          </div>
        </div>
      )}

      {notice && (
        <p
          role={notice.type === 'error' ? 'alert' : 'status'}
          className={`pointer-events-none absolute left-0 top-full z-20 mt-2 flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[11px] font-semibold shadow-lg backdrop-blur ${
            notice.type === 'error'
              ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
              : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
          }`}
        >
          <Icon name={notice.type === 'error' ? 'close' : 'check'} className="h-3.5 w-3.5 shrink-0" />
          {notice.text}
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
