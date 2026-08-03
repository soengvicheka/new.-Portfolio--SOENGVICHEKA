import { useEffect, useState } from 'react'

/**
 * Animates from 0 to `target` with cubic ease-out once `start` is true.
 */
export function useCountUp(target, { duration = 1800, start = false } = {}) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!start) return

    let rafId
    const startTime = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [start, target, duration])

  return value
}
