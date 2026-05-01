# 3D Artist & Game Developer Portfolio

A modern, dark-themed personal portfolio website for a 3D Artist & Game Developer, built with TanStack Start and managed through a Decap CMS admin panel.

## Features

- **7 pages**: Home, About, Projects, Works/Gallery, Skills, Experience, Contact
- **Decap CMS** admin panel at `/admin` — edit all content from a browser UI
- **Netlify Identity** authentication for the CMS
- **Netlify Forms** contact form with spam protection
- **Dark theme** — `#0a0a0a` background with cyan/purple gradient accents
- Glassmorphism cards, smooth fade-in scroll animations, hover effects
- Dark/light mode toggle (persisted in localStorage)
- Mobile-responsive with hamburger menu
- Filterable gallery with lightbox/modal
- Animated skill bars
- Vertical timeline for experience
- Back-to-top button

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start (React 19 + TanStack Router) |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 + custom CSS |
| Content | Content Collections (type-safe Markdown) |
| CMS | Decap CMS (formerly Netlify CMS) |
| Auth | Netlify Identity (for CMS access) |
| Forms | Netlify Forms |
| Deployment | Netlify |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Install & Run

```bash
npm install
npm run dev       # Vite dev server on :3000
```

For Netlify features (Identity, Forms) use the Netlify CLI:

```bash
npm install -g netlify-cli
netlify dev       # Dev server proxied on :8888
```

### Production Build

```bash
npm run build
```

Output is in `dist/client/`.

## Content Management

### Via CMS (recommended)

After deploying to Netlify:

1. Go to **Project configuration → Identity** in the Netlify dashboard and enable **Git Gateway**
2. Invite yourself as a user (or enable open registration temporarily)
3. Visit `https://your-site.netlify.app/admin`
4. Log in with Netlify Identity
5. Edit all content directly from the browser

### Via Markdown files

All content lives in the `content/` directory as Markdown files with YAML frontmatter:

| Directory | Purpose |
|-----------|---------|
| `content/about/` | About page bio and personal info |
| `content/projects/` | Project entries |
| `content/works/` | Gallery items (images + videos) |
| `content/skills/` | Skill categories and percentages |
| `content/experience/` | Timeline entries |
| `content/settings/` | Site-wide settings (name, socials, contact) |

## Environment Variables

No required environment variables for the base site. For the AI resume assistant (optional):

```env
ANTHROPIC_API_KEY=...
```

## Deployment

The project deploys automatically on Netlify. Push to `main` triggers a build.

After deployment, enable Git Gateway in the Netlify dashboard to allow the CMS to commit content changes back to the repository.
