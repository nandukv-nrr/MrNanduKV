import type { CSSProperties } from 'react'
import { SectionHead, Split } from '../components/primitives'
import { profile } from '../data/profile'

const JOURNEY = [
  { year: '2018', title: 'Started a diploma', body: 'Computer Engineering and IT Infrastructure at NTTF NEC, Bangalore.' },
  { year: '2021', title: 'Graduated, then joined Iolite', body: 'Began at Iolite Technologies in December 2021, building ERP applications in React.js.' },
  { year: 'Now', title: 'Senior UX/UI Developer', body: 'Reusable components, accessible interfaces and REST-driven ERP modules.' },
]

export function About() {
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className="container">
        <SectionHead index="01" label="About">
          <span id="about-title">
            <Split text="Clarity for" /> <span className="serif accent"><Split text="complex" offset={2} /></span>{' '}
            <Split text="software." offset={3} />
          </span>
        </SectionHead>

        <div className="about__grid">
          <aside className="about__aside">
            <dl className="about__facts">
              {profile.facts.map((fact, i) => (
                <div key={fact.label} className="about__fact" data-reveal="fade" style={{ '--d': `${i * 80}ms` } as CSSProperties}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </aside>

          <div className="about__body">
            <p className="about__lead" data-reveal="fade">
              {profile.summary[0]}
            </p>
            <div className="about__cols">
              <p data-reveal="fade">{profile.summary[1]}</p>
              <blockquote className="about__quote serif" data-reveal="fade" style={{ '--d': '100ms' } as CSSProperties}>
                {profile.interests}
              </blockquote>
            </div>
          </div>
        </div>

        <div className="about__block">
          <h3 className="mono about__label">Key strengths</h3>
          <ol className="strengths">
            {profile.strengths.map((s, i) => (
              <li key={s.title} className="strength" data-reveal="fade" style={{ '--d': `${i * 90}ms` } as CSSProperties}>
                <span className="mono accent">0{i + 1}</span>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="about__block about__block--split">
          <div>
            <h3 className="mono about__label">Journey</h3>
            <ol className="journey">
              {JOURNEY.map((step, i) => (
                <li key={step.year} className="journey__step" data-reveal="fade" style={{ '--d': `${i * 110}ms` } as CSSProperties}>
                  <span className="journey__year">{step.year}</span>
                  <div>
                    <h4>{step.title}</h4>
                    <p>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="mono about__label">Languages</h3>
            <ul className="languages">
              {profile.languages.map((lang, i) => (
                <li key={lang.name} data-reveal="fade" style={{ '--d': `${i * 70}ms` } as CSSProperties}>
                  <span>{lang.name}</span>
                  <span className="mono">{lang.level}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
