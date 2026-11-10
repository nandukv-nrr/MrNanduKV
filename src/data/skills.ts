import type { SkillGroup } from './types.ts'

/** Skill groups as listed on the resume. No ratings, no percentages. */
export const skills: SkillGroup[] = [
  {
    id: 'frontend',
    name: 'Frontend Development',
    items: ['React.js', 'JavaScript (ES6+)', 'TypeScript', 'HTML5', 'CSS3', 'Sass', 'Bootstrap', 'Material UI'],
  },
  {
    id: 'libraries',
    name: 'UI & Utility Libraries',
    note: 'Used in production ERP work',
    items: ['Ant Design', 'ag-Grid', 'Dayjs', 'Moment', 'Lodash', 'jQuery'],
  },
  { id: 'state', name: 'State Management', items: ['Redux Toolkit'] },
  {
    id: 'api',
    name: 'API & Authentication',
    items: ['RESTful APIs', 'JWT Authentication', 'Postman'],
  },
  {
    id: 'ai',
    name: 'AI-Assisted Development',
    items: ['Google Antigravity', 'OpenAI Codex', 'AI Coding Agents', 'Prompt Engineering'],
  },
  { id: 'build', name: 'Build Tools', items: ['Webpack', 'Vite'] },
  { id: 'vcs', name: 'Version Control', items: ['Git', 'GitHub', 'GitLab'] },
  {
    id: 'pm',
    name: 'Project Management',
    items: ['Jira', 'Redmine', 'TaskFlow (in-house product)'],
  },
  {
    id: 'a11y',
    name: 'Accessibility',
    items: ['Web Accessibility', 'WCAG Standards'],
  },
]
