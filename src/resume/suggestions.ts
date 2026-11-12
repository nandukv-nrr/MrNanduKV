/** Suggestion lists for the resume form. Suggestions only — visitors can always type their own. */

export const LEVELS = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic']

export const LANGUAGES = [
  'English', 'Hindi', 'Malayalam', 'Tamil', 'Telugu', 'Kannada', 'Marathi', 'Bengali', 'Gujarati', 'Punjabi', 'Urdu', 'Odia',
  'Assamese', 'Konkani', 'Sanskrit', 'Nepali', 'Sinhala', 'Arabic', 'French', 'German', 'Spanish', 'Portuguese', 'Italian', 'Dutch',
  'Russian', 'Ukrainian', 'Polish', 'Czech', 'Greek', 'Turkish', 'Persian', 'Hebrew', 'Swedish', 'Norwegian', 'Danish', 'Finnish',
  'Mandarin Chinese', 'Cantonese', 'Japanese', 'Korean', 'Vietnamese', 'Thai', 'Indonesian', 'Malay', 'Filipino', 'Swahili',
  'Afrikaans', 'Romanian', 'Hungarian', 'Bulgarian', 'Serbian', 'Croatian',
]

export const JOB_TITLES = [
  'Frontend Developer', 'Senior Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Software Engineer',
  'Senior Software Engineer', 'Software Developer', 'Web Developer', 'React Developer', 'UI Developer', 'UX/UI Developer',
  'Mobile App Developer', 'Android Developer', 'iOS Developer', 'DevOps Engineer', 'Cloud Engineer', 'Site Reliability Engineer',
  'QA Engineer', 'Test Automation Engineer', 'Data Analyst', 'Data Scientist', 'Data Engineer', 'Machine Learning Engineer',
  'Business Analyst', 'Product Manager', 'Project Manager', 'Scrum Master', 'Engineering Manager', 'Technical Lead',
  'UI/UX Designer', 'Product Designer', 'Graphic Designer', 'Content Writer', 'Technical Writer', 'Digital Marketing Executive',
  'SEO Specialist', 'Social Media Manager', 'Marketing Manager', 'Sales Executive', 'Business Development Executive',
  'Account Manager', 'Customer Support Executive', 'Customer Success Manager', 'HR Executive', 'HR Manager', 'Recruiter',
  'Accountant', 'Financial Analyst', 'Operations Manager', 'Office Administrator', 'Executive Assistant', 'System Administrator',
  'Network Engineer', 'Cybersecurity Analyst', 'Database Administrator', 'Mechanical Engineer', 'Civil Engineer',
  'Electrical Engineer', 'Teacher', 'Lecturer', 'Research Assistant', 'Intern', 'Software Engineering Intern', 'Freelancer',
]

export const DEGREES = [
  'B.Tech in Computer Science', 'B.Tech in Information Technology', 'B.Tech in Electronics and Communication',
  'B.Tech in Mechanical Engineering', 'B.Tech in Civil Engineering', 'B.E. in Computer Science', 'B.Sc. in Computer Science',
  'B.Sc. in Information Technology', 'B.Sc. in Mathematics', 'B.Sc. in Physics', 'BCA (Bachelor of Computer Applications)',
  'B.Com (Bachelor of Commerce)', 'BBA (Bachelor of Business Administration)', 'B.A. in English', 'B.A. in Economics',
  'B.Des (Bachelor of Design)', 'M.Tech in Computer Science', 'M.Sc. in Computer Science', 'M.Sc. in Data Science',
  'MCA (Master of Computer Applications)', 'MBA (Master of Business Administration)', 'M.Com (Master of Commerce)',
  'M.A. in English', 'PhD', 'Diploma in Computer Engineering', 'Diploma in Mechanical Engineering',
  'Diploma in Electronics Engineering', 'Higher Secondary (12th)', 'Secondary School (10th)',
]

export const SKILL_GROUP_NAMES = [
  'Languages', 'Frameworks', 'Libraries', 'Frontend', 'Backend', 'Databases', 'Cloud & DevOps', 'Tools', 'Testing', 'Design',
  'Data & Analytics', 'Marketing', 'Soft Skills', 'Project Management', 'Technical Skills',
]

