import { useMemo } from 'react'
import { adminKey } from '../data'

/**
 * True when the current URL carries the owner's secret key (e.g. ?key=SECRET).
 * Only the owner should know this key, so only they see the CV upload controls.
 * Visitors without the key just get a plain "Download CV" button.
 */
export function useIsOwner() {
  return useMemo(() => {
    if (!adminKey) return false
    const params = new URLSearchParams(window.location.search)
    return params.get('key') === adminKey
  }, [])
}
