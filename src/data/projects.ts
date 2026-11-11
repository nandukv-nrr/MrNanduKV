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
 * Only facts you have provided are stated here. Extend with care.
 */
export const projects: Project[] = [
  {
    slug: 'espro-erp',
    group: 'work',
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
    group: 'work',
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

  // ---------- Personal projects ----------
  // TODO: fill in `stack` for each personal project (the stack block stays hidden while it is empty).
  {
    slug: 'klothiq',
    group: 'personal',
    index: '01',
    name: 'KLOTHIQ — Clothing Brand Website',
    shortName: 'KLOTHIQ',
    category: 'Website · Fashion brand',
    status: 'Live',
    tagline: 'An online home for a clothing brand.',
    description: 'A website for KLOTHIQ, a clothing brand — built to present the label and its collections online.',
    overview: [
      'KLOTHIQ is a clothing brand, and this is its website: the place where the brand and its collections are presented online.',
      'It is a personal project, designed and published as a live site on Netlify.',
    ],
    about: {
      purpose: 'Give the KLOTHIQ clothing brand a presence on the web.',
      audience: 'People browsing the brand and its clothing.',
    },
    role: 'Personal project',
    contributions: [
      {
        area: 'Website',
        items: ['Built the KLOTHIQ brand website', 'Published it as a live site on Netlify'],
      },
    ],
    stack: [],
    // TODO: add the site's real features (catalogue, product pages, cart…) once confirmed.
    features: [
      { title: 'Brand storefront', body: 'A website that presents the KLOTHIQ clothing brand and its collections.' },
      { title: 'Live on the web', body: 'Published and publicly available on Netlify.' },
    ],
    process: [],
    liveUrl: 'https://klothiq.netlify.app/',
    screenshots: [],
    visual: 'store',
    seo: {
      title: 'KLOTHIQ — Clothing brand website',
      description: 'Personal project: KLOTHIQ, a website for a clothing brand, live on Netlify.',
    },
  },
  {
    slug: 'kick-clash',
    group: 'personal',
    index: '02',
    name: 'KICK CLASH — Football Club Management',
    shortName: 'KICK CLASH',
    category: 'Web application · Football',
    status: 'Live',
    tagline: 'Run a football club from one app — matches, players, teams, stats and fees.',
    description:
      'A football management application: schedule matches, manage players and teams, run tournaments, track match and player stats, and collect payments.',
    overview: [
      'KICK CLASH is a football management application for running a club. It brings the day-to-day work of organising football into one place — from scheduling matches to collecting fees.',
      'Players get their own login and a full profile with their details and statistics. Organisers can create teams, generate balanced teams from player performance, run tournaments, record match stats and share posters in a gallery.',
    ],
    about: {
      purpose: 'Bring everything a football club needs to organise its games into a single application.',
      problem: 'Scheduling, team selection, stats and fee collection are usually spread across chats, spreadsheets and paper.',
      audience: 'Football clubs, their organisers and their players.',
      objectives: [
        'Schedule matches and tournaments in one place',
        'Build fair teams based on player performance',
        'Keep detailed match and player statistics',
        'Collect payments from players',
      ],
    },
    role: 'Personal project',
    contributions: [
      {
        area: 'Club operations',
        items: ['Match scheduling and tournaments', 'Team creation and performance-based team generation', 'Payment collection'],
      },
      {
        area: 'Players',
        items: ['Player login', 'Player profiles with full details', 'Player and match statistics'],
      },
    ],
    stack: [{ group: 'Hosting', items: ['Firebase Hosting'] }],
    features: [
      { title: 'Match scheduling', body: 'Plan and schedule matches for the club.' },
      { title: 'Player login', body: 'Players sign in to their own account.' },
      { title: 'Team creation', body: 'Create and manage the club’s teams.' },
      { title: 'Team generator', body: 'Generate balanced teams based on player performance.' },
      { title: 'Tournaments', body: 'Organise and run tournaments.' },
      { title: 'Match stats', body: 'Record and review statistics for every match.' },
      { title: 'Player stats & profiles', body: 'Full player profiles with personal details and performance statistics.' },
      { title: 'Poster gallery', body: 'A gallery of match and event posters.' },
      { title: 'Payment collection', body: 'Collect and track payments from players.' },
    ],
    process: [],
    liveUrl: 'https://kick-clash---club.firebaseapp.com/',
    screenshots: [],
    visual: 'football',
    seo: {
      title: 'KICK CLASH — Football club management application',
      description:
        'Personal project: KICK CLASH, a football management app with match scheduling, performance-based team generation, tournaments, player stats and payment collection.',
    },
  },
  {
    slug: 'fintrack',
    group: 'personal',
    index: '03',
    name: 'FinTrack — Finance & Expense Manager',
    shortName: 'FinTrack',
    category: 'Web application · Personal finance',
    tagline: 'Expenses, savings, plans and AI insights — in one finance app.',
    description:
      'A personal finance and expense manager with daily expense tracking, monthly books, savings goals, AI-assisted analysis, reports and PDF / Excel export.',
    overview: [
      'FinTrack is a financial and expense management application. It covers the full loop of managing money: adding daily expenses, keeping monthly books, planning ahead and understanding where the money goes.',
      'Charts, cash-flow views and full report pages turn the numbers into something readable, AI-integrated analysis adds insight on top, and everything can be exported to PDF or Excel. Access is protected with an encrypted login.',
    ],
    about: {
      purpose: 'Manage personal finances and expenses in a single application.',
      audience: 'People who want to track spending, save towards goals and plan their money.',
      objectives: [
        'Make adding and reviewing daily expenses quick',
        'Keep monthly books and track savings goals',
        'Explain spending with charts, reports and AI analysis',
        'Keep financial data protected with an encrypted login',
      ],
    },
    role: 'Personal project',
    contributions: [
      {
        area: 'Tracking',
        items: ['Daily expense entry', 'Monthly books and expense management', 'Borrowed and lent money tracking'],
      },
      {
        area: 'Insight',
        items: ['Charts and cash-flow views', 'Full report pages and summaries', 'AI-integrated analysis and expense-management tips'],
      },
      {
        area: 'Planning',
        items: ['Savings goals', 'Upcoming plans', 'Checklists and tasks'],
      },
    ],
    stack: [],
    features: [
      { title: 'Daily expenses', body: 'Add expenses day by day as they happen.' },
      { title: 'Monthly books', body: 'Keep books and manage expenses month by month.' },
      { title: 'PDF & Excel export', body: 'Export expenses and reports to PDF or Excel.' },
      { title: 'AI analysis', body: 'AI-integrated analysis of spending.' },
      { title: 'Charts & flows', body: 'Visual charts and cash-flow views of income and spending.' },
      { title: 'Full reports', body: 'Dedicated report pages with summaries of every period.' },
      { title: 'Savings goals', body: 'Set goals and track progress towards them.' },
      { title: 'Upcoming plans', body: 'Note planned expenses before they happen.' },
      { title: 'Borrowed & lent', body: 'Track money borrowed and money to get back.' },
      { title: 'Checklists & tasks', body: 'Built-in checklists and tasks alongside the finances.' },
      { title: 'Encrypted login', body: 'Accounts are protected with an encrypted login.' },
      { title: 'Expense tips', body: 'Summaries with practical tips for managing expenses.' },
    ],
    process: [],
    // TODO: add liveUrl when the public link is ready.
    linkNote: 'The public link for FinTrack will be added soon.',
    screenshots: [],
    visual: 'finance',
    seo: {
      title: 'FinTrack — Finance and expense management application',
      description:
        'Personal project: FinTrack, a finance and expense manager with monthly books, savings goals, AI analysis, charts, reports and PDF / Excel export.',
    },
  },
]

export const projectPath = (slug: string) => `/projects/${slug}/`

export const workProjects = projects.filter((p) => p.group === 'work')
export const personalProjects = projects.filter((p) => p.group === 'personal')

/** Home-page section a project is listed in (used by back links and the nav). */
export const projectSection = (p: Project) => (p.group === 'personal' ? 'projects' : 'work')
