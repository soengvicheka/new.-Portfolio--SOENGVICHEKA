import { navLinks, profile, socials } from '../data'
import { useLanguage } from '../hooks/useLanguage'
import { Icon } from './Icons'

export default function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="border-t border-slate-200 bg-slate-50/80 dark:border-white/10 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <a href="#home" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 font-display text-sm font-bold text-white">
                VS
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Vicheka<span className="text-gradient">.dev</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {t.footer.tagline}
            </p>
            <div className="mt-5 flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/60 hover:text-indigo-500 dark:border-white/10 dark:bg-transparent dark:text-slate-400 dark:hover:text-cyan-300"
                >
                  <Icon name={s.icon} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {t.footer.quickLinks}
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 md:grid-cols-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-slate-600 transition-colors hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-300"
                  >
                    <Icon
                      name="chevron-right"
                      className="h-3 w-3 text-indigo-400 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                    {t.nav[link.href.slice(1)]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {t.footer.getInTouch}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2.5 transition-colors hover:text-indigo-500 dark:hover:text-indigo-300">
                  <Icon name="mail" className="h-4 w-4 text-indigo-400" />
                  {profile.email}
                </a>
              </li>
              <li>
                <a href={`tel:${profile.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2.5 transition-colors hover:text-indigo-500 dark:hover:text-indigo-300">
                  <Icon name="phone" className="h-4 w-4 text-indigo-400" />
                  {profile.phone}
                </a>
              </li>
              <li className="inline-flex items-center gap-2.5">
                <Icon name="location" className="h-4 w-4 text-indigo-400" />
                {profile.location}
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {t.footer.haveProject}
            </h3>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              {t.footer.available}
            </p>
            <a
              href="#contact"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              {t.footer.letsTalk}
              <Icon name="arrow-right" className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-7 sm:flex-row dark:border-white/10">
          <p className="text-center text-xs text-slate-500 dark:text-slate-500">
            © {year} {profile.name}. {t.footer.crafted}{' '}
            <span className="inline-flex translate-y-0.5">
              <Icon name="heart" className="h-3.5 w-3.5 text-rose-500" />
            </span>{' '}
            {t.footer.using}
          </p>
          <button
            type="button"
            onClick={scrollTop}
            className="group inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400/60 hover:text-indigo-500 dark:border-white/15 dark:text-slate-300 dark:hover:text-indigo-300"
          >
            <Icon name="arrow-up" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
            {t.footer.backToTop}
          </button>
        </div>
      </div>
    </footer>
  )
}
