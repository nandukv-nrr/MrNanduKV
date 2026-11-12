import { ArrowDown, ArrowUp, ChevronDown, Eye, EyeOff, Plus, Trash2 } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'
import { Bullets, Combo, describedBy, FieldShell, MonthYear, Select, TagInput } from './inputs'
import { newId } from './store'
import { ALL_SKILLS, DEGREES, JOB_TITLES, LANGUAGES, LEVELS, SKILL_GROUP_NAMES, skillIdeas } from './suggestions'
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
  const shared = {
    id,
    value,
    placeholder,
    disabled,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy(id, hint, error),
  }
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} wide={wide}>
      {rows ? (
        <textarea {...shared} rows={rows} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input {...shared} type={type} autoComplete={autoComplete ?? 'off'} onChange={(e) => onChange(e.target.value)} />
      )}
    </FieldShell>
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
        hint={`2–4 sentences: who you are, your experience and what you do best. ${data.summary.trim().length} characters — aim for 150–700.`}
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
            <Combo label="Job title" value={item.role} onChange={(role) => set({ role })} options={JOB_TITLES} placeholder="Frontend Developer" />
            <Field label="Company" value={item.company} onChange={(company) => set({ company })} />
            <Field label="Location" value={item.location} onChange={(location) => set({ location })} placeholder="City, Country" />
            <div className="rb-dates">
              <MonthYear label="Start" value={item.start} onChange={(start) => set({ start })} />
              <MonthYear label="End" value={item.end} onChange={(end) => set({ end })} fixed={item.current ? 'Present' : undefined} />
            </div>
            <label className="rb-check field--wide">
              <input type="checkbox" checked={item.current} onChange={(e) => set({ current: e.target.checked })} />I currently work here
            </label>
            <Bullets
              label="What you achieved"
              value={item.bullets}
              onChange={(bullets) => set({ bullets })}
              placeholder="Built a dashboard used by 3,000 people every day"
              hint="Press Enter for the next point. Start with a verb and add a number where you can."
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
            <Combo label="Degree or course" value={item.degree} onChange={(degree) => set({ degree })} options={DEGREES} placeholder="B.Tech in Computer Science" />
            <Field label="School or university" value={item.school} onChange={(school) => set({ school })} />
            <Field label="Location" value={item.location} onChange={(location) => set({ location })} placeholder="City, Country" />
            <div className="rb-dates">
              <MonthYear label="Start" value={item.start} onChange={(start) => set({ start })} />
              <MonthYear label="End" value={item.end} onChange={(end) => set({ end })} />
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
            <Combo
              label="Group name"
              wide
              value={item.category}
              onChange={(category) => set({ category })}
              options={SKILL_GROUP_NAMES}
              placeholder="Languages, Frameworks, Tools…"
            />
            <TagInput
              label="Skills"
              value={item.items}
              onChange={(items) => set({ items })}
              options={ALL_SKILLS}
              ideas={skillIdeas(item.category, p.title)}
              placeholder="Start typing — e.g. React"
              hint="Type and press Enter or comma to add. Suggestions appear as you type."
            />
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
            <Bullets label="Highlights (optional)" value={item.bullets} onChange={(bullets) => set({ bullets })} hint="Press Enter for the next point." />
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
            <Combo label="Language" value={item.name} onChange={(name) => set({ name })} options={LANGUAGES} placeholder="Start typing — e.g. English" />
            <Select label="Level" value={item.level} onChange={(level) => set({ level })} options={LEVELS} placeholder="Choose level…" />
          </>
        )}
      </Items>
    ),
    custom: (
      <div className="rb-grid">
        <Field
          label="Section heading"
          wide
          value={data.custom.title}
          onChange={(title) => update({ custom: { ...data.custom, title } })}
          placeholder="Awards, Volunteering, Publications…"
        />
        <Bullets
          label="Items"
          value={data.custom.lines}
          onChange={(lines) => update({ custom: { ...data.custom, lines } })}
          addLabel="Add item"
          hint="Press Enter for the next item."
        />
      </div>
    ),
  }

  const panelTitle = (id: SectionId) => (id === 'custom' ? data.custom.title.trim() || 'Custom section' : SECTION_LABELS[id])

  return (
    <form className="rb-form" noValidate onSubmit={(e) => e.preventDefault()}>
      <Panel title="Personal details" open={open.has('personal')} onToggle={() => toggle('personal')}>
        <div className="rb-grid">
          <Field label="Full name" value={p.fullName} onChange={(fullName) => setPersonal({ fullName })} autoComplete="name" error={errors.fullName} />
          <Combo label="Job title" value={p.title} onChange={(title) => setPersonal({ title })} options={JOB_TITLES} placeholder="Frontend Developer" />
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
          title={panelTitle(id)}
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
