import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { useHref, useLocation, useNavigate } from 'react-router-dom'
import { lockScroll, prefersReducedMotion, scrollToHash, scrollToTarget } from '../lib/scroll'

type Phase = 'idle' | 'cover' | 'reveal'

const TransitionContext = createContext<(to: string) => void>(() => {})

const COVER_MS = 500
const REVEAL_MS = 650

const trimSlash = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p)

/**
 * Route changes play a short curtain wipe; same-page anchors just scroll.
 * Use <TLink> (or useTransitionNav) instead of react-router's <Link>.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [phase, setPhase] = useState<Phase>('idle')
  const busy = useRef(false)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  const go = useCallback(
    (to: string) => {
      const [rawPath, hash = ''] = to.split('#')
      const path = rawPath || location.pathname
      const samePage = trimSlash(path) === trimSlash(location.pathname)

      if (samePage) {
        // The mobile menu locks scrolling; release it before animating.
        lockScroll(false)
        if (hash) scrollToHash(hash)
        else scrollToTarget(0)
        navigate(to, { replace: true, preventScrollReset: true })
        return
      }
      if (busy.current) return
      if (prefersReducedMotion()) {
        navigate(to)
        return
      }
      busy.current = true
      setPhase('cover')
      timers.current.push(
        window.setTimeout(() => {
          navigate(to)
          timers.current.push(
            window.setTimeout(() => {
              setPhase('reveal')
              timers.current.push(
                window.setTimeout(() => {
                  setPhase('idle')
                  busy.current = false
                }, REVEAL_MS),
              )
            }, 80),
          )
        }, COVER_MS),
      )
    },
    [location.pathname, navigate],
  )

  return (
    <TransitionContext.Provider value={go}>
      {children}
      <div className="curtain" data-phase={phase} aria-hidden="true">
        <span className="curtain__mark">Nandu K V</span>
      </div>
    </TransitionContext.Provider>
  )
}

export const useTransitionNav = () => useContext(TransitionContext)

interface TLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string
}

/** Internal link with the page transition. Renders a real <a href>. */
export function TLink({ to, onClick, children, ...rest }: TLinkProps) {
  const go = useTransitionNav()
  const href = useHref(to)
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    go(to)
  }
  return (
    <a href={href} onClick={handle} {...rest}>
      {children}
    </a>
  )
}
