import Reveal from './Reveal'

export default function SectionHeading({ eyebrow, title, description, align = 'center' }) {
  const centered = align === 'center'

  return (
    <Reveal className={`max-w-2xl ${centered ? 'mx-auto text-center' : ''}`}>
      <span
        className={`inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:border-indigo-400/20 dark:bg-indigo-400/10 dark:text-indigo-300`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" />
        {eyebrow}
      </span>
      <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
          {description}
        </p>
      )}
    </Reveal>
  )
}
