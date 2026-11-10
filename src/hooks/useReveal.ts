import { useEffect } from 'react'
import { prefersReducedMotion } from '../lib/scroll'

/**
 * Adds `.is-in` to every [data-reveal] element as it scrolls into view.
 * The animations themselves live in CSS (see base.css), so they stay cheap.
 * Call once per page; pass a key (e.g. the slug) to re-scan on content change.
 */
export function useReveal(key?: unknown) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)'))
    if (!els.length) return
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-in')
          io.unobserve(entry.target)
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key])
}
