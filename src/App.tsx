import { Component, lazy, Suspense, useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { BrowserRouter, Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import { Cursor } from './components/Cursor'
import { Footer } from './components/Footer'
import { Nav } from './components/Nav'
import { profile } from './data/profile'
import { ThemeProvider } from './hooks/theme'
import { TransitionProvider } from './hooks/transition'
import { initSmoothScroll, scrollToHash, scrollToTarget } from './lib/scroll'
import Home from './pages/Home'

// Case-study and 404 pages load on demand.
const ProjectPage = lazy(() => import('./pages/ProjectPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

/** Last-resort boundary so a runtime error never leaves a blank page. */
class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <main className="notfound container">
        <p className="mono">Something went wrong</p>
        <h1>This page failed to load.</h1>
        <p>
          Reload to try again, or email <a href={`mailto:${profile.email}`}>{profile.email}</a>.
        </p>
        <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
          Reload page
        </button>
      </main>
    )
  }
}

/** Scroll position on navigation: hash target, else top. Back/forward is left to the browser. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  const type = useNavigationType()
  const first = useRef(true)

  useLayoutEffect(() => {
    const isFirst = first.current
    first.current = false
    if (!isFirst && type === 'POP') return
    if (hash) {
      // Wait a frame so the target section has been laid out.
      const id = requestAnimationFrame(() => {
        if (!scrollToHash(hash, true) && !isFirst) scrollToTarget(0, true)
      })
      return () => cancelAnimationFrame(id)
    }
    if (!isFirst) scrollToTarget(0, true)
    // Same-page hash changes are scrolled by TransitionProvider.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return null
}

function Shell() {
  useEffect(() => initSmoothScroll(), [])

  return (
    <TransitionProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Cursor />
      <Nav />
      <ScrollManager />
      <ErrorBoundary>
        <Suspense fallback={<div className="page-loading" aria-hidden="true" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:slug" element={<ProjectPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <Footer />
    </TransitionProvider>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Shell />
      </BrowserRouter>
    </ThemeProvider>
  )
}
