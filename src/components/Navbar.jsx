import { useEffect, useState } from 'react'
import { navLinks } from '../data'
import { useTheme } from '../hooks/useTheme'
import { Icon } from './Icons'

export default function Navbar() {
  const { theme, toggle } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('#home')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)

      const offset = 140
      let current = '#home'
      for (const link of navLinks) {
        const el = document.querySelector(link.href)
        if (el && el.getBoundingClientRect().top <= offset) current = link.href
      }
      setActive(current)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu after clicking a link
  const handleNavClick = () => setOpen(false)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80'
          : 'bg-transparent'
      }`}
    >
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <a href="#home" className="group flex items-center gap-2.5" onClick={handleNavClick}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 font-display text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-105">
            VS
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Vicheka<span className="text-gradient">.dev</span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  active === link.href
                    ? 'text-indigo-600 dark:text-indigo-300'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {link.label}
                {active === link.href && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" />
                )}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all duration-200 hover:border-indigo-400/50 hover:text-indigo-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-cyan-300"
          >
            {theme === 'dark' ? <Icon name="sun" className="h-[18px] w-[18px]" /> : <Icon name="moon" className="h-[18px] w-[18px]" />}
          </button>

          <a
            href="#contact"
            className="hidden rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30 sm:inline-flex"
          >
            Hire Me
          </a>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 lg:hidden"
          >
            {open ? <Icon name="close" /> : <Icon name="menu" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-slate-200/70 bg-white/95 backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-slate-950/95 lg:hidden ${
          open ? 'max-h-[420px] border-b' : 'max-h-0'
        }`}
      >
        <ul className="space-y-1 px-6 py-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={handleNavClick}
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active === link.href
                    ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="pt-2">
            <a
              href="#contact"
              onClick={handleNavClick}
              className="block rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              Hire Me
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
