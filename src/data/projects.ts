import type { Project } from './types.ts'

/**
 * Project case studies. Each entry becomes its own page at /projects/<slug>/.
 *
 * To complete a project:
 *  - liveUrl / repoUrl : add the URL and the buttons activate automatically.
 *  - screenshots       : drop images in /public/projects/<slug>/ and list them
 *                        here — the gallery appears once at least one exists.
 *  - about / features / process : optional; empty sections are not rendered.
 *
 * Only facts from the resume are stated here. Extend with care.
 */
export const projects: Project[] = [
  {
    slug: 'espro-erp',
    index: '01',
    name: 'ESPro — Excellence and Service Pro ERP',
    shortName: 'ESPro ERP',
    category: 'Enterprise ERP · University',
    tagline: 'Front-end modules for Christ University’s in-house ERP.',
    description:
      'Key front-end modules for the in-house ERP system that supports academic and administrative workflows at Christ University.',
    overview: [
      'ESPro — Excellence and Service Pro — is Christ University’s in-house ERP system. It is the software layer behind academic and administrative work at the university.',
      'I developed key front-end modules for the system, with a focus on user experience and accessibility for the thousands of university users who depend on it.',
    ],
    about: {
      purpose: 'An in-house ERP that facilitates academic and administrative workflows for the university.',
      audience: 'Thousands of university users across academic and administrative functions.',
      objectives: [
        'Support academic and administrative workflows in one system',
        'Improve the user experience of day-to-day ERP tasks',
        'Make the interface accessible to users with diverse needs',
      ],
    },
    role: 'Front-end developer',
    contributions: [
      {
        area: 'Front-end',
        items: [
          'Developed key front-end modules of the ERP in ReactJS',
          'Enhanced user experience and accessibility for thousands of university users',
        ],
      },
      {
        area: 'API integration',
        items: ['Connected front-end modules to the system’s REST APIs'],
      },
    ],
    stack: [
      { group: 'Core', items: ['ReactJS', 'REST API'] },
      { group: 'UI libraries', items: ['Material UI', 'AntDesign', 'Bootstrap'] },
      { group: 'Data grid', items: ['AG-Grid'] },
    ],
    features: [
      {
        title: 'Academic workflows',
        body: 'Front-end modules that facilitate the university’s academic processes.',
      },
      {
        title: 'Administrative workflows',
        body: 'Screens supporting the administrative side of university operations.',
      },
      {
        title: 'Accessible by design',
        body: 'User experience and accessibility improvements reaching thousands of users.',
      },
    ],
    process: [
      {
        title: 'Data-dense screens on AG-Grid',
        body: 'Tabular, record-heavy views are built on AG-Grid, the data grid used across the project.',
      },
      {
        title: 'Established component libraries',
        body: 'Material UI, AntDesign and Bootstrap provide the interface foundation for the modules.',
      },
      {
        title: 'REST-driven data flow',
        body: 'Modules read and write through REST APIs rather than holding their own data.',
      },
    ],
    // TODO: add liveUrl above if a public link exists.
    linkNote: 'ESPro is an in-house university system, so it has no public demo.',
    screenshots: [],
    visual: 'erp',
    seo: {
      title: 'ESPro ERP — Front-end modules for Christ University’s ERP',
      description:
        'Case study: key ReactJS front-end modules for ESPro, Christ University’s in-house ERP, built with Material UI, AntDesign, AG-Grid and REST APIs.',
    },
  },
  {
    slug: 'online-exam-web-application',
    index: '02',
    name: 'Online Exam Web Application',
    shortName: 'Online Exam',
    category: 'Web Application · Assessment',
    tagline: 'A user-friendly platform for conducting online exams.',
    description:
      'A user-friendly platform that lets educational institutions and corporates conduct online exams efficiently.',
    overview: [
      'The Online Exam Web Application is a platform for running exams online. It was developed for educational institutions and corporates that need to conduct examinations efficiently.',
      'The emphasis is on being user-friendly: a platform people can use to conduct an exam without friction.',
    ],
    about: {
      purpose: 'To give organisations a platform for conducting exams online.',
      problem: 'Conducting exams efficiently for institutions and corporates.',
      audience: 'Educational institutions and corporates.',
      objectives: ['Conduct online exams efficiently', 'Keep the platform user-friendly'],
    },
    role: 'Developer',
    contributions: [
      {
        area: 'Platform',
        items: ['Developed a user-friendly platform for conducting online exams'],
      },
    ],
    stack: [
      { group: 'Front-end', items: ['ReactJS', 'HTML', 'CSS'] },
      { group: 'Back-end', items: ['Python', 'Django'] },
    ],
    features: [
      {
        title: 'Online exams',
        body: 'Institutions and corporates can conduct exams on the web.',
      },
      {
        title: 'Built for two audiences',
        body: 'Designed to serve both educational institutions and corporate use.',
      },
      {
        title: 'User-friendly platform',
        body: 'Usability is the stated goal of the product.',
      },
    ],
    process: [
      {
        title: 'React front-end',
        body: 'The interface is built with ReactJS, HTML and CSS.',
      },
      {
        title: 'Django back-end',
        body: 'Python and Django power the server side of the platform.',
      },
    ],
    // TODO: add liveUrl / repoUrl above when available.
    linkNote: 'A public link for this project has not been published yet.',
    screenshots: [],
    visual: 'exam',
    seo: {
      title: 'Online Exam Web Application — ReactJS & Django',
      description:
        'Case study: a user-friendly online exam platform for educational institutions and corporates, built with ReactJS, Python and Django.',
    },
  },
]

export const projectPath = (slug: string) => `/projects/${slug}/`
