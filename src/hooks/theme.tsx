import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { site } from '../data/site'
import { prefersReducedMotion } from '../lib/scroll'

export type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  /** Pass the click position to grow the new theme from the toggle. */
  toggle: (origin?: { x: number; y: number }) => void
}

const ThemeContext = createContext<ThemeContextValue>({ theme: 'dark', toggle: () => {} })

const STORAGE_KEY = 'theme'

function readInitialTheme(): Theme {
  // index.html sets data-theme before first paint (saved choice, else system).
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', site.themeColor[theme])
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readInitialTheme)

  // Follow the system setting until the visitor makes an explicit choice.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = (e: MediaQueryListEvent) => {
      let saved: string | null = null
      try {
        saved = localStorage.getItem(STORAGE_KEY)
      } catch {
        /* storage unavailable */
      }
      if (saved) return
      const next: Theme = e.matches ? 'light' : 'dark'
      applyTheme(next)
      setTheme(next)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggle = useCallback(
    (origin?: { x: number; y: number }) => {
      const next: Theme = theme === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        /* storage unavailable: theme still switches for this visit */
      }
      const commit = () => {
        applyTheme(next)
        flushSync(() => setTheme(next))
      }
      const root = document.documentElement

      if (prefersReducedMotion()) {
        commit()
        return
      }

      if (typeof document.startViewTransition !== 'function') {
        root.classList.add('theme-fade')
        commit()
        window.setTimeout(() => root.classList.remove('theme-fade'), 550)
        return
      }

      const x = origin?.x ?? window.innerWidth - 40
      const y = origin?.y ?? 40
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
      const transition = document.startViewTransition(commit)
      transition.ready
        .then(() => {
          root.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            { duration: 750, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
          )
        })
        .catch(() => {
          /* transition skipped: theme is already applied */
        })
    },
    [theme],
  )

  const value = useMemo(() => ({ theme, toggle }), [theme, toggle])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