/** Skills by area. `match` is tested against the group name, then the job title, to offer one-tap suggestions. */
export const SKILL_SETS: { match: RegExp; skills: string[] }[] = [
  {
    match: /language|programming/i,
    skills: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Kotlin', 'Swift', 'Dart', 'SQL', 'HTML5', 'CSS3', 'Sass', 'Bash', 'R', 'Scala', 'MATLAB'],
  },
  {
    match: /front|ui|web|react|framework|librar/i,
    skills: ['React', 'Next.js', 'Redux', 'Redux Toolkit', 'Vue.js', 'Nuxt', 'Angular', 'Svelte', 'jQuery', 'Tailwind CSS', 'Bootstrap', 'Material UI', 'Ant Design', 'Chakra UI', 'styled-components', 'React Query', 'React Router', 'Three.js', 'GSAP', 'D3.js', 'Chart.js', 'AG Grid', 'Webpack', 'Vite', 'Responsive Design', 'Web Accessibility (WCAG)', 'REST APIs', 'GraphQL', 'Progressive Web Apps'],
  },
  {
    match: /back|server|full.?stack|api/i,
    skills: ['Node.js', 'Express', 'NestJS', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'ASP.NET Core', 'Laravel', 'Ruby on Rails', 'REST APIs', 'GraphQL', 'gRPC', 'Microservices', 'WebSockets', 'JWT Authentication', 'OAuth 2.0', 'RabbitMQ', 'Kafka', 'Redis'],
  },
  {
    match: /mobile|android|ios|app dev/i,
    skills: ['React Native', 'Flutter', 'Android SDK', 'Jetpack Compose', 'SwiftUI', 'UIKit', 'Expo', 'Firebase', 'Push Notifications', 'App Store Deployment'],
  },
  {
    match: /database|data base|sql|storage/i,
    skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'Redis', 'Firebase Firestore', 'Microsoft SQL Server', 'Oracle', 'DynamoDB', 'Elasticsearch', 'Supabase', 'Prisma'],
  },
  {
    match: /cloud|devops|infra|reliab|deploy/i,
    skills: ['AWS', 'Microsoft Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'GitHub Actions', 'GitLab CI/CD', 'Linux', 'Nginx', 'Ansible', 'CI/CD', 'Monitoring', 'Netlify', 'Vercel'],
  },
  {
    match: /test|qa|quality/i,
    skills: ['Jest', 'React Testing Library', 'Cypress', 'Playwright', 'Selenium', 'Vitest', 'Mocha', 'JUnit', 'Postman', 'Unit Testing', 'Integration Testing', 'Test Automation', 'Manual Testing', 'JMeter'],
  },
  {
    match: /tool|version|platform/i,
    skills: ['Git', 'GitHub', 'GitLab', 'Bitbucket', 'VS Code', 'Jira', 'Confluence', 'Redmine', 'Trello', 'Slack', 'Postman', 'Figma', 'npm', 'Yarn', 'Docker', 'Chrome DevTools', 'Linux', 'Microsoft Excel', 'Notion'],
  },
  {
    match: /data|analy|scien|machine|ml|ai/i,
    skills: ['Python', 'SQL', 'Pandas', 'NumPy', 'scikit-learn', 'TensorFlow', 'PyTorch', 'Power BI', 'Tableau', 'Microsoft Excel', 'Data Visualization', 'Statistics', 'Machine Learning', 'Deep Learning', 'Natural Language Processing', 'ETL', 'Apache Spark', 'Jupyter', 'Prompt Engineering', 'A/B Testing'],
  },
  {
    match: /design|ux|creative|graphic/i,
    skills: ['Figma', 'Adobe XD', 'Sketch', 'Adobe Photoshop', 'Adobe Illustrator', 'Wireframing', 'Prototyping', 'User Research', 'Usability Testing', 'Design Systems', 'Interaction Design', 'Information Architecture', 'Typography', 'Canva'],
  },
  {
    match: /market|seo|content|social|brand/i,
    skills: ['SEO', 'Google Analytics', 'Google Ads', 'Content Marketing', 'Email Marketing', 'Social Media Marketing', 'Copywriting', 'Meta Ads', 'Keyword Research', 'Marketing Automation', 'HubSpot', 'Mailchimp', 'Brand Strategy', 'Market Research'],
  },
  {
    match: /manage|agile|scrum|product|lead|project/i,
    skills: ['Agile', 'Scrum', 'Kanban', 'Sprint Planning', 'Roadmapping', 'Stakeholder Management', 'Risk Management', 'Jira', 'Budgeting', 'Team Leadership', 'Mentoring', 'Requirements Gathering', 'Product Strategy'],
  },
  {
    match: /soft|personal|interpersonal|people/i,
    skills: ['Communication', 'Teamwork', 'Problem Solving', 'Time Management', 'Leadership', 'Adaptability', 'Critical Thinking', 'Attention to Detail', 'Collaboration', 'Presentation Skills', 'Negotiation', 'Customer Service', 'Mentoring', 'Decision Making'],
  },
  {
    match: /sales|business|account|finance|hr|recruit|support|admin|operation/i,
    skills: ['Microsoft Excel', 'Microsoft Office', 'CRM', 'Salesforce', 'Lead Generation', 'Client Relations', 'Negotiation', 'Financial Reporting', 'Tally', 'SAP', 'QuickBooks', 'Payroll', 'Recruitment', 'Onboarding', 'Customer Service', 'Data Entry', 'Vendor Management'],
  },
]

/** Every known skill, for type-ahead. */
export const ALL_SKILLS = [...new Set(SKILL_SETS.flatMap((s) => s.skills))].sort((a, b) => a.localeCompare(b))

/** One-tap skill ideas for a group, falling back to the person's job title. */
export function skillIdeas(groupName: string, jobTitle: string): string[] {
  const byGroup = groupName.trim() ? SKILL_SETS.find((s) => s.match.test(groupName)) : undefined
  const byTitle = jobTitle.trim() ? SKILL_SETS.find((s) => s.match.test(jobTitle)) : undefined
  return (byGroup ?? byTitle)?.skills ?? []
}

/** Type-ahead ranking: names that start with the query first, then names that contain it. */
export function rank(options: string[], query: string, limit = 8): string[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const starts: string[] = []
  const contains: string[] = []
  for (const o of options) {
    const l = o.toLowerCase()
    if (l.startsWith(q)) starts.push(o)
    else if (l.includes(q)) contains.push(o)
  }
  return [...starts, ...contains].slice(0, limit)
}
