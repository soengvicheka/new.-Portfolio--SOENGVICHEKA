import { useEffect, useState } from 'react'
import { Icon } from './Icons'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="group fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-xl shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/40"
    >
      <Icon name="arrow-up" className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  )
}
