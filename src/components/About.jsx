import { useState } from 'react'
import { profile } from '../data'
import { useProfilePhoto } from '../hooks/useProfilePhoto'
import { useProfileCv } from '../hooks/useProfileCv'
import { useIsOwner } from '../hooks/useIsOwner'
import { useLanguage } from '../hooks/useLanguage'
import Avatar from './Avatar'
import ChangePhotoButton from './ChangePhotoButton'
import ChangeCvButton from './ChangeCvButton'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import { Icon } from './Icons'

export default function About() {
  const [expanded, setExpanded] = useState(false)
  const [saved, setSaved] = useState(false)
  const [cvSaved, setCvSaved] = useState(false)
  const [cvError, setCvError] = useState(null)
  const [photoError, setPhotoError] = useState(null)
  const { photo } = useProfilePhoto()
  const { cv: uploadedCv, clear: clearCv } = useProfileCv()
  const isOwner = useIsOwner()
  const { t } = useLanguage()
  const profilePhoto = photo?.url || profile.image
  const cvSource = uploadedCv?.url || profile.cv
  const cvName = uploadedCv?.name || profile.cvFileName

  const showSaved = () => {
    setSaved(true)
    setPhotoError(null)
    setTimeout(() => setSaved(false), 2400)
  }

  const showPhotoError = (message) => {
    setPhotoError(message)
    setTimeout(() => setPhotoError(null), 3600)
  }

  const showCvSaved = () => {
    setCvSaved(true)
    setCvError(null)
    setTimeout(() => setCvSaved(false), 2400)
  }

  const details = [
    { icon: 'user', label: t.about.name, value: profile.name },
    { icon: 'mail', label: t.about.email, value: profile.email, href: `mailto:${profile.email}` },
    { icon: 'phone', label: t.about.phone, value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}` },
    { icon: 'location', label: t.about.location, value: profile.location },
  ]

  return (
    <section id="about" className="scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow={t.about.eyebrow}
          title={
            <>
              {t.about.title.before}
              <span className="text-gradient">{t.about.title.highlight}</span>
            </>
          }
          description={t.about.description}
        />

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-5">
          {/* Biography */}
          <div className="lg:col-span-3">
            <Reveal>
              <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                {t.about.shortBio}
              </p>

              <div
                className={`grid transition-all duration-500 ease-in-out ${
                  expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="space-y-4 pt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                    {t.about.extendedBio.map((paragraph) => (
                      <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                {expanded ? t.about.less : t.about.more}
                <Icon
                  name="chevron-right"
                  className={`h-4 w-4 transition-transform duration-300 ${expanded ? 'rotate-90' : 'group-hover:translate-x-0.5'}`}
                />
              </button>
            </Reveal>

            <Reveal delay={120} className="mt-10">
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-white/5">
                <span
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400"
                  aria-hidden="true"
                />
                <p className="font-display text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  {t.about.bringTitle}
                </p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {t.about.bring.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500 dark:text-emerald-400">
                        <Icon name="check" className="h-3 w-3" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          {/* Profile card */}
          <Reveal delay={150} className="lg:col-span-2">
            <div className="group relative">
              {/* Glow frame */}
              <div
                className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-indigo-500/25 via-transparent to-cyan-400/25 opacity-60 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden="true"
              />

              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-slate-900">
                {/* Header */}
                <div className="relative">
                  <Avatar
                    src={profilePhoto}
                    alt={`${t.about.portraitOf} ${profile.name}`}
                    initials="VS"
                    className="aspect-[16/10] w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/25 to-slate-950/20" />

                  {/* Availability badge */}
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-slate-950/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>
                    {t.about.openToWork}
                  </span>

                  {/* Camera upload — owner only */}
                  {isOwner && (
                    <div className="absolute right-4 top-4">
                      <ChangePhotoButton
                        onSaved={showSaved}
                        onError={showPhotoError}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/55 text-white shadow-lg backdrop-blur transition-all duration-200 hover:scale-105 hover:bg-indigo-500"
                      />
                    </div>
                  )}

                  {isOwner && photoError && (
                    <p
                      role="alert"
                      className="pointer-events-none absolute right-4 top-16 max-w-[80%] rounded-full bg-rose-500/90 px-3.5 py-1.5 text-[11px] font-semibold text-white shadow-lg backdrop-blur"
                    >
                      {photoError}
                    </p>
                  )}

                  {/* Saved feedback */}
                  {saved && (
                    <p
                      role="status"
                      className="pointer-events-none absolute left-1/2 top-5 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-slate-950/70 px-3.5 py-1.5 text-[11px] font-semibold text-white backdrop-blur"
                    >
                      <Icon name="check" className="h-3.5 w-3.5 text-emerald-400" />
                      {t.about.photoSaved}
                    </p>
                  )}

                  {/* Name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="font-display text-xl font-bold text-white drop-shadow">
                      {profile.name}
                    </p>
                    <p className="text-sm font-medium text-slate-300">{profile.title}</p>
                  </div>
                </div>

                {/* Details */}
                <dl className="divide-y divide-slate-100 dark:divide-white/5">
                  {details.map((item) => (
                    <div
                      key={item.label}
                      className="group/row flex items-center gap-3.5 px-5 py-3.5 transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-white/5"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 transition-all duration-300 group-hover/row:bg-gradient-to-br group-hover/row:from-indigo-500 group-hover/row:to-cyan-400 group-hover/row:text-white dark:text-indigo-300">
                        <Icon name={item.icon} className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <dt className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                          {item.label}
                        </dt>
                        <dd className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                          {item.href ? (
                            <a
                              href={item.href}
                              className="transition-colors hover:text-indigo-500 dark:hover:text-indigo-300"
                            >
                              {item.value}
                            </a>
                          ) : (
                            item.value
                          )}
                        </dd>
                      </div>
                      {item.href && (
                        <Icon
                          name="arrow-right"
                          className="ml-auto h-4 w-4 shrink-0 text-slate-300 opacity-0 transition-all duration-300 group-hover/row:translate-x-0.5 group-hover/row:opacity-100 dark:text-slate-600"
                        />
                      )}
                    </div>
                  ))}

                  {/* Availability row */}
                  <div className="flex items-center gap-3.5 px-5 py-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
                      <Icon name="check" className="h-4 w-4" />
                    </span>
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        {t.about.availabilityLabel}
                      </dt>
                      <dd className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                        {t.about.availability}
                      </dd>
                    </div>
                  </div>
                </dl>

                {/* CV footer */}
                <div className="border-t border-slate-100 p-5 dark:border-white/5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      {t.about.cv}
                    </p>
                    {isOwner && (
                      <div className="flex items-center gap-1.5">
                        {uploadedCv?.exists && (
                          <button
                            type="button"
                            onClick={() => {
                              clearCv()
                              setCvError(null)
                            }}
                            aria-label={t.about.resetCv}
                            title={t.about.resetCvTitle}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-400/60 hover:text-rose-500 dark:border-white/10 dark:text-slate-500 dark:hover:text-rose-400"
                          >
                            <Icon name="refresh" className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <ChangeCvButton
                          onSaved={showCvSaved}
                          onError={setCvError}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-400/60 hover:text-indigo-500 dark:border-white/10 dark:text-slate-400 dark:hover:border-indigo-400/50 dark:hover:text-indigo-300"
                        />
                      </div>
                    )}
                  </div>

                  <p className="mt-2 flex items-center gap-1.5 truncate text-xs font-medium text-slate-500 dark:text-slate-400" title={cvName}>
                    <Icon name="file" className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
                    <span className="truncate">{cvName}</span>
                  </p>

                  <a
                    href={cvSource}
                    download={cvName}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/40"
                  >
                    <Icon name="download" className="h-4 w-4" />
                    {t.about.downloadCv}
                  </a>

                  {cvSaved && (
                    <p
                      role="status"
                      className="mt-2.5 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400"
                    >
                      <Icon name="check" className="h-3.5 w-3.5" />
                      {t.about.cvSaved}
                    </p>
                  )}
                  {cvError && (
                    <p
                      role="alert"
                      className="mt-2.5 flex items-center justify-center gap-1.5 rounded-lg bg-rose-500/10 px-3 py-1.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400"
                    >
                      <Icon name="close" className="h-3.5 w-3.5 shrink-0" />
                      {cvError}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
