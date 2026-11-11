export interface SocialLink {
  label: string
  /** Leave empty ('') to hide the link until you have the URL. */
  url: string
  kind: 'github' | 'linkedin'
}

export interface Profile {
  name: string
  firstName: string
  lastName: string
  role: string
  roleSecondary: string
  location: string
  email: string
  phone: string
  phoneHref: string
  tagline: string
  intro: string
  summary: string[]
  interests: string
  strengths: { title: string; body: string }[]
  facts: { value: string; label: string }[]
  languages: { name: string; level: string }[]
  socials: SocialLink[]
}

export interface Job {
  company: string
  location: string
  titles: string[]
  period: string
  current: boolean
  summary: string
  highlights: { title: string; body: string }[]
  stack: string[]
}

export interface SkillGroup {
  id: string
  name: string
  note?: string
  items: string[]
}

export interface EducationItem {
  title: string
  place?: string
  period: string
}

export interface Screenshot {
  /** Path relative to /public, e.g. 'projects/espro-erp/dashboard.webp' */
  src: string
  alt: string
  caption?: string
}

export type ProjectVisual = 'exam' | 'erp' | 'store' | 'football' | 'finance'

/** 'work' = client / employer projects, 'personal' = side projects. */
export type ProjectGroup = 'work' | 'personal'

export interface Project {
  slug: string
  group: ProjectGroup
  index: string
  name: string
  shortName: string
  category: string
  /** Optional short label on the card, e.g. 'Live' or 'In progress'. */
  status?: string
  tagline: string
  description: string
  overview: string[]
  /** Optional facts. Any field left undefined is simply not rendered. */
  about: {
    purpose?: string
    problem?: string
    audience?: string
    objectives?: string[]
  }
  role: string
  contributions: { area: string; items: string[] }[]
  /** Leave empty ([]) until known — the stack block is then not rendered. */
  stack: { group: string; items: string[] }[]
  features: { title: string; body: string }[]
  process: { title: string; body: string }[]
  /** Leave undefined until a public URL exists. */
  liveUrl?: string
  repoUrl?: string
  /** Shown beside the inactive live button while no URL is available. */
  linkNote?: string
  screenshots: Screenshot[]
  visual: ProjectVisual
  seo: { title: string; description: string }
}
