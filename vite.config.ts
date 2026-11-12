import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { staticPages } from './src/data/pages.ts'
import { profile } from './src/data/profile.ts'
import { projectPath, projects } from './src/data/projects.ts'
import { site, siteUrl } from './src/data/site.ts'

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

interface PageSeo {
  title: string
  description: string
  path: string
  noindex?: boolean
}

/** The per-page <head> block. Regenerated for every pre-rendered route. */
function seoBlock({ title, description, path, noindex }: PageSeo): string {
  const url = siteUrl(path)
  const image = siteUrl(site.ogImage)
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    noindex ? `<meta name="robots" content="noindex" />` : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(site.name)}" />`,
    `<meta property="og:locale" content="${site.locale}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ].join('\n    ')
}

const SEO_RE = /<!--seo:start-->[\s\S]*?<!--seo:end-->/

function withSeo(html: string, page: PageSeo): string {
  return html.replace(SEO_RE, `<!--seo:start-->\n    ${seoBlock(page)}\n    <!--seo:end-->`)
}

function personJsonLd(): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.role,
    url: siteUrl(),
    email: `mailto:${profile.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Kannur', addressRegion: 'Kerala', addressCountry: 'IN' },
    worksFor: { '@type': 'Organization', name: 'Iolite Technologies Pvt Limited' },
    sameAs: profile.socials.map((s) => s.url).filter(Boolean),
  })
}

/**
 * GitHub Pages is static hosting, so every route needs a real file.
 *  - index.html gets its SEO block and JSON-LD filled in from /src/data.
 *  - each project gets dist/projects/<slug>/index.html with its own metadata,
 *    so deep links and refreshes return 200 and share previews are correct.
 *  - 404.html is the app shell, so unknown URLs still boot the router.
 *  - sitemap.xml and robots.txt are generated from the same data.
 */
function staticRoutes(): Plugin {
  let outDir = 'dist'
  return {
    name: 'portfolio-static-routes',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    transformIndexHtml(html) {
      return withSeo(html, { title: site.title, description: site.description, path: '' }).replace(
        '<!--jsonld-->',
        `<script type="application/ld+json">${personJsonLd()}</script>`,
      )
    },
    closeBundle() {
      let shell: string
      try {
        shell = readFileSync(resolve(outDir, 'index.html'), 'utf8')
      } catch {
        return // dev server or failed build: nothing to post-process
      }
      for (const p of projects) {
        const dir = resolve(outDir, 'projects', p.slug)
        mkdirSync(dir, { recursive: true })
        const html = withSeo(shell, {
          title: `${p.seo.title} · ${site.name}`,
          description: p.seo.description,
          path: projectPath(p.slug),
        })
        writeFileSync(resolve(dir, 'index.html'), html)
      }
      for (const page of staticPages) {
        const dir = resolve(outDir, page.path.replace(/^\/|\/$/g, ''))
        mkdirSync(dir, { recursive: true })
        writeFileSync(resolve(dir, 'index.html'), withSeo(shell, { title: page.title, description: page.description, path: page.path }))
      }
      writeFileSync(
        resolve(outDir, '404.html'),
        withSeo(shell, {
          title: `Page not found · ${site.name}`,
          description: site.description,
          path: '',
          noindex: true,
        }),
      )
      const urls = ['', ...projects.map((p) => projectPath(p.slug)), ...staticPages.map((p) => p.path)].map(
        (path) => `  <url><loc>${siteUrl(path)}</loc></url>`,
      )
      writeFileSync(
        resolve(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
      )
      writeFileSync(resolve(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl('sitemap.xml')}\n`)
    },
  }
}

export default defineConfig({
  base: site.base,
  plugins: [react(), staticRoutes()],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 700,
  },
})
