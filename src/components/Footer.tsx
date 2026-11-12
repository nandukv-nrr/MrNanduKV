import { ArrowUp } from 'lucide-react'
import { resumeBuilderPage } from '../data/pages'
import { profile } from '../data/profile'
import { TLink } from '../hooks/transition'
import { scrollToTarget } from '../lib/scroll'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner mono">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span className="footer__built">Built with React, TypeScript & Three.js</span>
        <TLink to={resumeBuilderPage.path} className="footer__link">
          Free {resumeBuilderPage.label}
        </TLink>
        <button type="button" className="footer__top" onClick={() => scrollToTarget(0)}>
          Back to top <ArrowUp aria-hidden="true" />
        </button>
      </div>
    </footer>
  )
}
