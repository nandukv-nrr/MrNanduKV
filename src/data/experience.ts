import type { Job } from './types.ts'

export const experience: Job[] = [
  {
    company: 'Iolite Technologies Pvt Limited',
    location: 'Bangalore',
    titles: ['Software Programmer', 'Senior UX/UI Developer'],
    period: 'December 2021 — Present',
    current: true,
    summary:
      'Developing and maintaining ERP applications in React.js — from shared component foundations to the accessible, data-heavy screens built on top of them.',
    highlights: [
      {
        title: 'ERP application development',
        body: 'Developed and maintained ERP applications using ReactJS, Bootstrap 5, Material UI, Ant Design, Dayjs, Moment, jQuery, ag-Grid, Lodash, and more.',
      },
      {
        title: 'Reusable, dynamic components',
        body: 'Designed and implemented reusable, dynamic components, improving modularity and reducing development time by 15%.',
      },
      {
        title: 'REST API integration',
        body: 'Integrated REST APIs, collaborating closely with backend teams to ensure reliable data flow and enhance application performance.',
      },
      {
        title: 'Web accessibility',
        body: 'Prioritized web accessibility, following WCAG guidelines to make applications usable by individuals with diverse needs.',
      },
      {
        title: 'Version control',
        body: 'Managed version control using Git and GitLab, ensuring seamless team collaboration.',
      },
      {
        title: 'Delivery and tracking',
        body: 'Used Redmine and Jira for efficient project management and issue tracking, improving sprint delivery timelines.',
      },
    ],
    stack: ['ReactJS', 'Bootstrap 5', 'Material UI', 'Ant Design', 'ag-Grid', 'Dayjs', 'Moment', 'Lodash', 'jQuery'],
  },
]
