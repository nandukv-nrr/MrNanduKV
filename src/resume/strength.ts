import type { ResumeData } from './types.ts'

export interface StrengthCheck {
  label: string
  ok: boolean
  /** What to do about it — shown only while the check fails. */
  tip: string
  weight: number
}

const WEAK_OPENERS = /^(responsible for|worked on|helped( with)?|assisted( with)?|duties included|tasked with|involved in|participated in)\b/i
const bullets = (s: string) => s.split('\n').map((l) => l.trim()).filter(Boolean)

/**
 * A checklist of what recruiters and ATS software look for. It measures
 * completeness and common writing habits — a guide, not a guarantee.
 */
export function resumeStrength(data: ResumeData, overOnePage: boolean): { score: number; checks: StrengthCheck[] } {
  const p = data.personal
  const shown = (id: ResumeData['sectionOrder'][number]) => !data.hidden.includes(id)
  const jobs = shown('experience') ? data.experience.filter((e) => e.role.trim() || e.company.trim()) : []
  const jobBullets = jobs.flatMap((j) => bullets(j.bullets))
  const skillCount = shown('skills') ? data.skills.flatMap((s) => s.items.split(',')).filter((s) => s.trim()).length : 0
  const summary = shown('summary') ? data.summary.trim() : ''
  const withNumbers = jobBullets.filter((b) => /\d/.test(b)).length
  const weak = jobBullets.filter((b) => WEAK_OPENERS.test(b)).length

  const checks: StrengthCheck[] = [
    { label: 'Name, email and phone', ok: !!(p.fullName.trim() && p.email.trim() && p.phone.trim()), tip: 'Add your name, email address and phone number.', weight: 15 },
    { label: 'Job title under your name', ok: !!p.title.trim(), tip: 'Add the job title you are applying for — ATS software matches on it.', weight: 5 },
    { label: 'LinkedIn or portfolio link', ok: !!(p.linkedin.trim() || p.github.trim() || p.website.trim()), tip: 'Add a LinkedIn, GitHub or website link.', weight: 5 },
    {
      label: 'Summary of 2–4 sentences',
      ok: summary.length >= 150 && summary.length <= 700,
      tip: summary.length > 700 ? 'Shorten your summary to 2–4 sentences.' : 'Write a 2–4 sentence summary (about 150–700 characters).',
      weight: 10,
    },
    { label: 'At least one job or project', ok: jobs.length > 0 || (shown('projects') && data.projects.some((x) => x.name.trim())), tip: 'Add your work experience, or a project if you are just starting out.', weight: 15 },
    {
      label: '3 or more bullet points per job',
      ok: jobs.length > 0 && jobs.every((j) => bullets(j.bullets).length >= 3),
      tip: 'Give every job at least three bullet points describing what you achieved.',
      weight: 10,
    },
    {
      label: 'Numbers in your achievements',
      ok: jobBullets.length > 0 && withNumbers / jobBullets.length >= 0.3,
      tip: 'Add numbers to more bullet points — percentages, users, time saved, team size.',
      weight: 10,
    },
    {
      label: 'Bullets start with strong verbs',
      ok: jobBullets.length > 0 && weak === 0,
      tip: weak ? `${weak} bullet${weak > 1 ? 's start' : ' starts'} with a weak phrase like “Responsible for”. Start with a verb: Built, Led, Reduced, Launched.` : 'Start each bullet with an action verb: Built, Led, Reduced, Launched.',
      weight: 5,
    },
    { label: '6 or more skills', ok: skillCount >= 6, tip: 'List at least six skills that match the job description.', weight: 10 },
    { label: 'Education', ok: shown('education') && data.education.some((e) => e.degree.trim() || e.school.trim()), tip: 'Add your highest qualification.', weight: 10 },
    { label: 'Fits on one page', ok: !overOnePage, tip: 'Trim to one page: use the Compact template, smaller text or tighter spacing.', weight: 5 },
  ]

  const total = checks.reduce((n, c) => n + c.weight, 0)
  const earned = checks.reduce((n, c) => n + (c.ok ? c.weight : 0), 0)
  return { score: Math.round((earned / total) * 100), checks }
}
