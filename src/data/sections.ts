/** Home-page sections, in page order. Nav, hero index and section numbers all read from here. */
export const sections = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
] as const

export type SectionId = (typeof sections)[number]['id']

/** Two-digit number of a section, e.g. sectionIndex('work') === '02'. */
export const sectionIndex = (id: SectionId) => String(sections.findIndex((s) => s.id === id) + 1).padStart(2, '0')
