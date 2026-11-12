import type { ResumeData, SectionId } from './types.ts'

/**
 * Turns the raw form data into the content actually printed: empty fields
 * and hidden sections dropped, bullets split, dates joined. The preview and
 * the PDF both render this, so they cannot drift apart.
 */
export interface ViewEntry {
  title: string
  subtitle?: string
  date?: string
  location?: string
  text?: string
  link?: string
  bullets: string[]
}

export type ViewSection =
  | { id: SectionId; heading: string; kind: 'text'; text: string }
  | { id: SectionId; heading: string; kind: 'entries'; entries: ViewEntry[] }
  | { id: SectionId; heading: string; kind: 'rows'; rows: { label: string; value: string }[] }

export interface ResumeView {
  name: string
  title: string
  contacts: { text: string; href?: string }[]
  sections: ViewSection[]
}

/** Standard headings — ATS software looks for exactly these words. */
export const SECTION_LABELS: Record<SectionId, string> = {
  summary: 'Summary',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  languages: 'Languages',
}

const t = (s: string) => s.trim()
const lines = (s: string) =>
  s
    .split('\n')
    .map((l) => l.replace(/^\s*[-•*–]\s*/, '').trim())
    .filter(Boolean)
const range = (start: string, end: string) => [t(start), t(end)].filter(Boolean).join(' – ')
export const withProtocol = (url: string) => (/^https?:\/\//i.test(url) ? url : `https://${url}`)
const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '')

export function buildView(data: ResumeData): ResumeView {
  const p = data.personal
  const contacts: ResumeView['contacts'] = []
  if (t(p.email)) contacts.push({ text: t(p.email), href: `mailto:${t(p.email)}` })
  if (t(p.phone)) contacts.push({ text: t(p.phone) })
  if (t(p.location)) contacts.push({ text: t(p.location) })
  for (const url of [p.linkedin, p.github, p.website]) {
    if (t(url)) contacts.push({ text: bare(t(url)), href: withProtocol(t(url)) })
  }

  const build: Record<SectionId, () => ViewSection | null> = {
    summary: () => (t(data.summary) ? { id: 'summary', heading: SECTION_LABELS.summary, kind: 'text', text: t(data.summary) } : null),
    experience: () => {
      const entries = data.experience
        .filter((e) => t(e.role) || t(e.company))
        .map((e) => ({
          title: t(e.role) || t(e.company),
          subtitle: t(e.role) ? t(e.company) : '',
          date: range(e.start, e.current ? 'Present' : e.end),
          location: t(e.location),
          bullets: lines(e.bullets),
        }))
      return entries.length ? { id: 'experience', heading: SECTION_LABELS.experience, kind: 'entries', entries } : null
    },
    education: () => {
      const entries = data.education
        .filter((e) => t(e.degree) || t(e.school))
        .map((e) => ({
          title: t(e.degree) || t(e.school),
          subtitle: t(e.degree) ? t(e.school) : '',
          date: range(e.start, e.end),
          location: t(e.location),
          text: t(e.details),
          bullets: [],
        }))
      return entries.length ? { id: 'education', heading: SECTION_LABELS.education, kind: 'entries', entries } : null
    },
    skills: () => {
      const rows = data.skills.filter((s) => t(s.items)).map((s) => ({ label: t(s.category), value: t(s.items) }))
      return rows.length ? { id: 'skills', heading: SECTION_LABELS.skills, kind: 'rows', rows } : null
    },
    projects: () => {
      const entries = data.projects
        .filter((e) => t(e.name))
        .map((e) => ({
          title: t(e.name),
          link: t(e.link) ? withProtocol(t(e.link)) : '',
          subtitle: t(e.link) ? bare(t(e.link)) : '',
          text: t(e.description),
          bullets: lines(e.bullets),
        }))
      return entries.length ? { id: 'projects', heading: SECTION_LABELS.projects, kind: 'entries', entries } : null
    },
    certifications: () => {
      const entries = data.certifications
        .filter((e) => t(e.name))
        .map((e) => ({ title: t(e.name), subtitle: t(e.issuer), date: t(e.year), bullets: [] }))
      return entries.length ? { id: 'certifications', heading: SECTION_LABELS.certifications, kind: 'entries', entries } : null
    },
    languages: () => {
      const items = data.languages.filter((l) => t(l.name)).map((l) => (t(l.level) ? `${t(l.name)} (${t(l.level)})` : t(l.name)))
      return items.length
        ? { id: 'languages', heading: SECTION_LABELS.languages, kind: 'rows', rows: [{ label: '', value: items.join(', ') }] }
        : null
    },
  }

  const sections = data.sectionOrder
    .filter((id) => !data.hidden.includes(id))
    .map((id) => build[id]())
    .filter((s): s is ViewSection => s !== null)

  return { name: t(p.fullName), title: t(p.title), contacts, sections }
}

/** Download file name, e.g. "Asha_Menon_Resume.pdf". */
export function resumeFileName(fullName: string) {
  const safe = fullName
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '_')
  return `${safe || 'My'}_Resume.pdf`
}
