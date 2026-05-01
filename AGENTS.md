# AGENTS.md — Portfolio Architecture Guide

This document is for AI agents and developers working on this codebase in future sessions.

## Project Overview

A personal portfolio for a 3D Artist & Game Developer. Built with TanStack Start (React 19 + TanStack Router) on Netlify, with content managed through Decap CMS and Netlify Identity.

## Directory Structure

```
content/                  # Markdown content (Decap CMS edits these)
  about/main.md           # About page bio, personal info, profile image
  experience/*.md         # Timeline entries (date, title, company, description)
  projects/*.md           # Portfolio projects (cover image, tags, category, YouTube)
  settings/site.md        # Global: site name, social links, email, phone
  skills/*.md             # Skill categories with percentage bars
  works/*.md              # Gallery items (image or YouTube, category filter)

public/
  admin/
    index.html            # Decap CMS entrypoint (loads netlify-identity-widget + decap-cms.js)
    config.yml            # CMS collections config — maps to content/ directories
  __forms.html            # Static form registration for Netlify Forms (build-time detection)
  images/uploads/         # Media uploaded via the CMS

src/
  components/
    Nav.tsx               # Fixed header: logo, nav links, theme toggle, mobile hamburger
    BackToTop.tsx         # Sticky back-to-top button (visible after 300px scroll)
  routes/
    __root.tsx            # Root layout: Nav + BackToTop + Netlify Identity Widget script
    index.tsx             # Home: hero, featured projects grid, quick skills
    about.tsx             # About: profile photo, bio, personal info, stats, socials
    projects.tsx          # Projects: filterable grid with detail modal
    works.tsx             # Gallery: filterable grid with lightbox (images + YouTube)
    skills.tsx            # Skills: animated progress bars per category
    experience.tsx        # Experience: vertical timeline
    contact.tsx           # Contact: Netlify Forms + social links + map embed
    resume.tsx            # Redirect stub (points to Experience + Skills)
    blog/$slug.tsx        # Blog post detail (from original template)
  styles.css              # Global dark theme: CSS custom properties, Tailwind, animations
  router.tsx              # TanStack Router setup
```

## Content Collections

Defined in `content-collections.ts`. Each collection maps a directory of Markdown files to a typed schema via Zod. Import in server functions with:

```ts
import { allProjects, allWorks, allSkillCategories, allAbout, allSiteSettings, allExperience } from 'content-collections'
```

Collections are compiled at build time. They are static arrays, not a database.

## Data Loading Pattern

Every route uses a `createServerFn` loader pattern:

```ts
const getData = createServerFn({ method: 'GET' }).handler(async () => {
  return { items: allProjects }
})

export const Route = createFileRoute('/projects')({
  loader: () => getData(),
  component: ProjectsPage,
})
```

Access loaded data inside the component with `Route.useLoaderData()`.

## Styling Conventions

- **Dark theme by default.** CSS custom properties in `styles.css` (`:root` = dark).
- **Light mode:** toggled by adding `.light` class to `<html>`. Persisted in `localStorage` key `theme`.
- Utility classes: `glass-card`, `gradient-text`, `btn-primary`, `btn-outline`, `tag`, `tag-purple`, `fade-in`, `nav-link`, `social-btn`, `form-input`
- Accent colors: `--accent-cyan: #00d4ff`, `--accent-purple: #a855f7`
- Fade-in animations use `IntersectionObserver` — add `fade-in` class to an element and it becomes visible when scrolled into view.

## CMS (Decap CMS)

- Admin panel: `/admin` (static files in `public/admin/`)
- Backend: `git-gateway` — commits directly to the repo on behalf of the logged-in user
- Authentication: Netlify Identity (must enable Git Gateway in Netlify dashboard after deploy)
- Media uploads go to `public/images/uploads/`, served as `/images/uploads/...`

## Netlify Features

- **Netlify Identity** — enabled via `node /opt/buildhome/.claude/skills/netlify-identity/scripts/enable.cjs`
- **Netlify Forms** — enabled via `node /opt/buildhome/.claude/skills/netlify-forms/scripts/enable.cjs`; contact form POSTs to `/__forms.html`
- **Edge functions** — `netlify.toml` excludes `/.netlify/*` paths from the SSR catch-all so Identity endpoints are not intercepted

## Non-Obvious Decisions

1. **`__forms.html` instead of `/`** — TanStack Start's SSR catch-all intercepts requests to `/`, so the contact form POSTs to the static file path directly (Netlify Forms requirement for React/SSR apps).
2. **Netlify Identity Widget loaded globally** — The `<script src="https://identity.netlify.com/...">` in `__root.tsx` head is required so token callbacks (`#invite_token`, `#recovery_token`) are handled on the main site, not just `/admin`.
3. **Content Collections are static** — They are compiled at build time. To add real-time content editing without a redeploy, future sessions should explore TanStack Start API routes + Netlify Blobs or Netlify Database.
4. **Dark mode as default** — The site ships dark. The `.light` class is added to `<html>` when the user chooses light mode; without it, the dark CSS variables (defined in `:root`) apply.
