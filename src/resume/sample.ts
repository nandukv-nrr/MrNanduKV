import { emptyResume, newId } from './store.ts'
import type { ResumeData } from './types.ts'

/** A made-up person, used by "Fill with example". Not anyone's real details. */
export function sampleResume(settings: ResumeData['settings']): ResumeData {
  return {
    ...emptyResume(),
    settings,
    personal: {
      fullName: 'Asha Menon',
      title: 'Frontend Developer',
      email: 'asha.menon@example.com',
      phone: '+91 98765 43210',
      location: 'Kochi, India',
      linkedin: 'linkedin.com/in/ashamenon',
      github: 'github.com/ashamenon',
      website: '',
    },
    summary:
      'Frontend developer with 4 years of experience building responsive, accessible web applications in React and TypeScript. Comfortable owning features from design hand-off to release, with a focus on performance and clean, reusable components.',
    experience: [
      {
        id: newId(),
        role: 'Frontend Developer',
        company: 'Brightlane Software',
        location: 'Kochi, India',
        start: 'Jun 2022',
        end: '',
        current: true,
        bullets:
          'Built and maintained 20+ screens of a logistics dashboard in React and TypeScript, used by 3,000 daily users\nCut initial page load time by 35% through code splitting and image optimisation\nCreated a shared component library adopted by three product teams\nWorked with designers and backend engineers to ship features every two-week sprint',
      },
      {
        id: newId(),
        role: 'Junior Web Developer',
        company: 'Pixelcraft Studio',
        location: 'Thrissur, India',
        start: 'Jul 2020',
        end: 'May 2022',
        current: false,
        bullets:
          'Developed marketing sites and landing pages for 15+ clients using HTML, CSS and JavaScript\nImproved accessibility scores to meet WCAG 2.1 AA on all new projects\nIntegrated REST APIs for contact forms, bookings and payments',
      },
    ],
    education: [
      {
        id: newId(),
        degree: 'B.Tech in Computer Science',
        school: 'Government Engineering College',
        location: 'Thrissur, India',
        start: '2016',
        end: '2020',
        details: '',
      },
    ],
    skills: [
      { id: newId(), category: 'Languages', items: 'JavaScript (ES6+), TypeScript, HTML5, CSS3' },
      { id: newId(), category: 'Frameworks', items: 'React, Redux Toolkit, Next.js' },
      { id: newId(), category: 'Tools', items: 'Git, Vite, Jest, Figma, Postman' },
    ],
    projects: [
      {
        id: newId(),
        name: 'Budget Buddy',
        link: 'github.com/ashamenon/budget-buddy',
        description: 'A personal expense tracker with charts and monthly reports.',
        bullets: 'Built with React, TypeScript and Chart.js\nWorks offline and stores data locally in the browser',
      },
    ],
    certifications: [{ id: newId(), name: 'Meta Front-End Developer Certificate', issuer: 'Coursera', year: '2021' }],
    languages: [
      { id: newId(), name: 'English', level: 'Fluent' },
      { id: newId(), name: 'Malayalam', level: 'Native' },
    ],
  }
}
