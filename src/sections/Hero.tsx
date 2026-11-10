import { ArrowDownRight } from 'lucide-react'
import { lazy, Suspense, useCallback, useEffect, useState, type CSSProperties } from 'react'
import { Magnetic, Split } from '../components/primitives'
import { profile } from '../data/profile'
import { useTheme } from '../hooks/theme'
import { TLink } from '../hooks/transition'

const HeroScene = lazy(() => import('../components/hero/HeroScene'))

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

const QUICK_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]

export function Hero() {
  const { theme } = useTheme()
  const [sceneState, setSceneState] = useState<'pending' | 'on' | 'off'>('pending')

  // Decide after first paint so the heavy chunk never blocks the headline.
  useEffect(() => {
    setSceneState(supportsWebGL() ? 'on' : 'off')
  }, [])
  const onFail = useCallback(() => setSceneState('off'), [])

  return (
    <section className="hero" id="top" aria-label="Introduction">
      <div className="hero__scene" aria-hidden="true">
        {sceneState === 'on' && (
          <Suspense fallback={null}>
            <HeroScene theme={theme} onFail={onFail} />
          </Suspense>
        )}
        {sceneState === 'off' && <div className="hero__fallback" />}
      </div>

      <div className="hero__inner container">
        <p className="hero__meta mono" data-reveal="fade">
          <span className="hero__status" aria-hidden="true" />
          {profile.role} <span aria-hidden="true">/</span> React.js <span aria-hidden="true">/</span> ERP interfaces
        </p>

        <h1 className="hero__name" data-reveal="split" style={{ '--d': '120ms' } as CSSProperties}>
          <span className="hero__name-line">
            <Split text={profile.firstName} />
          </span>
          <span className="hero__name-line serif">
            <Split text={profile.lastName} offset={1} />
          </span>
        </h1>

        <div className="hero__copy">
          <p className="hero__tagline" data-reveal="fade" style={{ '--d': '420ms' } as CSSProperties}>
            Interfaces for complex systems, <span className="serif accent">made clear.</span>
          </p>
          <p className="hero__intro" data-reveal="fade" style={{ '--d': '520ms' } as CSSProperties}>
            {profile.intro}
          </p>
          <div className="hero__cta" data-reveal="fade" style={{ '--d': '620ms' } as CSSProperties}>
            <Magnetic>
              <TLink to="/#work" className="btn btn--primary">
                Explore my work <ArrowDownRight aria-hidden="true" />
              </TLink>
            </Magnetic>
            <Magnetic>
              <TLink to="/#contact" className="btn">
                Contact me
              </TLink>
            </Magnetic>
          </div>
        </div>
      </div>

      <div className="hero__foot container" data-reveal="fade" style={{ '--d': '800ms' } as CSSProperties}>
        <nav className="hero__index" aria-label="Sections">
          {QUICK_LINKS.map((link, i) => (
            <TLink key={link.id} to={`/#${link.id}`} className="hero__index-link mono">
              <span className="accent">0{i + 1}</span> {link.label}
            </TLink>
          ))}
        </nav>
        <TLink to="/#about" className="hero__scroll mono" aria-label="Scroll to About">
          <span>Scroll</span>
          <span className="hero__scroll-track" aria-hidden="true">
            <i />
          </span>
        </TLink>
      </div>
    </section>
  )
}
