import { ArrowLeft, ArrowRight, ArrowUpRight, Code2 } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { Magnetic, Split, Tilt } from '../components/primitives'
import { ProjectVisual } from '../components/ProjectVisual'
import { projectPath, projects, projectSection } from '../data/projects'
import { site } from '../data/site'
import type { Project } from '../data/types'
import { TLink } from '../hooks/transition'
import { useReveal } from '../hooks/useReveal'
import { useScrollEffects } from '../hooks/useScrollEffects'
import { useSeo } from '../hooks/useSeo'
import NotFound from './NotFound'

function Block({ index, label, children }: { index: string; label: string; children: ReactNode }) {
  return (
    <section className="cs-block">
      <div className="container cs-block__grid">
        <h2 className="cs-block__label mono" data-reveal="fade">
          <span className="accent">{index}</span> {label}
        </h2>
        <div className="cs-block__body">{children}</div>
      </div>
    </section>
  )
}

function ExternalButton({ href, children, primary }: { href?: string; children: ReactNode; primary?: boolean }) {
  if (!href) {
    return (
      <span className="btn" aria-disabled="true">
        {children}
      </span>
    )
  }
  return (
    <Magnetic>
      <a className={`btn${primary ? ' btn--primary' : ''}`} href={href} target="_blank" rel="noreferrer noopener">
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </Magnetic>
  )
}

