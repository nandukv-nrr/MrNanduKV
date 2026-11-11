import type { CSSProperties } from 'react'
import { sectionIndex } from '../data/sections'
import { SectionHead, Split } from '../components/primitives'
import { skills } from '../data/skills'

const MARQUEE = skills.flatMap((group) => group.items.map((item) => item.replace(/\s*\(.*\)$/, '')))

export function Skills() {
  return (
    <section className="section skills" id="skills" aria-labelledby="skills-title">
      <div className="container">
        <SectionHead index={sectionIndex('skills')} label="Technical skills">
          <span id="skills-title">
            <Split text="The" /> <span className="serif accent"><Split text="toolkit." offset={1} /></span>
          </span>
        </SectionHead>
      </div>

      {/* Decorative type band; the full list below is the accessible source. */}
      <div className="marquee" aria-hidden="true">
        {[0, 1].map((copy) => (
          <div key={copy} className="marquee__track">
            {MARQUEE.map((item, i) => (
              <span key={i} className={i % 4 === 1 ? 'serif' : undefined}>
                {item}
                <i />
              </span>
            ))}
          </div>
        ))}
      </div>

      <div className="container">
        <ul className="skills__table">
          {skills.map((group, i) => (
            <li key={group.id} className="skills__row" data-reveal="fade" style={{ '--d': `${(i % 4) * 50}ms` } as CSSProperties}>
              <span className="skills__num mono">{String(i + 1).padStart(2, '0')}</span>
              <div className="skills__name">
                <h3>{group.name}</h3>
                {group.note && <p className="mono">{group.note}</p>}
              </div>
              <ul className="skills__items" aria-label={group.name}>
                {group.items.map((item) => (
                  <li key={item} className="chip">
                    {item}
                  </li>
                ))}
              </ul>
              <span className="skills__count mono" aria-hidden="true">
                {String(group.items.length).padStart(2, '0')}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
