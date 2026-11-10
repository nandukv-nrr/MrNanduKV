import type { Profile } from './types.ts'

/** Everything about you. Edit here — the UI updates everywhere. */
export const profile: Profile = {
  name: 'Nandu K V',
  firstName: 'Nandu',
  lastName: 'K V',
  role: 'Senior UX/UI Developer',
  roleSecondary: 'Software Programmer',
  location: 'Kannur, Kerala, India',
  email: 'nandukv96@gmail.com',
  phone: '+91 90720 65870',
  phoneHref: 'tel:+919072065870',
  tagline: 'Interfaces for complex systems, made clear.',
  intro:
    'Web developer with 4.9+ years of experience building ERP applications in React.js — accessible, fast, and designed around the people who use them every day.',
  summary: [
    'I am a web developer specialising in ERP application development with React.js. For the past 4.9+ years I have been building the screens that academic and administrative teams rely on — data-dense, workflow-heavy interfaces where clarity matters more than decoration.',
    'My focus is on delivering high-quality, accessible web solutions with real attention to user experience and performance. Across multiple projects that has meant improving application efficiency and user engagement, not just shipping features.',
  ],
  interests:
    'I am eager to contribute to inclusive, forward-thinking projects — products where accessibility and performance are treated as part of the design, not an afterthought.',
  strengths: [
    {
      title: 'Reusable component design',
      body: 'Designing dynamic, reusable components that improve modularity — an approach that reduced development time by 15%.',
    },
    {
      title: 'Accessibility first',
      body: 'Following WCAG guidelines so applications stay usable by people with diverse needs.',
    },
    {
      title: 'API integration',
      body: 'Integrating REST APIs in close collaboration with backend teams for reliable data flow and better performance.',
    },
    {
      title: 'Team collaboration',
      body: 'Strong communication, with Git and GitLab for version control and Jira and Redmine to keep sprints on track.',
    },
  ],
  facts: [
    { value: '4.9+', label: 'Years building ERP interfaces' },
    { value: '15%', label: 'Development time saved through reusable components' },
    { value: 'WCAG', label: 'Accessibility guidelines followed' },
    { value: '2021', label: 'With Iolite Technologies since' },
  ],
  languages: [
    { name: 'English', level: 'Fluent' },
    { name: 'Malayalam', level: 'Native' },
    { name: 'Hindi', level: 'Intermediate' },
    { name: 'Tamil', level: 'Intermediate' },
  ],
  socials: [
    { label: 'GitHub', url: 'https://github.com/nandukv-nrr', kind: 'github' },
    // TODO: paste your LinkedIn profile URL — the link stays hidden while this is empty.
    { label: 'LinkedIn', url: '', kind: 'linkedin' },
  ],
}