function CaseStudy({ project }: { project: Project }) {
  const i = projects.findIndex((p) => p.slug === project.slug)
  const next = projects[(i + 1) % projects.length]
  const prev = projects[(i - 1 + projects.length) % projects.length]
  const hasNext = next.slug !== project.slug
  const hasPrev = prev.slug !== project.slug && prev.slug !== next.slug

  const tech = new Set(project.stack.flatMap((g) => g.items.map((t) => t.toLowerCase())))
  const related = projects.filter(
    (p) =>
      p.slug !== project.slug &&
      p.slug !== next.slug &&
      p.slug !== prev.slug &&
      p.stack.some((g) => g.items.some((t) => tech.has(t.toLowerCase()))),
  )

  const about = project.about
  const facts = [
    { label: 'Why it exists', value: about.purpose },
    { label: 'The problem', value: about.problem },
    { label: 'Who it is for', value: about.audience },
  ].filter((f): f is { label: string; value: string } => !!f.value)

  let n = 0
  const idx = () => String(++n).padStart(2, '0')
  const backTo = `/#${projectSection(project)}`
  const allStack = project.stack.flatMap((g) => g.items)

  return (
    <main id="main" className="page cs">
      <header className="cs-hero">
        <div className="container">
          <TLink to={backTo} className="cs-back mono" data-reveal="fade">
            <ArrowLeft aria-hidden="true" /> All projects
          </TLink>

          <p className="cs-hero__meta mono" data-reveal="fade" style={{ '--d': '80ms' } as CSSProperties}>
            <span className="accent">{project.index}</span>
            <span>{project.category}</span>
          </p>
          <h1 className="cs-hero__title" data-reveal="split" style={{ '--d': '140ms' } as CSSProperties}>
            <Split text={project.name} />
          </h1>
          <p className="cs-hero__tagline" data-reveal="fade" style={{ '--d': '380ms' } as CSSProperties}>
            {project.tagline}
          </p>

          <dl className="cs-hero__facts" data-reveal="fade" style={{ '--d': '480ms' } as CSSProperties}>
            <div>
              <dt className="mono">Role</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt className="mono">Category</dt>
              <dd>{project.category}</dd>
            </div>
            {allStack.length > 0 && (
              <div>
                <dt className="mono">Stack</dt>
                <dd>{allStack.slice(0, 4).join(' · ')}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="container">
          <figure className="cs-cover">
            <div className="cs-cover__frame" data-reveal="mask" style={{ '--d': '300ms' } as CSSProperties}>
              <div className="cs-cover__inner">
                <div data-parallax="5">
                  {project.screenshots[0] ? (
                    <img
                      src={`${import.meta.env.BASE_URL}${project.screenshots[0].src}`}
                      alt={project.screenshots[0].alt}
                      decoding="async"
                    />
                  ) : (
                    <Tilt max={4}>
                      <ProjectVisual kind={project.visual} label={`Illustrative schematic for ${project.shortName}`} />
                    </Tilt>
                  )}
                </div>
              </div>
            </div>
            {!project.screenshots[0] && (
              <figcaption className="mono">Illustrative schematic — not a screenshot of the product</figcaption>
            )}
          </figure>
        </div>
      </header>

      <Block index={idx()} label="Overview">
        <div className="cs-overview">
          {project.overview.map((para, k) => (
            <p key={k} className={k === 0 ? 'cs-lead' : undefined} data-reveal="fade">
              {para}
            </p>
          ))}
        </div>
      </Block>

      {(facts.length > 0 || about.objectives?.length) && (
        <Block index={idx()} label="The brief">
          {facts.length > 0 && (
            <dl className="cs-facts">
              {facts.map((fact, k) => (
                <div key={fact.label} data-reveal="fade" style={{ '--d': `${k * 80}ms` } as CSSProperties}>
                  <dt className="mono">{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {about.objectives && about.objectives.length > 0 && (
            <div className="cs-objectives" data-reveal="fade">
              <h3 className="mono">Main objectives</h3>
              <ul>
                {about.objectives.map((objective) => (
                  <li key={objective}>{objective}</li>
                ))}
              </ul>
            </div>
          )}
        </Block>
      )}

      <Block index={idx()} label="My contribution">
        <p className="cs-role" data-reveal="fade">
          <span className="mono">Role</span>
          <span className="cs-role__value">{project.role}</span>
        </p>
        <div className="cs-contrib">
          {project.contributions.map((group, k) => (
            <div key={group.area} className="cs-contrib__group" data-reveal="fade" style={{ '--d': `${k * 80}ms` } as CSSProperties}>
              <h3>{group.area}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Block>

      {project.stack.length > 0 && (
        <Block index={idx()} label="Technology stack">
          <div className="cs-stack">
            {project.stack.map((group, k) => (
              <div key={group.group} className="cs-stack__group" data-reveal="fade" style={{ '--d': `${k * 80}ms` } as CSSProperties}>
                <h3 className="mono">{group.group}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Block>
      )}

      {project.features.length > 0 && (
        <Block index={idx()} label="Features & functionality">
          <ol className="cs-features">
            {project.features.map((feature, k) => (
              <li key={feature.title} data-reveal="fade" style={{ '--d': `${k * 80}ms` } as CSSProperties}>
                <span className="mono accent">{String(k + 1).padStart(2, '0')}</span>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </li>
            ))}
          </ol>
        </Block>
      )}

      {project.process.length > 0 && (
        <Block index={idx()} label="Design & development">
          <ol className="cs-process">
            {project.process.map((step, k) => (
              <li key={step.title} data-reveal="fade" style={{ '--d': `${k * 80}ms` } as CSSProperties}>
                <span className="cs-process__dot" aria-hidden="true" />
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </Block>
      )}

      {project.screenshots.length > 1 && (
        <section className="cs-gallery" aria-label="Screenshots">
          <div className="container">
            <h2 className="cs-block__label mono">
              <span className="accent">{idx()}</span> Gallery
            </h2>
          </div>
          <ul className="cs-gallery__rail" tabIndex={0} aria-label="Screenshot gallery, scroll horizontally">
            {project.screenshots.slice(1).map((shot) => (
              <li key={shot.src}>
                <figure data-reveal="mask">
                  <img src={`${import.meta.env.BASE_URL}${shot.src}`} alt={shot.alt} loading="lazy" decoding="async" />
                </figure>
                {shot.caption && <p className="mono">{shot.caption}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="cs-live" aria-label="Project links">
        <div className="container cs-live__inner" data-reveal="fade">
          <div>
            <p className="mono">Live project</p>
            <h2>
              See it <span className="serif accent">in use.</span>
            </h2>
            {!project.liveUrl && project.linkNote && <p className="cs-live__note">{project.linkNote}</p>}
          </div>
          <div className="cs-live__actions">
            <ExternalButton href={project.liveUrl} primary>
              {project.liveUrl ? 'Visit live site' : 'Live link not available'} <ArrowUpRight aria-hidden="true" />
            </ExternalButton>
            {project.repoUrl && (
              <ExternalButton href={project.repoUrl}>
                <Code2 aria-hidden="true" /> Source code
              </ExternalButton>
            )}
          </div>
        </div>
      </section>

      <nav className="cs-nav" aria-label="More projects">
        <div className="container">
          <div className="cs-nav__pair">
            {hasPrev && (
              <TLink to={projectPath(prev.slug)} className="cs-nav__link" data-cursor="Prev">
                <span className="mono">
                  <ArrowLeft aria-hidden="true" /> Previous project
                </span>
                <span className="cs-nav__name">{prev.shortName}</span>
              </TLink>
            )}
            {hasNext && (
              <TLink to={projectPath(next.slug)} className="cs-nav__link cs-nav__link--next" data-cursor="Next">
                <span className="mono">
                  Next project <ArrowRight aria-hidden="true" />
                </span>
                <span className="cs-nav__name">{next.shortName}</span>
                <span className="cs-nav__cat">{next.category}</span>
              </TLink>
            )}
          </div>

          {related.length > 0 && (
            <div className="cs-related">
              <h2 className="mono">Related projects</h2>
              <ul>
                {related.map((p) => (
                  <li key={p.slug}>
                    <TLink to={projectPath(p.slug)}>
                      {p.shortName} <ArrowUpRight aria-hidden="true" />
                    </TLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <TLink to={backTo} className="cs-back cs-back--bottom mono">
            <ArrowLeft aria-hidden="true" /> Back to all projects
          </TLink>
        </div>
      </nav>
    </main>
  )
}

export default function ProjectPage() {
  const { slug } = useParams()
  const project = projects.find((p) => p.slug === slug)

  useSeo(
    project
      ? { title: `${project.seo.title} · ${site.name}`, description: project.seo.description, path: projectPath(project.slug) }
      : { title: `Page not found · ${site.name}`, description: site.description, path: '' },
  )
  useReveal(slug)
  useScrollEffects(slug)

  if (!project) return <NotFound />
  return <CaseStudy key={project.slug} project={project} />
}
