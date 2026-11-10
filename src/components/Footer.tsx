import { ArrowUp } from 'lucide-react'
import { profile } from '../data/profile'
import { scrollToTarget } from '../lib/scroll'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner mono">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span className="footer__built">Built with React, TypeScript & Three.js</span>
        <button type="button" className="footer__top" onClick={() => scrollToTarget(0)}>
          Back to top <ArrowUp aria-hidden="true" />
        </button>
      </div>
    </footer>
  )
}
