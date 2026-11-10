/**
 * Site-wide configuration. If the repository is renamed or a custom domain
 * is added, update `origin` and `base` here — everything else follows.
 */
export const site = {
  origin: 'https://nandukv-nrr.github.io',
  /** Must match the GitHub repository name, with leading and trailing slash. */
  base: '/MrNanduKV/',
  name: 'Nandu K V',
  title: 'Nandu K V — Senior UX/UI Developer · React.js',
  description:
    'Portfolio of Nandu K V, a Senior UX/UI Developer with 4.9+ years of experience building accessible, high-performance ERP interfaces with React.js.',
  locale: 'en_IN',
  ogImage: 'og-image.png',
  themeColor: { dark: '#0a0b0d', light: '#f1eee6' },
} as const

export const siteUrl = (path = '') => `${site.origin}${site.base}${path.replace(/^\//, '')}`
