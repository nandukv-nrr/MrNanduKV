import { ArrowUpRight } from 'lucide-react'
import { sectionIndex } from '../data/sections'
import { SectionHead, Split, Tilt } from '../components/primitives'
import { ProjectVisual } from '../components/ProjectVisual'
import { projectPath, workProjects } from '../data/projects'
import { TLink } from '../hooks/transition'

export function Work() {
  return (
    <section className="section work" id="work" aria-labelledby="work-title">
      <div className="container">
        <SectionHead index={sectionIndex('work')} label="Featured projects">
          <span id="work-title">
            <Split text="Selected" /> <span className="serif accent"><Split text="work." offset={1} /></span>
          </span>
        </SectionHead>

        <ol className="work__list">
          {workProjects.map((project) => (
            <li key={project.slug} className="work-card">
              <TLink
                to={projectPath(project.slug)}
                className="work-card__link"
                data-cursor="Open"
                aria-label={`${project.name} — view case study`}
              >
                <div className="work-card__cover" data-reveal="mask">
                  <div className="work-card__cover-inner">
                    <div data-parallax="6">
                      <Tilt>
                        <ProjectVisual kind={project.visual} label={`Illustrative schematic for ${project.shortName}`} />
                      </Tilt>
                    </div>
                  </div>
                </div>

                <div className="work-card__info">
                  <div className="work-card__top mono" data-reveal="fade">
                    <span className="accent">{project.index}</span>
                    <span>{project.category}</span>
                  </div>
                  <h3 className="work-card__title" data-reveal="split">
                    <Split text={project.shortName} />
                  </h3>
                  <p className="work-card__desc" data-reveal="fade">
                    {project.description}
                  </p>
                  <ul className="work-card__stack" data-reveal="fade" aria-label="Technologies">
                    {project.stack
                      .flatMap((group) => group.items)
                      .map((item) => (
                        <li key={item} className="chip">
                          {item}
                        </li>
                      ))}
                  </ul>
                  <span className="work-card__more" data-reveal="fade">
                    View case study <ArrowUpRight aria-hidden="true" />
                  </span>
                </div>
              </TLink>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
