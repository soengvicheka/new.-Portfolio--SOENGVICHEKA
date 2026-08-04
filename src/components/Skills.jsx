import { hardSkills, softSkills } from '../data'
import { useInView } from '../hooks/useInView'
import { useLanguage } from '../hooks/useLanguage'
import { Icon } from './Icons'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

// Khmer names for hard skills that contain translatable words (proper nouns stay as-is).
const HARD_SKILL_NAMES_KM = {
  'Photoshop (Basic)': 'Photoshop (មូលដ្ឋាន)',
}

// Khmer names for the soft skills, index-aligned with softSkills in data.js.
const SOFT_SKILL_NAMES_KM = [
  'ការគ្រប់គ្រងគម្រោង',
  'ការងារជាក្រុម និងកិច្ចសហការ',
  'ការដោះស្រាយបញ្ហា',
  'ការសម្របខ្លួន',
  'ការទំនាក់ទំនង',
  'ការគ្រប់គ្រងពេលវេលា / កិច្ចការ',
]

function SkillBar({ skill, index, started }) {
  const { isKm } = useLanguage()
  const name = isKm ? HARD_SKILL_NAMES_KM[skill.name] || skill.name : skill.name
  return (
    <Reveal delay={index * 70}>
      <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/40 hover:shadow-lg hover:shadow-indigo-500/10 dark:border-white/10 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">{name}</h3>
          <span className="rounded-lg bg-indigo-500/10 px-2 py-0.5 font-display text-xs font-bold text-indigo-600 dark:text-indigo-300">
            {skill.level}%
          </span>
        </div>
        <div className="mt-3.5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-[0_0_12px_rgba(99,102,241,0.5)] transition-[width] duration-[1200ms] ease-out"
            style={{
              width: started ? `${skill.level}%` : '0%',
              transitionDelay: `${150 + index * 90}ms`,
            }}
          />
        </div>
      </div>
    </Reveal>
  )
}

function SubHeading({ icon, title, subtitle }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/30">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <div>
        <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
    </div>
  )
}

export default function Skills() {
  const { ref, inView } = useInView({ threshold: 0.2 })
  const { t, isKm } = useLanguage()

  return (
    <section id="skills" className="scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow={t.skills.eyebrow}
          title={
            <>
              {t.skills.title.before}
              <span className="text-gradient">{t.skills.title.highlight}</span>
            </>
          }
          description={t.skills.description}
        />

        {/* Hard skills */}
        <div ref={ref} className="mt-14">
          <SubHeading icon="code" title={t.skills.hardTitle} subtitle={t.skills.hardSubtitle} />
          <div className="grid gap-5 sm:grid-cols-2">
            {hardSkills.map((skill, index) => (
              <SkillBar key={skill.name} skill={skill} index={index} started={inView} />
            ))}
          </div>
        </div>

        {/* Soft skills */}
        <div className="mt-14">
          <SubHeading icon="heart" title={t.skills.softTitle} subtitle={t.skills.softSubtitle} />
          <div className="flex flex-wrap gap-3">
            {softSkills.map((skill, index) => (
              <Reveal key={skill.name} delay={index * 60}>
                <div className="group flex cursor-default items-center gap-2.5 rounded-full border border-slate-200 bg-white py-2 pl-2 pr-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400/40 hover:shadow-md hover:shadow-indigo-500/10 dark:border-white/10 dark:bg-slate-900">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500 transition-colors duration-300 group-hover:bg-indigo-500 group-hover:text-white dark:text-indigo-300">
                    <Icon name={skill.icon} className="h-4 w-4" />
                  </span>
                  <span className="font-display text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {isKm ? SOFT_SKILL_NAMES_KM[index] : skill.name}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={150} className="mt-12 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t.skills.learning}{' '}
            <span className="font-semibold text-indigo-500 dark:text-indigo-300">GraphQL</span>{' '}
            {t.skills.and}{' '}
            <span className="font-semibold text-indigo-500 dark:text-indigo-300">Docker</span>.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
