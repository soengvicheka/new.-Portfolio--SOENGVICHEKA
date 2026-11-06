import { projects } from '../data'
import { useLanguage } from '../hooks/useLanguage'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import { Icon } from './Icons'

// ---------------------------------------------------------------------------
//  Project type badge
//  ------------------
//  Driven entirely by the `type` value on each project in src/data.js — set
//  `type: 'Personal Project' | 'School Project'` there and the badge updates
//  automatically. Unknown values fall back to a neutral style.
// ---------------------------------------------------------------------------
const PROJECT_TYPE_STYLES = {
  'Personal Project': {
    icon: '👤',
    className:
      'bg-sky-50 text-sky-700 ring-sky-600/10 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-400/25',
  },
  'School Project': {
    icon: '🎓',
    className:
      'bg-violet-50 text-violet-700 ring-violet-600/10 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-400/25',
  },
}

const DEFAULT_PROJECT_TYPE_STYLE = {
  icon: '🏷️',
  className:
    'bg-slate-100 text-slate-700 ring-slate-600/10 dark:bg-white/10 dark:text-slate-300 dark:ring-white/20',
}

export default function Projects() {
  const { t, isKm } = useLanguage()

  const visibleProjects = projects.map((project, index) => ({
    ...project,
    title: isKm ? t.projects.titles[index] : project.title,
    description: isKm ? t.projects.descriptions[index] : project.description,
  }))

  return (
    <section id="projects" className="scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow={t.projects.eyebrow}
          title={
            <>
              {t.projects.title.before}
              <span className="text-gradient">{t.projects.title.highlight}</span>
            </>
          }
          description={t.projects.description}
        />

        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((project, index) => {
            const typeStyle = PROJECT_TYPE_STYLES[project.type] ?? DEFAULT_PROJECT_TYPE_STYLE
            return (
            <Reveal key={project.title} delay={(index % 3) * 90}>
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-400/40 hover:shadow-2xl hover:shadow-indigo-500/10 dark:border-white/10 dark:bg-slate-900">
                {/* Image */}
                <div className="relative aspect-16/10 overflow-hidden">
                  <img
                    src={project.image}
                    alt={`${t.projects.screenshotOf} ${project.title}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-100 transition-opacity duration-300 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100" />

                  {/* Quick links on hover */}
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 p-4 opacity-100 transition-all duration-300 [@media(hover:hover)]:translate-y-4 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} ${t.projects.onGithub}`}
                        className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-white/95 px-3.5 py-2 text-xs font-semibold text-slate-900 shadow-lg backdrop-blur transition-transform hover:scale-105"
                      >
                        <Icon name="github" className="h-3.5 w-3.5" />
                        {t.projects.code}
                      </a>
                    )}
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${t.projects.liveDemoOf} ${project.title}`}
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-linear-to-r from-indigo-500 to-cyan-400 px-3.5 py-2 text-xs font-semibold text-white shadow-lg transition-transform hover:scale-105"
                    >
                      <Icon name="external" className="h-3.5 w-3.5" />
                      {t.projects.liveDemo}
                    </a>
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-lg font-bold text-slate-900 transition-colors group-hover:text-indigo-500 dark:text-white dark:group-hover:text-indigo-300">
                    {project.title}
                  </h3>

                  {project.type && (
                    <span
                      className={`mt-2 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none ring-1 ring-inset ${typeStyle.className}`}
                    >
                      <span aria-hidden="true" className="text-xs leading-none">
                        {typeStyle.icon}
                      </span>
                      {t.projects.types?.[project.type] ?? project.type}
                    </span>
                  )}

                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {project.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
            )
          })}
        </div>

        <Reveal delay={120} className="mt-12 text-center">
          <a
            href="https://github.com/vichekas"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400/60 hover:text-indigo-600 dark:border-white/15 dark:text-slate-200 dark:hover:text-indigo-300"
          >
            <Icon name="github" className="h-4 w-4" />
            {t.projects.seeMore}
            <Icon name="arrow-right" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
