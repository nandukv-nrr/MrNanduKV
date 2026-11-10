import { useEffect, useRef } from 'react'
import type { Theme } from '../../hooks/theme'
import { prefersReducedMotion } from '../../lib/scroll'
import { createHeroScene, PALETTES, type HeroSceneApi } from './scene'

/**
 * Canvas wrapper for the hero scene. Loaded lazily (three.js is its own chunk)
 * and only renders while the hero is on screen and the tab is visible.
 */
export default function HeroScene({ theme, onFail }: { theme: Theme; onFail: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const apiRef = useRef<HeroSceneApi | null>(null)
  const themeRef = useRef(theme)
  themeRef.current = theme

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let api: HeroSceneApi
    try {
      api = createHeroScene(canvas, PALETTES[themeRef.current], prefersReducedMotion())
    } catch {
      onFail()
      return
    }
    apiRef.current = api
    canvas.classList.add('is-ready')

    let onScreen = true
    const sync = () => api.setActive(onScreen && !document.hidden)
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      sync()
    })
    io.observe(canvas)
    document.addEventListener('visibilitychange', sync)
    const onLost = (e: Event) => {
      e.preventDefault()
      onFail()
    }
    canvas.addEventListener('webglcontextlost', onLost)
    sync()

    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
      canvas.removeEventListener('webglcontextlost', onLost)
      api.dispose()
      apiRef.current = null
    }
  }, [onFail])

  useEffect(() => {
    apiRef.current?.setPalette(PALETTES[theme])
  }, [theme])

  return <canvas ref={canvasRef} className="hero__canvas" />
}
