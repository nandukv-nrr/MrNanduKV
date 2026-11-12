import type { PageSize, TemplateId } from './types.ts'

/**
 * Every template is single-column with standard headings, real text and no
 * tables, icons or images — the layout rules applicant tracking systems
 * (ATS) parse reliably. Templates differ only in typography and spacing.
 * All sizes are in PDF points; the on-screen preview and the PDF both read
 * from this file so they stay in step.
 */
export interface TemplateSpec {
  id: TemplateId
  name: string
  blurb: string
  font: 'sans' | 'serif'
  /** Body text size. */
  base: number
  lineHeight: number
  margin: number
  nameSize: number
  headerAlign: 'left' | 'center'
  nameColor: 'accent' | 'text'
  headingColor: 'accent' | 'text' | 'muted'
  headingSize: number
  headingTracking: number
  headingRule: boolean
  sectionGap: number
  entryGap: number
}

export const TEMPLATES: Record<TemplateId, TemplateSpec> = {
  modern: {
    id: 'modern',
    name: 'Modern',
    blurb: 'Clean sans-serif with an accent colour.',
    font: 'sans',
    base: 10,
    lineHeight: 1.4,
    margin: 42,
    nameSize: 24,
    headerAlign: 'left',
    nameColor: 'accent',
    headingColor: 'accent',
    headingSize: 10,
    headingTracking: 0.8,
    headingRule: true,
    sectionGap: 13,
    entryGap: 7,
  },
  classic: {
    id: 'classic',
    name: 'Classic',
    blurb: 'Traditional serif, centred header.',
    font: 'serif',
    base: 10.5,
    lineHeight: 1.35,
    margin: 48,
    nameSize: 22,
    headerAlign: 'center',
    nameColor: 'text',
    headingColor: 'text',
    headingSize: 11,
    headingTracking: 0.6,
    headingRule: true,
    sectionGap: 13,
    entryGap: 7,
  },
  compact: {
    id: 'compact',
    name: 'Compact',
    blurb: 'Tighter spacing — fits more on one page.',
    font: 'sans',
    base: 9,
    lineHeight: 1.32,
    margin: 32,
    nameSize: 18,
    headerAlign: 'left',
    nameColor: 'text',
    headingColor: 'accent',
    headingSize: 9,
    headingTracking: 0.7,
    headingRule: true,
    sectionGap: 8,
    entryGap: 4,
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    blurb: 'Plain black and white, generous spacing.',
    font: 'sans',
    base: 10,
    lineHeight: 1.45,
    margin: 50,
    nameSize: 22,
    headerAlign: 'left',
    nameColor: 'text',
    headingColor: 'muted',
    headingSize: 8.5,
    headingTracking: 1.6,
    headingRule: false,
    sectionGap: 15,
    entryGap: 8,
  },
}

export const TEMPLATE_LIST = Object.values(TEMPLATES)

export const usesAccent = (spec: TemplateSpec) => spec.nameColor === 'accent' || spec.headingColor === 'accent'

/** Accent presets — all dark enough to read on white paper. */
export const ACCENTS = [
  { name: 'Navy', value: '#1e3a8a' },
  { name: 'Teal', value: '#0f766e' },
  { name: 'Forest', value: '#166534' },
  { name: 'Plum', value: '#6b21a8' },
  { name: 'Crimson', value: '#9f1239' },
  { name: 'Slate', value: '#334155' },
]

export const INK = { text: '#111111', muted: '#555555', rule: '#c9ccd1' }

/** Page sizes in PDF points. */
export const PAGE: Record<PageSize, { width: number; height: number; label: string }> = {
  A4: { width: 595.28, height: 841.89, label: 'A4' },
  LETTER: { width: 612, height: 792, label: 'US Letter' },
}
