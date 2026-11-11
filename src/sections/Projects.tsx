import { ArrowUpRight } from 'lucide-react'
import type { CSSProperties } from 'react'
import { SectionHead, Split } from '../components/primitives'
import { ProjectVisual } from '../components/ProjectVisual'
import { personalProjects, projectPath } from '../data/projects'
import { sectionIndex } from '../data/sections'
import { TLink } from '../hooks/transition'

const FEATURE_CHIPS = 4

/**
 * Personal projects as a card grid. Each card is one click target (the title
 * link is stretched over the card); the live-site link sits above it so the
 * two links never nest.
 */
export function Projects() {
  return (
    <section className="section pprojects" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <SectionHead index={sectionIndex('projects')} label="Personal projects">
          <span id="projects-title">
            <Split text="Built on my" /> <span className="serif accent"><Split text="own time." offset={3} /></span>
          </span>
        </SectionHead>

        <ol className="pcards">
          {personalProjects.map((project, i) => {
            const extra = project.features.length - FEATURE_CHIPS
            return (
              <li key={project.slug} className="pcard" data-reveal="fade" style={{ '--d': `${i * 110}ms` } as CSSProperties}>
                <div className="pcard__cover">
                  <ProjectVisual kind={project.visual} label={`Illustrative schematic for ${project.shortName}`} />
                </div>

                <div className="pcard__body">
                  <div className="pcard__top mono">
                    <span className="accent">{project.index}</span>
                    <span>{project.category}</span>
                    {project.status && (
                      <span className={`pcard__status${project.liveUrl ? ' is-live' : ''}`}>{project.status}</span>
                    )}
                  </div>

                  <h3 className="pcard__title">
                    <TLink to={projectPath(project.slug)} className="pcard__link" data-cursor="Open">
                      {project.shortName}
                    </TLink>
                  </h3>
                  <p className="pcard__desc">{project.description}</p>

                  {project.features.length > 0 && (
                    <ul className="pcard__features" aria-label="Key features">
                      {project.features.slice(0, FEATURE_CHIPS).map((f) => (
                        <li key={f.title} className="chip">
                          {f.title}
                        </li>
                      ))}
                      {extra > 0 && <li className="chip chip--more">+{extra} more</li>}
                    </ul>
                  )}

                  <div className="pcard__actions">
                    <span className="pcard__more" aria-hidden="true">
                      Case study <ArrowUpRight />
                    </span>
                    {project.liveUrl ? (
                      <a className="pcard__live" href={project.liveUrl} target="_blank" rel="noreferrer noopener">
                        Live site <ArrowUpRight aria-hidden="true" />
                        <span className="sr-only"> for {project.shortName} (opens in a new tab)</span>
                      </a>
                    ) : (
                      <span className="pcard__soon mono">Link coming soon</span>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
