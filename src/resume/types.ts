export type SectionId = 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'languages' | 'custom'

export type TemplateId = 'modern' | 'classic' | 'compact' | 'minimal'
export type PageSize = 'A4' | 'LETTER'
/** Three-step fine-tuning for text size and spacing. */
export type Scale = 'small' | 'normal' | 'large'

export interface Personal {
  fullName: string
  title: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  website: string
}

export interface ExperienceItem {
  id: string
  role: string
  company: string
  location: string
  start: string
  end: string
  current: boolean
  /** One bullet point per line. */
  bullets: string
}

export interface EducationItem {
  id: string
  degree: string
  school: string
  location: string
  start: string
  end: string
  details: string
}

export interface SkillItem {
  id: string
  category: string
  /** Comma-separated. */
  items: string
}

export interface ProjectItem {
  id: string
  name: string
  link: string
  description: string
  /** One bullet point per line. */
  bullets: string
}

export interface CertificationItem {
  id: string
  name: string
  issuer: string
  year: string
}

export interface LanguageItem {
  id: string
  name: string
  level: string
}

export interface ResumeSettings {
  template: TemplateId
  accent: string
  pageSize: PageSize
  textSize: Scale
  spacing: Scale
}

export interface ResumeData {
  personal: Personal
  summary: string
  experience: ExperienceItem[]
  education: EducationItem[]
  skills: SkillItem[]
  projects: ProjectItem[]
  certifications: CertificationItem[]
  languages: LanguageItem[]
  /** A free section the visitor names themselves (awards, volunteering, …). One line per item. */
  custom: { title: string; lines: string }
  sectionOrder: SectionId[]
  hidden: SectionId[]
  settings: ResumeSettings
}
