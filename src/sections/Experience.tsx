import type { CSSProperties } from 'react'
import { sectionIndex } from '../data/sections'
import { SectionHead, Split } from '../components/primitives'
import { experience } from '../data/experience'

export function Experience() {
  return (
    <section className="section xp" id="experience" aria-labelledby="xp-title">
      <div className="container">
        <SectionHead index={sectionIndex('experience')} label="Experience">
          <span id="xp-title">
            <Split text="Where the" /> <span className="serif accent"><Split text="work" offset={2} /></span>{' '}
            <Split text="happens." offset={3} />
          </span>
        </SectionHead>

        {experience.map((job) => (
          <article key={job.company} className="xp__job">
            <div className="xp__aside">
              <div className="xp__sticky">
                <p className="xp__period mono" data-reveal="fade">
                  {job.current && <span className="xp__live" aria-hidden="true" />}
                  {job.period}
                </p>
                <h3 className="xp__company" data-reveal="fade">
                  {job.company}
                </h3>
                <p className="xp__place mono" data-reveal="fade">
                  {job.location}
                </p>
                <ul className="xp__titles" data-reveal="fade">
                  {job.titles.map((title) => (
                    <li key={title}>{title}</li>
                  ))}
                </ul>
                <p className="xp__summary" data-reveal="fade">
                  {job.summary}
                </p>
              </div>
            </div>

            <div className="xp__main">
              <div className="xp__rail" aria-hidden="true">
                <span className="xp__rail-fill" data-scrub-line />
              </div>
              <ol className="xp__list">
                {job.highlights.map((item, i) => (
                  <li key={item.title} className="xp__item" data-reveal="fade" style={{ '--d': `${(i % 3) * 60}ms` } as CSSProperties}>
                    <span className="xp__num mono">0{i + 1}</span>
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="xp__stack" data-reveal="fade">
                <span className="mono">Daily stack</span>
                <ul>
                  {job.stack.map((tech) => (
                    <li key={tech} className="chip">
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
