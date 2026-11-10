import { ArrowLeft } from 'lucide-react'
import { site } from '../data/site'
import { TLink } from '../hooks/transition'
import { useSeo } from '../hooks/useSeo'

export default function NotFound() {
  useSeo({ title: `Page not found · ${site.name}`, description: site.description, path: '' })
  return (
    <main id="main" className="page notfound container">
      <p className="mono">
        <span className="accent">404</span> — Page not found
      </p>
      <h1>
        This page is <span className="serif accent">off the grid.</span>
      </h1>
      <p>The link may be outdated, or the page may have moved.</p>
      <TLink to="/" className="btn btn--primary">
        <ArrowLeft aria-hidden="true" /> Back to home
      </TLink>
    </main>
  )
}
