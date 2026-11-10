import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const hasFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

let lenis: Lenis | null = null

/** Smooth wheel scrolling (touch stays native). Skipped for reduced motion. */
export function initSmoothScroll(): () => void {
  if (prefersReducedMotion()) return () => {}
  const instance = new Lenis({ lerp: 0.11 })
  lenis = instance
  instance.on('scroll', ScrollTrigger.update)
  const tick = (time: number) => instance.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(tick)
    instance.destroy()
    if (lenis === instance) lenis = null
  }
}

export function scrollToTarget(target: number | HTMLElement, immediate = false) {
  if (lenis) {
    lenis.scrollTo(target, { immediate, force: true, duration: 1.3 })
    return
  }
  const top = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY
  window.scrollTo({ top, behavior: immediate || prefersReducedMotion() ? 'auto' : 'smooth' })
}

export function scrollToHash(hash: string, immediate = false): boolean {
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  const el = id ? document.getElementById(id) : null
  if (!el) return false
  scrollToTarget(el, immediate)
  return true
}

/** Lock / unlock page scrolling (used by the mobile menu). */
export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop()
  else lenis?.start()
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

export { gsap, ScrollTrigger }
