import { Menu, Moon, Sun, X } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useLocation } from 'react-router-dom'
import { profile } from '../data/profile'
import { projects, projectSection } from '../data/projects'
import { sections, sectionIndex } from '../data/sections'
import { useTheme } from '../hooks/theme'
import { TLink } from '../hooks/transition'
import { lockScroll } from '../lib/scroll'

const LINKS = sections

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
      }}
    >
      <span className="theme-toggle__icons" data-theme-now={theme}>
        <Moon aria-hidden="true" />
        <Sun aria-hidden="true" />
      </span>
    </button>
  )
}

export function Nav() {
  const { pathname } = useLocation()
  const onHome = pathname === '/'
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll-spy: highlight the section crossing the middle of the viewport.
  useEffect(() => {
    if (!onHome) {
      // On a case study, highlight the section that lists the project.
      const project = projects.find((p) => pathname.startsWith(`/projects/${p.slug}`))
      setActive(project ? projectSection(project) : '')
      return
    }
    setActive('')
    const targets = LINKS.map((l) => document.getElementById(l.id)).filter((el): el is HTMLElement => !!el)
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    targets.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [onHome, pathname])

  useEffect(() => {
    lockScroll(open)
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        menuButton.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      lockScroll(false)
    }
  }, [open])

  useEffect(() => setOpen(false), [pathname])

  return (
    <>
      <header className={`nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
        <div className="nav__inner container">
          <TLink to="/" className="nav__brand" aria-label={`${profile.name} — home`} onClick={() => setOpen(false)}>
            <span className="nav__mark" aria-hidden="true">
              N<i />
            </span>
            <span className="nav__name">{profile.name}</span>
          </TLink>

          <nav className="nav__links" aria-label="Primary">
            {LINKS.map((link) => (
              <TLink
                key={link.id}
                to={`/#${link.id}`}
                className="nav__link"
                aria-current={active === link.id ? 'true' : undefined}
              >
                {link.label}
              </TLink>
            ))}
          </nav>

          <div className="nav__tools">
            <ThemeToggle />
            <button
              ref={menuButton}
              type="button"
              className="nav__menu-btn"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" className={`menu${open ? ' is-open' : ''}`} inert={!open}>
        <nav className="menu__links container" aria-label="Mobile">
          {LINKS.map((link, i) => (
            <TLink
              key={link.id}
              to={`/#${link.id}`}
              className="menu__link"
              style={{ '--i': i } as CSSProperties}
              onClick={() => setOpen(false)}
            >
              <span className="mono">{sectionIndex(link.id)}</span>
              <span>{link.label}</span>
            </TLink>
          ))}
        </nav>
        <div className="menu__foot container mono">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <span>{profile.location}</span>
        </div>
      </div>
    </>
  )
}
