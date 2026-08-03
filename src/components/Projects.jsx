import { projects } from '../data'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import { Icon } from './Icons'

export default function Projects() {
  return (
    <section id="projects" className="scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Portfolio"
          title={
            <>
              Featured <span className="text-gradient">projects</span>
            </>
          }
          description="A selection of things I've designed and built recently. Every project solves a real problem with clean, thoughtful engineering."
        />

        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal key={project.title} delay={(index % 3) * 90}>
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-400/40 hover:shadow-2xl hover:shadow-indigo-500/10 dark:border-white/10 dark:bg-slate-900">
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={project.image}
                    alt={`Screenshot of ${project.title}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Quick links on hover */}
                  <div className="absolute inset-x-0 bottom-0 flex translate-y-4 items-center justify-center gap-3 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} on GitHub`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3.5 py-2 text-xs font-semibold text-slate-900 shadow-lg backdrop-blur transition-transform hover:scale-105"
                    >
                      <Icon name="github" className="h-3.5 w-3.5" />
                      Code
                    </a>
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Live demo of ${project.title}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 px-3.5 py-2 text-xs font-semibold text-white shadow-lg transition-transform hover:scale-105"
                    >
                      <Icon name="external" className="h-3.5 w-3.5" />
                      Live Demo
                    </a>
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-lg font-bold text-slate-900 transition-colors group-hover:text-indigo-500 dark:text-white dark:group-hover:text-indigo-300">
                    {project.title}
                  </h3>
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
          ))}
        </div>

        <Reveal delay={120} className="mt-12 text-center">
          <a
            href="https://github.com/vichekas"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400/60 hover:text-indigo-600 dark:border-white/15 dark:text-slate-200 dark:hover:text-indigo-300"
          >
            <Icon name="github" className="h-4 w-4" />
            See more on GitHub
            <Icon name="arrow-right" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
