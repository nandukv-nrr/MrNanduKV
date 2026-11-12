import { useCallback, useEffect, useState } from 'react'
import { ACCENTS, TEMPLATES } from './templates.ts'
import type { ResumeData, SectionId } from './types.ts'

const STORAGE_KEY = 'resume-builder:v1'

export const ALL_SECTIONS: SectionId[] = ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages', 'custom']

export const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2)

export function emptyResume(): ResumeData {
  return {
    personal: { fullName: '', title: '', email: '', phone: '', location: '', linkedin: '', github: '', website: '' },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    custom: { title: '', lines: '' },
    sectionOrder: [...ALL_SECTIONS],
    hidden: [],
    settings: { template: 'modern', accent: ACCENTS[0].value, pageSize: 'A4', textSize: 'normal', spacing: 'normal' },
  }
}

const str = (v: unknown) => (typeof v === 'string' ? v : '')
const obj = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' ? (v as Record<string, unknown>) : {})
const list = <T,>(v: unknown, map: (o: Record<string, unknown>) => T): T[] => (Array.isArray(v) ? v.map((x) => map(obj(x))) : [])

/**
 * Rebuilds a ResumeData from anything (saved draft, imported file). Unknown
 * keys are dropped and missing ones filled in, so a bad file cannot break the page.
 */
export function normalize(raw: unknown): ResumeData {
  const base = emptyResume()
  const r = obj(raw)
  const p = obj(r.personal)
  const s = obj(r.settings)
  const order = Array.isArray(r.sectionOrder) ? (r.sectionOrder.filter((x) => ALL_SECTIONS.includes(x)) as SectionId[]) : []
  const template = str(s.template)
  const accent = str(s.accent)
  const scale = (v: unknown) => (v === 'small' || v === 'large' ? v : 'normal')
  const c = obj(r.custom)
  return {
    personal: {
      fullName: str(p.fullName),
      title: str(p.title),
      email: str(p.email),
      phone: str(p.phone),
      location: str(p.location),
      linkedin: str(p.linkedin),
      github: str(p.github),
      website: str(p.website),
    },
    summary: str(r.summary),
    experience: list(r.experience, (o) => ({
      id: str(o.id) || newId(),
      role: str(o.role),
      company: str(o.company),
      location: str(o.location),
      start: str(o.start),
      end: str(o.end),
      current: o.current === true,
      bullets: str(o.bullets),
    })),
    education: list(r.education, (o) => ({
      id: str(o.id) || newId(),
      degree: str(o.degree),
      school: str(o.school),
      location: str(o.location),
      start: str(o.start),
      end: str(o.end),
      details: str(o.details),
    })),
    skills: list(r.skills, (o) => ({ id: str(o.id) || newId(), category: str(o.category), items: str(o.items) })),
    projects: list(r.projects, (o) => ({
      id: str(o.id) || newId(),
      name: str(o.name),
      link: str(o.link),
      description: str(o.description),
      bullets: str(o.bullets),
    })),
    certifications: list(r.certifications, (o) => ({ id: str(o.id) || newId(), name: str(o.name), issuer: str(o.issuer), year: str(o.year) })),
    languages: list(r.languages, (o) => ({ id: str(o.id) || newId(), name: str(o.name), level: str(o.level) })),
    custom: { title: str(c.title), lines: str(c.lines) },
    // Keep the saved order, then append any section it does not mention.
    sectionOrder: [...new Set([...order, ...ALL_SECTIONS])],
    hidden: Array.isArray(r.hidden) ? (r.hidden.filter((x) => ALL_SECTIONS.includes(x)) as SectionId[]) : [],
    settings: {
      template: template in TEMPLATES ? (template as ResumeData['settings']['template']) : base.settings.template,
      accent: /^#[0-9a-f]{6}$/i.test(accent) ? accent : base.settings.accent,
      pageSize: s.pageSize === 'LETTER' ? 'LETTER' : 'A4',
      textSize: scale(s.textSize),
      spacing: scale(s.spacing),
    },
  }
}

function load(): ResumeData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return normalize(JSON.parse(saved))
  } catch {
    /* storage unavailable or corrupt: start empty */
  }
  return emptyResume()
}

export function isEmpty(data: ResumeData) {
  const { settings: _s, sectionOrder: _o, hidden: _h, ...content } = data
  return JSON.stringify(content) === JSON.stringify((({ settings, sectionOrder, hidden, ...rest }) => rest)(emptyResume()))
}

/** The draft lives only in this browser: state + auto-save to localStorage. */
export function useResume() {
  const [data, setData] = useState<ResumeData>(load)

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      } catch {
        /* storage full or unavailable: the draft still works for this visit */
      }
    }, 300)
    return () => window.clearTimeout(id)
  }, [data])

  const update = useCallback((patch: Partial<ResumeData> | ((d: ResumeData) => ResumeData)) => {
    setData((d) => (typeof patch === 'function' ? patch(d) : { ...d, ...patch }))
  }, [])

  return [data, update] as const
}
