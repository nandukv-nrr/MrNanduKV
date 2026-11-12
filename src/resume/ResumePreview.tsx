import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { INK, PAGE, TEMPLATES } from './templates'
import type { ResumeData } from './types'
import { buildView, type ViewSection } from './view'

const PT = 96 / 72 // CSS pixels per PDF point

function Section({ section }: { section: ViewSection }) {
  return (
    <section className="rp-section">
      <h2 className="rp-heading">{section.heading}</h2>
      {section.kind === 'text' && <p className="rp-text">{section.text}</p>}
      {section.kind === 'rows' &&
        section.rows.map((row, i) => (
          <p key={i} className="rp-text">
            {row.label && <strong>{row.label}: </strong>}
            {row.value}
          </p>
        ))}
      {section.kind === 'entries' &&
        section.entries.map((entry, i) => (
          <div key={i} className="rp-entry">
            <div className="rp-row">
              <strong>{entry.title}</strong>
              {entry.date && <span>{entry.date}</span>}
            </div>
            {(entry.subtitle || entry.location) && (
              <div className="rp-row rp-row--sub">
                <span>{entry.subtitle}</span>
                {entry.location && <span>{entry.location}</span>}
              </div>
            )}
            {entry.text && <p className="rp-text">{entry.text}</p>}
            {entry.bullets.length > 0 && (
              <ul className="rp-bullets">
                {entry.bullets.map((b, k) => (
                  <li key={k}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
    </section>
  )
}

/**
 * On-screen copy of the resume. Laid out at true page size in points and
 * scaled to fit its container; reports when the content passes one page.
 */
export function ResumePreview({ data, onOverflow }: { data: ResumeData; onOverflow?: (over: boolean) => void }) {
  const view = buildView(data)
  const spec = TEMPLATES[data.settings.template]
  const page = PAGE[data.settings.pageSize]
  const frame = useRef<HTMLDivElement>(null)
  const sheet = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ scale: 1, height: page.height * PT })

  useEffect(() => {
    const frameEl = frame.current
    const sheetEl = sheet.current
    if (!frameEl || !sheetEl) return
    const measure = () => {
      const scale = frameEl.clientWidth / (page.width * PT)
      setBox({ scale, height: sheetEl.offsetHeight * scale })
      onOverflow?.(sheetEl.offsetHeight > page.height * PT + 2)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(frameEl)
    ro.observe(sheetEl)
    return () => ro.disconnect()
  }, [page.width, page.height, onOverflow])

  const color = { accent: data.settings.accent, text: INK.text, muted: INK.muted }
  const vars = {
    '--rp-font': spec.font === 'serif' ? "'Times New Roman', Times, serif" : 'Helvetica, Arial, sans-serif',
    '--rp-base': `${spec.base}pt`,
    '--rp-lh': spec.lineHeight,
    '--rp-margin': `${spec.margin}pt`,
    '--rp-name': `${spec.nameSize}pt`,
    '--rp-name-color': color[spec.nameColor],
    '--rp-head': `${spec.headingSize}pt`,
    '--rp-head-color': color[spec.headingColor],
    '--rp-track': `${spec.headingTracking}pt`,
    '--rp-gap': `${spec.sectionGap}pt`,
    '--rp-entry': `${spec.entryGap}pt`,
    '--rp-rule': spec.headingRule ? `0.75pt solid ${spec.headingColor === 'text' ? INK.text : INK.rule}` : '0',
    width: `${page.width}pt`,
    minHeight: `${page.height}pt`,
    transform: `scale(${box.scale})`,
  } as CSSProperties

  const blank = !view.name && view.contacts.length === 0 && view.sections.length === 0

  return (
    <div ref={frame} className="rp-frame" style={{ height: box.height }}>
      <div ref={sheet} className="rp-sheet" data-align={spec.headerAlign} style={vars}>
        <header className="rp-header">
          <h1 className={`rp-name${view.name ? '' : ' is-placeholder'}`}>{view.name || 'Your Name'}</h1>
          {view.title && <p className="rp-title">{view.title}</p>}
          {view.contacts.length > 0 && <p className="rp-contacts">{view.contacts.map((c) => c.text).join('  |  ')}</p>}
        </header>
        {view.sections.map((section) => (
          <Section key={section.id} section={section} />
        ))}
        {blank && <p className="rp-empty">Start typing in the form — your resume appears here.</p>}
        <div className="rp-break" style={{ top: `${page.height}pt` }} aria-hidden="true" />
      </div>
    </div>
  )
}
