import { useState } from 'react'
import { profile, socials } from '../data'
import { useProfilePhoto } from '../hooks/useProfilePhoto'
import { useIsOwner } from '../hooks/useIsOwner'
import { useLanguage } from '../hooks/useLanguage'
import Avatar from './Avatar'
import ChangePhotoButton from './ChangePhotoButton'
import DownloadCvButton from './DownloadCvButton'
import Typewriter from './Typewriter'
import { Icon } from './Icons'

export default function Hero() {
  const { photo, clear } = useProfilePhoto()
  const isOwner = useIsOwner()
  const { t } = useLanguage()
  const profilePhoto = photo?.url || profile.image
  const [flash, setFlash] = useState(false)
  const [photoError, setPhotoError] = useState(null)

  const showSaved = () => {
    setFlash(true)
    setTimeout(() => setFlash(false), 2600)
  }

  const showPhotoError = (message) => {
    setPhotoError(message)
    setTimeout(() => setPhotoError(null), 3600)
  }

  // Role cards under the photo — driven by profile.roles in src/data.js
  const roleChips = profile.roles.map((role) => {
    const lower = role.toLowerCase()
    const icon = lower.includes('ui') || lower.includes('ux') ? 'pen' : lower.includes('graphic') ? 'palette' : 'code'
    const color =
      icon === 'code'
        ? 'text-indigo-500 dark:text-indigo-300'
        : icon === 'pen'
          ? 'text-fuchsia-500 dark:text-fuchsia-300'
          : 'text-amber-500 dark:text-amber-300'
    return { label: role, icon, color }
  })

  return (
    <section id="home" className="relative scroll-mt-24 overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-24">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black,transparent)]" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-indigo-500/15 blur-3xl dark:bg-indigo-500/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-40 top-1/2 h-[26rem] w-[26rem] rounded-full bg-cyan-400/15 blur-3xl dark:bg-cyan-400/10"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
        {/* ---- Left column ---- */}
        <div>
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {t.hero.available}
          </div>

          <h1
            className="mt-6 animate-fade-up font-display text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl xl:text-6xl dark:text-white"
            style={{ animationDelay: '80ms' }}
          >
            {t.hero.hi}{' '}
            <span className="text-gradient">{profile.name}</span>
          </h1>

          <p
            className="mt-4 animate-fade-up font-display text-xl font-semibold text-slate-700 sm:text-2xl dark:text-slate-200"
            style={{ animationDelay: '160ms' }}
          >
            <Typewriter words={t.hero.roles} />
          </p>

          <p
            className="mt-5 max-w-xl animate-fade-up text-base leading-relaxed text-slate-600 dark:text-slate-400"
            style={{ animationDelay: '240ms' }}
          >
            {t.hero.tagline}
          </p>

          {/* CTAs */}
          <div
            className="mt-8 flex animate-fade-up flex-wrap items-center gap-3.5"
            style={{ animationDelay: '320ms' }}
          >
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/40"
            >
              {t.hero.viewWork}
              <Icon name="arrow-right" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400/60 hover:text-indigo-600 dark:border-white/15 dark:text-slate-200 dark:hover:border-indigo-400/50 dark:hover:text-indigo-300"
            >
              {t.hero.letsTalk}
              <Icon name="send" className="h-4 w-4" />
            </a>
            <DownloadCvButton />
          </div>

          {/* Socials + quick stats */}
          <div className="mt-10 animate-fade-up border-t border-slate-200 pt-6 dark:border-white/10" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {t.hero.findMeOn}
              </span>
              <span className="h-px w-8 bg-slate-200 dark:bg-white/10" />
              <div className="flex items-center gap-2">
                {socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    title={s.name}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/60 hover:text-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 dark:border-white/10 dark:text-slate-400 dark:hover:text-cyan-300"
                  >
                    <Icon name={s.icon} className="h-[18px] w-[18px]" />
                  </a>
                ))}
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-3 gap-4">
              {[
                { value: `${profile.yearsExperience}+`, label: t.hero.yearsExp },
                { value: `${profile.projectsCompleted}+`, label: t.hero.projectsDone },
                { value: `${profile.happyClients}+`, label: t.hero.happyClients },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="sr-only">{item.label}</dt>
                  <dd className="font-display text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
                    <span className="text-gradient">{item.value}</span>
                  </dd>
                  <dd className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{item.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* ---- Right column: profile image ---- */}
        <div className="relative mx-auto w-full max-w-sm animate-fade-up lg:max-w-md" style={{ animationDelay: '250ms' }}>
          <div
            className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/20 via-transparent to-cyan-400/20 blur-2xl"
            aria-hidden="true"
          />
          <div className="relative rounded-[2rem] bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 p-[3px] shadow-2xl shadow-indigo-500/20">
            <div className="relative rounded-[1.85rem] bg-white p-2 dark:bg-slate-900">
              <Avatar
                src={profilePhoto}
                alt={`${t.hero.portraitOf} ${profile.name}`}
                initials={profile.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
                className="aspect-[4/4.4] w-full rounded-[1.6rem]"
              />

              {/* Photo controls — owner only */}
              {isOwner && (
                <div className="absolute right-4 top-4 flex items-center gap-2">
                  {photo?.exists && (
                    <button
                      type="button"
                      onClick={clear}
                      aria-label={t.hero.resetPhoto}
                      title={t.hero.resetPhoto}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-lg backdrop-blur transition-all duration-200 hover:scale-105 hover:text-red-500 dark:bg-slate-900/90 dark:text-slate-300"
                    >
                      <Icon name="close" className="h-4 w-4" />
                    </button>
                  )}
                  <ChangePhotoButton
                    onSaved={showSaved}
                    onError={showPhotoError}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/40 transition-all duration-200 hover:scale-105"
                  />
                </div>
              )}

              {/* Helper hint / saved feedback */}
              {isOwner && flash && (
                <p
                  role="status"
                  className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-slate-950/70 px-3.5 py-1.5 text-[11px] font-semibold text-white backdrop-blur"
                >
                  <Icon name="check" className="h-3.5 w-3.5 text-emerald-400" />
                  {t.hero.photoSaved}
                </p>
              )}
              {isOwner && photoError && (
                <p
                  role="alert"
                  className="pointer-events-none absolute bottom-6 left-1/2 flex max-w-[90%] -translate-x-1/2 items-center gap-1.5 rounded-full bg-rose-500/90 px-3.5 py-1.5 text-center text-[11px] font-semibold text-white shadow-lg backdrop-blur"
                >
                  <Icon name="close" className="h-3.5 w-3.5 shrink-0" />
                  {photoError}
                </p>
              )}
              {isOwner && !photo?.exists && !flash && !photoError && (
                <p className="pointer-events-none absolute bottom-5 left-5 rounded-full bg-slate-950/55 px-3 py-1.5 text-[11px] font-medium text-white/90 backdrop-blur">
                  {t.hero.cameraHint}
                </p>
              )}
            </div>
          </div>

          {/* Role cards */}
          <div className="relative z-10 -mt-5 flex flex-wrap items-center justify-center gap-2.5">
            {roleChips.map((chip) => (
              <span
                key={chip.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-lg backdrop-blur transition-transform duration-300 hover:-translate-y-0.5 dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-200"
              >
                <Icon name={chip.icon} className={`h-3.5 w-3.5 ${chip.color}`} />
                {chip.label}
              </span>
            ))}
          </div>

          {/* Floating chips */}
          <div className="absolute -left-6 top-10 animate-float rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-white/10 dark:bg-slate-900/90">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-300">
                <Icon name="code" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">React.js</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.hero.frontend}</p>
              </div>
            </div>
          </div>

          <div className="absolute -right-4 bottom-12 animate-float-slow rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-white/10 dark:bg-slate-900/90">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500 dark:text-cyan-300">
                <Icon name="briefcase" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{profile.yearsExperience}+ {t.hero.years}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.hero.experience}</p>
              </div>
            </div>
          </div>


        </div>
      </div>

      {/* Scroll hint */}
      <div className="mt-16 hidden justify-center lg:flex" aria-hidden="true">
        <a href="#about" className="group flex flex-col items-center gap-2 text-slate-400 transition-colors hover:text-indigo-500 dark:text-slate-500">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em]">{t.hero.scroll}</span>
          <span className="flex h-9 w-5.5 items-start justify-center rounded-full border-2 border-current p-1">
            <span className="h-2 w-1 animate-bounce rounded-full bg-current" />
          </span>
        </a>
      </div>
    </section>
  )
}
