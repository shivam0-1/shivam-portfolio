# Shivam Kumar | Portfolio

Personal portfolio of Shivam Kumar, full-stack developer. Built with **Next.js 16** (App Router), **TypeScript** and **Tailwind CSS 4**, with **three.js** (via React Three Fiber) for the 3D hero, **Motion** for animation and **Lenis** for smooth scrolling.

The design is dark and editorial: a warm near-black page, warm-white type, large Cormorant Garamond headings, Hanken Grotesk body text, and one gold accent used sparingly. The writing is plain and factual. The page opens on three floating glass layers (Frontend, Backend, Database). As you scroll, they spread apart and gain their labels, then hand over to the sections: **Skills, Experience, Work, About, Contact**. A toggle switches to the light "paper" theme.

## Requirements

- Node.js 20.9 or newer
- npm

## Run locally

```sh
npm install
npm run dev        # http://localhost:3000
```

Production build:

```sh
npm run build
npm run start      # serves the production build on http://localhost:3000
```

Lint:

```sh
npm run lint
```

## Update the content

All text, links and data live in **[content/portfolio.ts](content/portfolio.ts)**. You never need to touch a component to change what the site says.

| To change… | Edit |
|---|---|
| Name, role, headline, email, phone, social links | `profile` |
| "Open to opportunities" status | `profile.available` (`true` / `false`) |
| "At a glance" facts (Recent role, Education, Stack, Focus) | `facts` |
| Section names, intro sentences and order (also drives the navigation) | `sections` |
| Projects, their screenshots and "How it's built" diagrams | `projects` |
| About paragraphs | `about` |
| Jobs and education | `experience` |
| Certifications | `credentials` |
| Skills and where each was used | `skillGroups` and `sources` |
| Page title, description and keywords for search | `site` |

Text fields can include a link written as `[text](#work)` or `[text](https://…)`.

The shapes of all these fields are defined in [content/types.ts](content/types.ts). If you make a mistake, `npm run build` (or your editor) will point at it.

### Add a project

1. Save a screenshot (WebP, around 1350 × 630) in `public/projects/`.
2. Add an entry to `projects` in `content/portfolio.ts` with its `image` path, width and height.
3. Describe its `architecture` as stages, left to right, the way a request travels (e.g. Users → Interface → Server → Data). The "How it's built" diagram draws itself from that list.

### Skills

Each group in `skillGroups` is one row. `usedIn` lists ids from `sources` (a job, project or course). Skills used somewhere are shown in full ink, and the row lists the places. Skills with an empty list are shown in grey. The first three groups also label the glass layers in the hero.

### Résumé

Replace `public/Shivam_Kumar.pdf`. To use a different file name, update `profile.resume` as well.

## Project structure

```
app/
  layout.tsx            fonts, SEO metadata, theme script, smooth-scroll + motion providers
  page.tsx              page composition (section order) + structured data (JSON-LD)
  globals.css           design tokens (colours for both themes), type, buttons, CSS animations
  opengraph-image.tsx   social preview image, generated at build time
  icon.svg, apple-icon.tsx, robots.ts, sitemap.ts, not-found.tsx
components/
  layout/               header (+ mobile menu), theme toggle, footer
  sections/             Hero, Skills, Experience, Work, About, Contact
  project/              project feature, screenshot, and "How it's built" diagram
  three/                the 3D hero: WebGL glass stack, its loader, and the CSS 3D version
  motion/               smooth-scroll + motion providers, fade-in reveal
  ui/                   small shared pieces (Section, Disclosure, Icon, RichText…)
content/                all site content + its types
lib/                    site URL, smooth-scroll handle, rich-text parser, reduced-motion hook
public/                 résumé PDF and project screenshots
```

Colours are defined once as CSS variables at the top of `app/globals.css` (one block per theme). Components only use the semantic names (`bg`, `text`, `muted`, `accent`…), so re-theming is a matter of changing those values.

## How the 3D works

- **Desktop:** a WebGL scene (`components/three/GlassStack.tsx`) with real refractive glass. three.js is about 250 kB gzipped, so it is a separate chunk that loads when the visitor first moves the mouse, scrolls or types, or after 3 seconds. Until then the CSS version of the stack stands in, then crossfades to the WebGL glass. The page is fully usable first, and the scene stops rendering when the hero is off screen.
- **Phones:** the same stack built with CSS 3D transforms (`components/three/CssStack.tsx`). Phones never download three.js, and they keep native touch scrolling (the smooth-scroll code loads only for mouse and trackpad users).
- **Safety net:** if WebGL is missing, uses software rendering, or runs too slowly in the first seconds, the scene steps down to a lighter glass material and then to the CSS version. Nobody gets a frozen page or an empty hero.
- **Reduced motion:** the hero becomes a single still screen, smooth scrolling and parallax are off, and reveals happen without movement.

three.js is pinned to the 0.182 line: newer releases log a deprecation warning triggered by React Three Fiber.

## Deploy to Vercel

1. Push this repository to GitHub.
2. On [vercel.com](https://vercel.com), choose **Add New → Project** and import the repository. Vercel detects Next.js; keep the default build settings.
3. Click **Deploy**.

Canonical URLs, the sitemap and social previews use your Vercel production URL automatically. If you add a custom domain, set it under **Settings → Environment Variables**:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Then redeploy. (See [.env.example](.env.example).)

After deploying, check the live site with [PageSpeed Insights](https://pagespeed.web.dev/) and share the link once to confirm the preview card (title, description and image) looks right.

## Notes

- **Theme:** dark is the default because the site is designed dark-first. A visitor's choice from the toggle is remembered, and an inline script applies it before the first paint, so there's no flash.
- **Accessibility:** semantic landmarks and headings, a skip link, full keyboard navigation (the mobile menu traps the page behind it and closes with Escape), visible focus rings, and AA colour contrast in both themes. The decorative 3D labels are hidden from screen readers because the Skills section lists everything in full.
- **Motion** is kept quiet: blocks fade in once as they scroll into view, the opening text fades as the glass layers spread, and smooth scrolling applies to mouse wheels and trackpads only. Everything turns off for visitors who set "reduce motion".
- `AGENTS.md` is written by `next dev` (Next.js's notes for AI coding tools); keeping it committed stops it reappearing as a change.
