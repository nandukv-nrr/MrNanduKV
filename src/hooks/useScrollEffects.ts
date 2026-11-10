import { useEffect } from 'react'
import { gsap, prefersReducedMotion, ScrollTrigger } from '../lib/scroll'

/**
 * Scroll-linked motion for the current page:
 *  - [data-parallax="n"]  drifts by ±n% of its own height while in view
 *  - [data-scrub-line]    grows top-to-bottom as its parent scrolls past
 */
export function useScrollEffects(key?: unknown) {
  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        const amount = Number(el.dataset.parallax) || 6
        gsap.fromTo(
          el,
          { yPercent: -amount },
          {
            yPercent: amount,
            ease: 'none',
            scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
      gsap.utils.toArray<HTMLElement>('[data-scrub-line]').forEach((el) => {
        gsap.fromTo(
          el,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: el.parentElement ?? el, start: 'top 70%', end: 'bottom 70%', scrub: 0.4 },
          },
        )
      })
    })
    // Fonts and images shift layout after first paint; re-measure once settled.
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh).catch(() => {})
    window.addEventListener('load', refresh)
    return () => {
      window.removeEventListener('load', refresh)
      ctx.revert()
    }
  }, [key])
}
