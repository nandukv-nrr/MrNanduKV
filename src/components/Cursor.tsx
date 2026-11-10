import { useEffect, useRef } from 'react'
import { hasFinePointer, prefersReducedMotion } from '../lib/scroll'

/**
 * Custom cursor for mouse users: a dot that tracks exactly and a ring that
 * trails. Touch devices and reduced-motion visitors keep the native cursor.
 * Add data-cursor="Label" to an element to show a labelled state.
 */
export function Cursor() {
  const root = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLSpanElement>(null)
  const ring = useRef<HTMLSpanElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return
    const rootEl = root.current
    const dotEl = dot.current
    const ringEl = ring.current
    const labelEl = label.current
    if (!rootEl || !dotEl || !ringEl || !labelEl) return

    document.documentElement.classList.add('has-cursor')
    const pos = { x: -100, y: -100 }
    const lag = { x: -100, y: -100 }
    let raf = 0
    let running = false

    const frame = () => {
      lag.x += (pos.x - lag.x) * 0.18
      lag.y += (pos.y - lag.y) * 0.18
      ringEl.style.transform = `translate3d(${lag.x}px, ${lag.y}px, 0)`
      if (Math.abs(pos.x - lag.x) + Math.abs(pos.y - lag.y) > 0.1) raf = requestAnimationFrame(frame)
      else running = false
    }

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      pos.x = e.clientX
      pos.y = e.clientY
      dotEl.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      if (!rootEl.classList.contains('is-visible')) {
        lag.x = pos.x
        lag.y = pos.y
        rootEl.classList.add('is-visible')
      }
      if (!running) {
        running = true
        raf = requestAnimationFrame(frame)
      }
    }

    const over = (e: Event) => {
      const target = e.target instanceof Element ? e.target : null
      const labelled = target?.closest<HTMLElement>('[data-cursor]')
      if (labelled) {
        labelEl.textContent = labelled.dataset.cursor ?? ''
        rootEl.dataset.state = 'label'
      } else if (target?.closest('a, button, [role="button"], label, summary')) {
        rootEl.dataset.state = 'link'
      } else {
        rootEl.dataset.state = 'default'
      }
    }

    const hide = () => rootEl.classList.remove('is-visible')

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over, { passive: true })
    document.documentElement.addEventListener('pointerleave', hide)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', hide)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  return (
    <div ref={root} className="cursor" data-state="default" aria-hidden="true">
      <span ref={ring} className="cursor__ring">
        <span ref={label} className="cursor__label" />
      </span>
      <span ref={dot} className="cursor__dot" />
    </div>
  )
}
