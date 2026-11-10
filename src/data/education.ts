import type { EducationItem } from './types.ts'

export const education: EducationItem[] = [
  {
    title: 'Diploma in Computer Engineering and IT Infrastructure',
    place: 'NTTF NEC, Bangalore, Karnataka',
    period: '2018 — 2021',
  },
  { title: '12th (HSE)', period: '2018' },
  { title: 'SSLC', period: '2016' },
]

export const certifications: { title: string; detail?: string }[] = [
  { title: 'Diploma Certificate in Computer Engineering & IT Infrastructure' },
  { title: 'NOCN', detail: 'National Open College Network' },
  { title: 'NSDC', detail: 'National Skill Development Certificate' },
]
