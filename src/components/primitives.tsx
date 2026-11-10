import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { gsap, hasFinePointer, prefersReducedMotion } from '../lib/scroll'

/** Word-by-word masked text. Animates when the nearest [data-reveal="split"] enters view. */
export function Split({ text, offset = 0 }: { text: string; offset?: number }) {
  const words = text.split(' ')
  return (
    <span className="split">
      {words.map((word, i) => (
        <span key={i}>
          <span className="split__w">
            <span style={{ '--i': i + offset } as CSSProperties}>{word}</span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </span>
  )
}

/** Pulls its child gently toward the pointer. No-op on touch / reduced motion. */
export function Magnetic({ children, strength = 0.28 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !hasFinePointer() || prefersReducedMotion()) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => {
      xTo(0)
      yTo(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      gsap.killTweensOf(el)
    }
  }, [strength])

  return (
    <span ref={ref} className="magnetic">
      {children}
    </span>
  )
}

/** 3D pointer tilt for a card. Sets --rx / --ry / --px / --py on the element. */
export function Tilt({ children, className = '', max = 7 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !hasFinePointer() || prefersReducedMotion()) return
    const state = { rx: 0, ry: 0 }
    const apply = () => {
      el.style.setProperty('--rx', `${state.rx.toFixed(2)}deg`)
      el.style.setProperty('--ry', `${state.ry.toFixed(2)}deg`)
    }
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      gsap.to(state, { rx: -py * max, ry: px * max, duration: 0.6, ease: 'power3.out', onUpdate: apply, overwrite: true })
    }
    const leave = () => {
      gsap.to(state, { rx: 0, ry: 0, duration: 1, ease: 'elastic.out(1, 0.6)', onUpdate: apply, overwrite: true })
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      gsap.killTweensOf(state)
    }
  }, [max])

  return (
    <div ref={ref} className={`tilt ${className}`}>
      {children}
    </div>
  )
}

export function SectionHead({ index, label, children }: { index: string; label: string; children: ReactNode }) {
  return (
    <header className="section-head">
      <div className="section-head__bar mono">
        <span className="section-head__index">{index}</span>
        <span>{label}</span>
        <span className="rule" data-reveal="line" aria-hidden="true" />
      </div>
      <h2 className="section-head__title" data-reveal="split">
        {children}
      </h2>
    </header>
  )
}

export function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V21c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
    </svg>
  )
}

export function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11H3zM9.5 9.75h3.8v1.5h.06c.53-1 1.82-1.8 3.64-1.8 3.9 0 4.5 2.4 4.5 5.6v5.7h-4v-5.05c0-1.2-.02-2.75-1.7-2.75s-1.95 1.3-1.95 2.66v5.14h-4z" />
    </svg>
  )
}
