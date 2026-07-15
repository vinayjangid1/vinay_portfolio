# Vinay Portfolio

Modern animated personal portfolio built with React, Vite, Framer Motion, Lenis, and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

## Customize

Edit `src/data.json` for name, bio, skills, projects, testimonials, and social links.

### Profile photo

1. Add your image as `public/profile.jpg` (or `.png` / `.webp`)
2. Update `profileImage` in `src/data.json` to `/profile.jpg`

### Skills & tech logos

Skills and tech stack use Simple Icons CDN. Each entry has a `logo` slug (e.g. `"flutter"`, `"nodedotjs"`). See [simpleicons.org](https://simpleicons.org) for slugs.

### Project thumbnails & overviews

Each project has:

- `thumbnail` / `gallery` — image paths under `public/projects/`
- `overview.problem` — the problem
- `overview.howItWorks` — how the product works (step list)
- `overview.whatIDid` — your contributions
- `overview.highlights` — short bullets

Replace placeholder SVGs in `public/projects/` with real screenshots (`.jpg` / `.png` / `.webp`) and update paths in `data.json`.

Project detail pages live at `/projects/:slug` (e.g. `/projects/vehicle-inspection`).

### SEO

SEO targets **Flutter developer**, **iOS developer**, and **full stack developer**.

1. Set your live domain in `src/data.json` → `siteUrl` (also update URLs in `index.html`, `public/robots.txt`, and `public/sitemap.xml`).
2. Edit `seo.title`, `seo.description`, and `seo.keywords` in `data.json`.
3. After deploy, submit `https://your-domain.com/sitemap.xml` in [Google Search Console](https://search.google.com/search-console).

Includes: meta keywords/description, Open Graph, Twitter cards, canonical URLs, JSON-LD (Person, WebSite, ProfessionalService), `robots.txt`, and `sitemap.xml`.
