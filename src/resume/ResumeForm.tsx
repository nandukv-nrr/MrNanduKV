import { ArrowDown, ArrowUp, ChevronDown, Eye, EyeOff, Plus, Trash2 } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'
import { newId } from './store'
import type { ResumeData, SectionId } from './types'
import { SECTION_LABELS } from './view'

export interface FormErrors {
  fullName?: string
  contact?: string
  email?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validate(data: ResumeData): FormErrors {
  const p = data.personal
  const errors: FormErrors = {}
  if (!p.fullName.trim()) errors.fullName = 'Add your name — it is the first thing on a resume.'
  if (p.email.trim() && !EMAIL_RE.test(p.email.trim())) errors.email = 'This email address looks incomplete.'
  if (!p.email.trim() && !p.phone.trim()) errors.contact = 'Add an email address or phone number so employers can reach you.'
  return errors
}

interface FieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'tel' | 'url'
  placeholder?: string
  hint?: string
  error?: string
  rows?: number
  autoComplete?: string
  wide?: boolean
  disabled?: boolean
}

function Field({ label, value, onChange, type = 'text', placeholder, hint, error, rows, autoComplete, wide, disabled }: FieldProps) {
  const id = useId()
  const describedBy = error ? `${id}-e` : hint ? `${id}-h` : undefined
  const shared = {
    id,
    value,
    placeholder,
    disabled,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
  }
  return (
    <div className={`field${wide ? ' field--wide' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {rows ? (
        <textarea {...shared} rows={rows} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input {...shared} type={type} autoComplete={autoComplete ?? 'off'} onChange={(e) => onChange(e.target.value)} />
      )}
      {error ? (
        <p id={`${id}-e`} className="field__error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-h`} className="field__hint">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

interface ItemsProps<T extends { id: string }> {
  items: T[]
  onChange: (items: T[]) => void
  blank: () => Omit<T, 'id'>
  noun: string
  children: (item: T, set: (patch: Partial<T>) => void) => ReactNode
}

/** A repeatable group (jobs, schools, …) with add, remove and reorder. */
function Items<T extends { id: string }>({ items, onChange, blank, noun, children }: ItemsProps<T>) {
  const move = (i: number, by: number) => {
    const next = [...items]
    const [item] = next.splice(i, 1)
    next.splice(i + by, 0, item)
    onChange(next)
  }
  return (
    <div className="rb-items">
      {items.map((item, i) => (
        <fieldset key={item.id} className="rb-item">
          <legend className="mono">
            {noun} {i + 1}
          </legend>
          <div className="rb-item__tools">
            <button type="button" className="rb-icon" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move ${noun} ${i + 1} up`}>
              <ArrowUp aria-hidden="true" />
            </button>
            <button
              type="button"
              className="rb-icon"
              disabled={i === items.length - 1}
              onClick={() => move(i, 1)}
              aria-label={`Move ${noun} ${i + 1} down`}
            >
              <ArrowDown aria-hidden="true" />
            </button>
            <button
              type="button"
              className="rb-icon rb-icon--danger"
              onClick={() => onChange(items.filter((x) => x.id !== item.id))}
              aria-label={`Remove ${noun} ${i + 1}`}
            >
              <Trash2 aria-hidden="true" />
            </button>
          </div>
          <div className="rb-grid">{children(item, (patch) => onChange(items.map((x) => (x.id === item.id ? { ...x, ...patch } : x))))}</div>
        </fieldset>
      ))}
      <button type="button" className="rb-add" onClick={() => onChange([...items, { ...blank(), id: newId() } as T])}>
        <Plus aria-hidden="true" /> Add {noun}
      </button>
    </div>
  )
}

interface PanelProps {
  title: string
  open: boolean
  onToggle: () => void
  children: ReactNode
  /** Controls for optional sections; omitted for Personal details. */
  section?: { hidden: boolean; onHide: () => void; onUp?: () => void; onDown?: () => void }
}

function Panel({ title, open, onToggle, children, section }: PanelProps) {
  const id = useId()
  return (
    <section className={`rb-panel${section?.hidden ? ' is-hidden' : ''}`}>
      <div className="rb-panel__head">
        <h2>
          <button type="button" className="rb-panel__toggle" aria-expanded={open} aria-controls={id} onClick={onToggle}>
            <ChevronDown aria-hidden="true" />
            {title}
            {section?.hidden && <span className="mono">Hidden</span>}
          </button>
        </h2>
        {section && (
          <div className="rb-panel__tools">
            <button type="button" className="rb-icon" disabled={!section.onUp} onClick={section.onUp} aria-label={`Move ${title} section up`}>
              <ArrowUp aria-hidden="true" />
            </button>
            <button type="button" className="rb-icon" disabled={!section.onDown} onClick={section.onDown} aria-label={`Move ${title} section down`}>
              <ArrowDown aria-hidden="true" />
            </button>
            <button
              type="button"
              className="rb-icon"
              onClick={section.onHide}
              aria-pressed={section.hidden}
              aria-label={`Hide ${title} section from the resume`}
              title={section.hidden ? 'Show on resume' : 'Hide from resume'}
            >
              {section.hidden ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
            </button>
          </div>
        )}
      </div>
      <div id={id} className="rb-panel__body" hidden={!open}>
        {children}
      </div>
    </section>
  )
}

type Update = (patch: Partial<ResumeData> | ((d: ResumeData) => ResumeData)) => void

export function ResumeForm({ data, update, errors }: { data: ResumeData; update: Update; errors: FormErrors }) {
  const [open, setOpen] = useState<Set<string>>(() => new Set(['personal', 'summary', 'experience']))
  const toggle = (key: string) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  const p = data.personal
  const setPersonal = (patch: Partial<ResumeData['personal']>) => update({ personal: { ...p, ...patch } })

  const moveSection = (id: SectionId, by: number) =>
    update((d) => {
      const order = [...d.sectionOrder]
      const i = order.indexOf(id)
      order.splice(i, 1)
      order.splice(i + by, 0, id)
      return { ...d, sectionOrder: order }
    })
  const hideSection = (id: SectionId) =>
    update((d) => ({ ...d, hidden: d.hidden.includes(id) ? d.hidden.filter((x) => x !== id) : [...d.hidden, id] }))

  const bodies: Record<SectionId, ReactNode> = {
    summary: (
      <Field
        label="Professional summary"
        rows={5}
        wide
        value={data.summary}
        onChange={(summary) => update({ summary })}
        hint="2–4 sentences: who you are, your experience and what you do best."
      />
    ),
    experience: (
      <Items
        items={data.experience}
        onChange={(experience) => update({ experience })}
        noun="job"
        blank={() => ({ role: '', company: '', location: '', start: '', end: '', current: false, bullets: '' })}
      >
        {(item, set) => (
          <>
            <Field label="Job title" value={item.role} onChange={(role) => set({ role })} placeholder="Frontend Developer" />
            <Field label="Company" value={item.company} onChange={(company) => set({ company })} />
            <Field label="Location" value={item.location} onChange={(location) => set({ location })} placeholder="City, Country" />
            <div className="rb-dates">
              <Field label="Start" value={item.start} onChange={(start) => set({ start })} placeholder="Jan 2022" />
              <Field label="End" value={item.current ? 'Present' : item.end} onChange={(end) => set({ end })} placeholder="Dec 2024" disabled={item.current} />
            </div>
            <label className="rb-check field--wide">
              <input type="checkbox" checked={item.current} onChange={(e) => set({ current: e.target.checked })} />I currently work here
            </label>
            <Field
              label="What you did"
              rows={5}
              wide
              value={item.bullets}
              onChange={(bullets) => set({ bullets })}
              hint="One achievement per line. Start with a verb and add a number where you can."
            />
          </>
        )}
      </Items>
    ),
    education: (
      <Items
        items={data.education}
        onChange={(education) => update({ education })}
        noun="qualification"
        blank={() => ({ degree: '', school: '', location: '', start: '', end: '', details: '' })}
      >
        {(item, set) => (
          <>
            <Field label="Degree or course" value={item.degree} onChange={(degree) => set({ degree })} placeholder="B.Tech in Computer Science" />
            <Field label="School or university" value={item.school} onChange={(school) => set({ school })} />
            <Field label="Location" value={item.location} onChange={(location) => set({ location })} placeholder="City, Country" />
            <div className="rb-dates">
              <Field label="Start" value={item.start} onChange={(start) => set({ start })} placeholder="2018" />
              <Field label="End" value={item.end} onChange={(end) => set({ end })} placeholder="2022" />
            </div>
            <Field label="Details (optional)" wide value={item.details} onChange={(details) => set({ details })} placeholder="Grade, honours, relevant coursework" />
          </>
        )}
      </Items>
    ),
    skills: (
      <Items items={data.skills} onChange={(skills) => update({ skills })} noun="skill group" blank={() => ({ category: '', items: '' })}>
        {(item, set) => (
          <>
            <Field label="Group name" value={item.category} onChange={(category) => set({ category })} placeholder="Languages" />
            <Field label="Skills" value={item.items} onChange={(items) => set({ items })} placeholder="JavaScript, TypeScript, HTML" hint="Separate with commas." />
          </>
        )}
      </Items>
    ),
    projects: (
      <Items items={data.projects} onChange={(projects) => update({ projects })} noun="project" blank={() => ({ name: '', link: '', description: '', bullets: '' })}>
        {(item, set) => (
          <>
            <Field label="Project name" value={item.name} onChange={(name) => set({ name })} />
            <Field label="Link (optional)" value={item.link} onChange={(link) => set({ link })} placeholder="github.com/you/project" />
            <Field label="Short description" wide value={item.description} onChange={(description) => set({ description })} />
            <Field label="Highlights (optional)" rows={3} wide value={item.bullets} onChange={(bullets) => set({ bullets })} hint="One per line." />
          </>
        )}
      </Items>
    ),
    certifications: (
      <Items
        items={data.certifications}
        onChange={(certifications) => update({ certifications })}
        noun="certification"
        blank={() => ({ name: '', issuer: '', year: '' })}
      >
        {(item, set) => (
          <>
            <Field label="Certification" wide value={item.name} onChange={(name) => set({ name })} />
            <Field label="Issued by" value={item.issuer} onChange={(issuer) => set({ issuer })} />
            <Field label="Year" value={item.year} onChange={(year) => set({ year })} placeholder="2024" />
          </>
        )}
      </Items>
    ),
    languages: (
      <Items items={data.languages} onChange={(languages) => update({ languages })} noun="language" blank={() => ({ name: '', level: '' })}>
        {(item, set) => (
          <>
            <Field label="Language" value={item.name} onChange={(name) => set({ name })} />
            <Field label="Level" value={item.level} onChange={(level) => set({ level })} placeholder="Fluent" />
          </>
        )}
      </Items>
    ),
  }

  return (
    <form className="rb-form" noValidate onSubmit={(e) => e.preventDefault()}>
      <Panel title="Personal details" open={open.has('personal')} onToggle={() => toggle('personal')}>
        <div className="rb-grid">
          <Field label="Full name" value={p.fullName} onChange={(fullName) => setPersonal({ fullName })} autoComplete="name" error={errors.fullName} />
          <Field label="Job title" value={p.title} onChange={(title) => setPersonal({ title })} placeholder="Frontend Developer" />
          <Field
            label="Email"
            type="email"
            value={p.email}
            onChange={(email) => setPersonal({ email })}
            autoComplete="email"
            error={errors.email ?? errors.contact}
          />
          <Field label="Phone" type="tel" value={p.phone} onChange={(phone) => setPersonal({ phone })} autoComplete="tel" />
          <Field label="Location" value={p.location} onChange={(location) => setPersonal({ location })} placeholder="City, Country" />
          <Field label="LinkedIn" value={p.linkedin} onChange={(linkedin) => setPersonal({ linkedin })} placeholder="linkedin.com/in/you" />
          <Field label="GitHub" value={p.github} onChange={(github) => setPersonal({ github })} placeholder="github.com/you" />
          <Field label="Website" value={p.website} onChange={(website) => setPersonal({ website })} placeholder="yoursite.com" />
        </div>
      </Panel>

      {data.sectionOrder.map((id, i) => (
        <Panel
          key={id}
          title={SECTION_LABELS[id]}
          open={open.has(id)}
          onToggle={() => toggle(id)}
          section={{
            hidden: data.hidden.includes(id),
            onHide: () => hideSection(id),
            onUp: i > 0 ? () => moveSection(id, -1) : undefined,
            onDown: i < data.sectionOrder.length - 1 ? () => moveSection(id, 1) : undefined,
          }}
        >
          {bodies[id]}
        </Panel>
      ))}
    </form>
  )
}
