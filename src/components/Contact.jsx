import { useEffect, useRef, useState } from 'react'
import { profile, socials } from '../data'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import { Icon } from './Icons'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500'

const errorInputClass =
  'w-full rounded-xl border border-red-400 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/15 dark:border-red-500/60 dark:bg-white/5 dark:text-white'

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID || ''
const TELEGRAM_BOT_ID = TELEGRAM_BOT_TOKEN.split(':')[0] || ''
const TELEGRAM_CHAT_IS_BOT_ID = TELEGRAM_CHAT_ID && TELEGRAM_CHAT_ID === TELEGRAM_BOT_ID

// Use your active Telegram chat ID here, not the bot ID.
// Example: VITE_TELEGRAM_CHAT_ID=123456789 or VITE_TELEGRAM_CHAT_ID=-1001234567890
// The bot must already be started in that chat or group.
const infoCards = [
  { icon: 'mail', label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  { icon: 'phone', label: 'Phone', value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}` },
  { icon: 'location', label: 'Location', value: profile.location },
]

const initialForm = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorMessage, setErrorMessage] = useState('')
  const resetTimer = useRef(null)

  useEffect(() => () => clearTimeout(resetTimer.current), [])

  const validate = (values) => {
    const next = {}
    if (!values.name.trim()) next.name = 'Please enter your name.'
    if (!values.email.trim()) {
      next.email = 'Please enter your email.'
    } else if (!EMAIL_REGEX.test(values.email.trim())) {
      next.email = 'Please enter a valid email address.'
    }
    if (!values.subject.trim()) next.subject = 'Please add a subject.'
    if (!values.message.trim()) next.message = 'Please write a message.'
    else if (values.message.trim().length < 10) next.message = 'Message should be at least 10 characters.'
    return next
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const next = { ...form, [name]: value }
    setForm(next)
    if (errors[name]) {
      const nextErrors = validate(next)
      setErrors(nextErrors)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('sending')
    setErrorMessage('')

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      setStatus('error')
      setErrorMessage(
        'Telegram is not configured. Add VITE_TELEGRAM_BOT_TOKEN and VITE_TELEGRAM_CHAT_ID to your .env file.'
      )
      return
    }

    if (TELEGRAM_CHAT_ID === TELEGRAM_BOT_ID) {
      setStatus('error')
      setErrorMessage(
        'Telegram chat ID cannot be the bot ID. Use your personal chat ID or a group ID where the bot is added.'
      )
      return
    }

    const text = `New contact form message from ${form.name} (${form.email})\nSubject: ${form.subject}\n\n${form.message}`
    const payload = {
      chat_id: TELEGRAM_CHAT_ID,
      text,
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!data.ok) {
        const description = data.description || 'Telegram send failed.'
        const normalized = String(description).toLowerCase()
        if (normalized.includes("can't send messages to the bot") || normalized.includes('bot can\'t send')) {
          throw new Error(
            'Telegram bot cannot send to itself. Use a real chat ID or group ID where the bot is a member.'
          )
        }
        throw new Error(description)
      }

      setStatus('success')
      setForm(initialForm)
      resetTimer.current = setTimeout(() => setStatus('idle'), 6000)
    } catch (error) {
      setStatus('error')
      setErrorMessage(error.message || 'Unable to send your message. Please try again.')
      resetTimer.current = setTimeout(() => setStatus('idle'), 6000)
    }
  }

  return (
    <section id="contact" className="scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Contact"
          title={
            <>
              Let's build something <span className="text-gradient">together</span>
            </>
          }
          description="Have a project in mind or just want to say hi? My inbox is always open — I'll get back to you within 24 hours."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-5">
          {/* Info */}
          <div className="space-y-5 lg:col-span-2">
            {infoCards.map((card, i) => (
              <Reveal key={card.label} delay={i * 90}>
                <a
                  href={card.href}
                  className={`group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/40 hover:shadow-lg hover:shadow-indigo-500/10 dark:border-white/10 dark:bg-slate-900 ${card.href ? '' : 'pointer-events-none'
                    }`}
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/15 to-cyan-400/15 text-indigo-500 transition-colors group-hover:text-indigo-600 dark:text-indigo-300 dark:group-hover:text-cyan-300">
                    <Icon name={card.icon} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      {card.label}
                    </p>
                    <p className="truncate font-medium text-slate-800 dark:text-slate-200">{card.value}</p>
                  </div>
                </a>
              </Reveal>
            ))}

            <Reveal delay={280}>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-white/5">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Or find me on social media</p>
                <div className="mt-3 flex items-center gap-2">
                  {socials.map((s) => (
                    <a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.name}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/60 hover:text-indigo-500 dark:border-white/10 dark:bg-transparent dark:text-slate-400 dark:hover:text-cyan-300"
                    >
                      <Icon name={s.icon} className="h-[18px] w-[18px]" />
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <Reveal delay={120} className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8 dark:border-white/10 dark:bg-slate-900"
            >
              {TELEGRAM_CHAT_IS_BOT_ID && (
                <div className="mb-6 rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                  <strong>Telegram warning:</strong> your chat ID appears to be the bot ID. A bot cannot send messages to itself.
                  Use a personal chat ID or a group ID where the bot is already started.
                </div>
              )}
              {status === 'success' && (
                <div
                  role="status"
                  className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600 dark:text-emerald-400"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Icon name="check" className="h-3.5 w-3.5" />
                  </span>
                  Message sent successfully! I'll get back to you soon.
                </div>
              )}
              {status === 'error' && (
                <div
                  role="alert"
                  className="mb-6 flex items-center gap-3 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-300"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
                    <Icon name="alert" className="h-3.5 w-3.5" />
                  </span>
                  {errorMessage || 'There was an error sending your message. Please try again.'}
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    className={errors.name ? errorInputClass : inputClass}
                  />
                  {errors.name && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className={errors.email ? errorInputClass : inputClass}
                  />
                  {errors.email && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.email}</p>}
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="subject" className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="What's this about?"
                  value={form.subject}
                  onChange={handleChange}
                  className={errors.subject ? errorInputClass : inputClass}
                />
                {errors.subject && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.subject}</p>}
              </div>

              <div className="mt-5">
                <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell me about your project..."
                  value={form.message}
                  onChange={handleChange}
                  className={`${errors.message ? errorInputClass : inputClass} resize-none`}
                />
                {errors.message && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/35 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
              >
                {status === 'sending' ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Icon name="send" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                  </>
                )}
              </button>

              <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
                Messages are delivered straight to my Telegram — I'll reply within 24 hours.
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
