import { Award } from 'lucide-react'
import type { CSSProperties } from 'react'
import { sectionIndex } from '../data/sections'
import { SectionHead, Split } from '../components/primitives'
import { certifications, education } from '../data/education'

export function Education() {
  return (
    <section className="section edu" id="education" aria-labelledby="edu-title">
      <div className="container">
        <SectionHead index={sectionIndex('education')} label="Education & certifications">
          <span id="edu-title">
            <Split text="Foundations," /> <span className="serif accent"><Split text="certified." offset={1} /></span>
          </span>
        </SectionHead>

        <div className="edu__grid">
          <div>
            <h3 className="mono edu__label">Education</h3>
            <ol className="edu__list">
              {education.map((item, i) => (
                <li key={item.title} className="edu__item" data-reveal="fade" style={{ '--d': `${i * 90}ms` } as CSSProperties}>
                  <span className="edu__period mono">{item.period}</span>
                  <div>
                    <h4>{item.title}</h4>
                    {item.place && <p>{item.place}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="mono edu__label">Certifications & achievements</h3>
            <ul className="cert__list">
              {certifications.map((cert, i) => (
                <li key={cert.title} className="cert" data-reveal="fade" style={{ '--d': `${i * 90}ms` } as CSSProperties}>
                  <Award aria-hidden="true" />
                  <div>
                    <h4>{cert.title}</h4>
                    {cert.detail && <p>{cert.detail}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
