import { process } from '../data'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import { Icon } from './Icons'

export default function Process() {
  return (
    <section id="process" className="scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Work Process"
          title={
            <>
              How I <span className="text-gradient">bring ideas to life</span>
            </>
          }
          description="A clear, collaborative process that keeps you informed at every step — from first idea to final launch."
        />

        <div className="relative mx-auto mt-16 max-w-3xl">
          {/* Timeline line */}
          <div
            className="absolute bottom-6 left-5 top-6 w-px bg-gradient-to-b from-indigo-500/70 via-cyan-400/40 to-transparent lg:left-1/2 lg:-translate-x-1/2"
            aria-hidden="true"
          />

          <div className="space-y-10 lg:space-y-12">
            {process.map((step, index) => {
              const isLeft = index % 2 === 0
              return (
                <Reveal key={step.title} delay={index * 60}>
                  <div
                    className={`relative flex items-start ${
                      isLeft ? 'lg:justify-start' : 'lg:justify-end'
                    }`}
                  >
                    {/* Dot on the line */}
                    <span
                      className="absolute left-5 top-2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border-2 border-indigo-500/40 bg-white text-indigo-500 shadow-md dark:border-indigo-400/40 dark:bg-slate-950 dark:text-indigo-300 lg:left-1/2 lg:top-10 lg:-translate-x-1/2"
                      aria-hidden="true"
                    >
                      <Icon name={step.icon} className="h-4.5 w-4.5" />
                    </span>

                    {/* Card */}
                    <div
                      className={`group w-full pl-14 lg:w-1/2 ${
                        isLeft ? 'lg:pl-0 lg:pr-14' : 'lg:pl-14'
                      }`}
                    >
                      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/40 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-white/10 dark:bg-slate-900">
                        <span className="font-display text-3xl font-bold text-slate-100 transition-colors group-hover:text-indigo-500/25 dark:text-white/5">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h3 className="mt-1 font-display text-lg font-bold text-slate-900 dark:text-white">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
