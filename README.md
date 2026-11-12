# Nandu K V — Portfolio

Personal portfolio of Nandu K V, Senior UX/UI Developer (React.js, ERP interfaces).

**Live:** https://nandukv-nrr.github.io/MrNanduKV/

Built with React 19, TypeScript, Vite, Three.js, GSAP ScrollTrigger and Lenis. Styling is hand-written CSS on a small set of design tokens (no UI framework).

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173/MrNanduKV/
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

Node 22 or newer is recommended.

## Updating content

All content lives in `src/data/` — you should not need to touch components to change what the site says.

| File | What it controls |
| --- | --- |
| `src/data/profile.ts` | Name, role, intro, summary, strengths, languages, contact details, social links |
| `src/data/experience.ts` | Employment history and highlights |
| `src/data/skills.ts` | Skill groups |
| `src/data/education.ts` | Education and certifications |
| `src/data/projects.ts` | Project case studies (one page each) — `group: 'work'` or `group: 'personal'` |
| `src/data/sections.ts` | Home-page sections, their order and numbering (nav and hero read from it) |
| `src/data/site.ts` | Site URL, base path, default SEO title and description |

### Things still to fill in

- **FinTrack live link** — `projects.ts` → `liveUrl` on the `fintrack` entry. The card shows "Link coming soon" until then.
- **Personal project tech stacks** — `projects.ts` → `stack` for KLOTHIQ, KICK CLASH and FinTrack. The stack block stays hidden while it is empty.
- **KLOTHIQ features** — `projects.ts` → `features` currently lists only what is confirmed.
- **Project live links / repositories** — `projects.ts` → `liveUrl`, `repoUrl`. Buttons activate automatically.
- **Project screenshots** — put images in `public/projects/<slug>/` and list them under `screenshots` in `projects.ts`. The first one replaces the illustrated cover; the rest appear in a gallery.

### Adding a project

Add an object to the `projects` array in `src/data/projects.ts`. Set `group: 'work'` to list it under **Work**, or `group: 'personal'` to list it under **Personal projects**. The `slug` becomes the URL (`/projects/<slug>/`). The build generates the page, its metadata and the sitemap entry. To give it an illustrated cover before screenshots exist, set `visual` to `'erp'`, `'exam'`, `'store'`, `'football'` or `'finance'` (or add a new schematic in `src/components/ProjectVisual.tsx`).

## Project structure

```
src/
  data/         content + types (the only place to edit copy)
  styles/       tokens.css (themes), base.css, layout.css, home.css, project.css
  lib/          smooth scroll + GSAP setup
  hooks/        theme, page transitions, scroll reveals, SEO
  components/   nav, footer, cursor, primitives, 3D hero scene, project schematics
  sections/     home page sections
  pages/        Home, ProjectPage (case-study template), NotFound
```

## Themes

Dark and light themes are defined as CSS custom properties in `src/styles/tokens.css`. The choice is saved in `localStorage`; on a first visit the system preference is used. The 3D scene has its own palette per theme in `src/components/hero/scene.ts`.

## Deployment (GitHub Pages)

Deployment is automatic: every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes `dist/` to GitHub Pages.

One-time setup in the repository:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Push to `main` (or run the workflow manually from the **Actions** tab).

### How routing works on Pages

GitHub Pages only serves static files, so the build (see the plugin in `vite.config.ts`) writes a real `index.html` for every project route — `dist/projects/<slug>/index.html` — each with its own title, description and Open Graph tags. Deep links and refreshes therefore work without hash URLs. `404.html` is a copy of the app shell, so unknown URLs show the in-app "not found" page. `sitemap.xml` and `robots.txt` are generated in the same step.

### Renaming the repository or using a custom domain

Update `origin` and `base` in `src/data/site.ts`. The Vite base path, canonical URLs, sitemap and social metadata all derive from those two values. For a custom domain, set `base` to `'/'` and add a `public/CNAME` file.

## Resume builder

A free tool at `/resume-builder/` where any visitor can fill in a form, pick a template and download an ATS-friendly PDF. Everything runs in the browser: the draft is saved in the visitor's `localStorage` and nothing is uploaded.

| File | What it controls |
| --- | --- |
| `src/resume/templates.ts` | The templates (fonts, sizes, spacing), accent colours and page sizes |
| `src/resume/view.ts` | What gets printed: section headings, date and contact formatting |
| `src/resume/ResumePreview.tsx` | The on-screen preview |
| `src/resume/ResumePdf.tsx` | The PDF (built with `@react-pdf/renderer`, loaded only on download) |
| `src/resume/ResumeForm.tsx` | The form and its validation |
| `src/resume/inputs.tsx` | Form controls: type-ahead box, skill tags, month / year pickers, bullet editor |
| `src/resume/suggestions.ts` | Suggestion lists: skills, skill groups, job titles, degrees, languages, levels |
| `src/resume/strength.ts` | The "Resume strength" checklist and its scoring |
| `src/resume/sample.ts` | The "Fill with example" data (a made-up person) |
| `src/data/pages.ts` | The page's title, description and URL |

To add a template, add an entry to `TEMPLATES` in `templates.ts` — the preview, the PDF and the picker all read from it. Keep templates single-column with standard headings, so ATS software can read them. The PDF uses the built-in Helvetica and Times fonts, which cover Latin text; other scripts would need a font registered in `ResumePdf.tsx`.

## Contact form

GitHub Pages has no backend, so the contact form opens the visitor's email app with the message pre-filled (`mailto:`). To use a form service such as Formspree instead, replace the body of `onSubmit` in `src/sections/Contact.tsx` with a `fetch()` to your endpoint.

## Accessibility and performance notes

- Reduced-motion preference disables smooth scrolling, reveals, parallax, the custom cursor and the animated 3D loop (a single static frame is rendered instead).
- The 3D scene is one instanced draw call, lazy-loaded in its own chunk, paused when off-screen or when the tab is hidden, and replaced by a CSS fallback when WebGL is unavailable.
- Fonts are self-hosted (no third-party requests).
