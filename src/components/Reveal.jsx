import { useInView } from '../hooks/useInView'

/**
 * Fades/slides children into view the first time they enter the viewport.
 * `delay` is in milliseconds.
 */
export default function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }) {
  const { ref, inView } = useInView()

  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
