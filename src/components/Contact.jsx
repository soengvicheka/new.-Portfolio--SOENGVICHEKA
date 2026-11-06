import { useLanguage } from '../hooks/useLanguage'
import { profile, socials } from '../data'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import { Icon } from './Icons'

const infoCards = [
  { icon: 'mail', labelKey: 'email', value: profile.email, href: `mailto:${profile.email}` },
  { icon: 'phone', labelKey: 'phone', value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}` },
  { icon: 'location', labelKey: 'location', value: profile.location },
]

export default function Contact() {
  const { t } = useLanguage()

  return (
    <section id="contact" className="scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow={t.contact.eyebrow}
          title={
            <>
              {t.contact.title.before}
              <span className="text-gradient">{t.contact.title.highlight}</span>
            </>
          }
          description={t.contact.description}
        />

        <div className="mx-auto mt-14 max-w-2xl">
          <div className="space-y-5">
            {infoCards.map((card, i) => (
              <Reveal key={card.labelKey} delay={i * 90}>
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
                      {t.contact[card.labelKey]}
                    </p>
                    <p className="truncate font-medium text-slate-800 dark:text-slate-200">{card.value}</p>
                  </div>
                </a>
              </Reveal>
            ))}

            <Reveal delay={280}>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-white/5">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t.contact.orSocial}</p>
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

        </div>
      </div>
    </section>
  )
}
