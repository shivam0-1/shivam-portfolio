# Shivam Kumar — Developer Portfolio

A responsive React portfolio built with Vite, Tailwind CSS, GSAP (ScrollTrigger), Lenis, and Framer Motion. Deep ink-navy surfaces, an ember accent, and heavy monospace display type (JetBrains Mono) carry the introduction, a scroll-driven request walkthrough, skills, project case studies, experience, and contact form.

Motion is split by job: Lenis provides inertial wheel scrolling on GSAP's ticker, GSAP ScrollTrigger handles scrubbed and pinned scroll effects, and Framer Motion handles state transitions and entrance reveals.

## Run locally

```sh
npm ci
npm run dev
```

Use a Node.js version supported by the installed Vite release (Node 22.12+). To build and inspect the production output:

```sh
npm run build
npm run preview
```

The production site is emitted to `dist/` and can be served by a static host. `npm run lint` runs the repository's ESLint checks.

## Update content

- `src/data/portfolio.js`: identity, contact links, résumé URL, skills, projects, work, education, and certification.
- `public/projects/`: optimized project screenshots.
- `public/Shivam_Kumar_Resume.pdf`: downloadable résumé.
- `src/index.css`: shared theme, typography, responsive hero, and animation tokens.
- `index.html`: page title, search metadata, social metadata, and font loading. Add the final canonical URL and social sharing image when the deployment domain is known.

## Contact delivery

Copy `.env.example` to `.env` and configure the existing EmailJS service, template, and public key. The template receives `from_name`, `from_email`, `message`, and `topic`. Vite exposes `VITE_` variables in the client bundle; use only the EmailJS public key here, never a private credential. Configure the permitted production origins in your EmailJS account.

Without those settings, the form opens a populated draft in the visitor's email app and explains that they must send it there. With EmailJS configured, it validates input, prevents duplicate submissions, retains the message after an error, and confirms success only after the service responds. Direct email, phone, LinkedIn, and GitHub links are always available.

## Interaction and accessibility

- The first-visit boot screen prepares critical content, fonts, and the optional workspace module concurrently. Its progress reflects completed resource groups; there is no minimum display time. A three-second deadline and an explicit Skip/Escape action prevent a slow resource from blocking the page.
- Subsequent visits in the same session, section deep links, and reduced-motion users bypass the intro. An error boundary preserves the introduction if the optional workspace cannot load.
- The hero is a raw WebGL point cloud (no 3D engine) that unrolls from a sphere into a disc as the hero scrolls away and parts around the pointer. It pauses offscreen and in hidden tabs, caps the pixel ratio, renders a single still frame for reduced-motion users, and falls back to the CSS background when WebGL is unavailable.
- The Process section's request walkthrough is a local interactive demonstration. On wide screens it pins, and scrolling steps it through request → route → query → respond; elsewhere it plays on its own. Send runs it on demand. Project previews open the real websites, and architecture views explain their components.
- In-page links glide to their section through Lenis and move keyboard focus there. Project case studies open out of a clipped frame as they scroll in.
- `Ctrl/Cmd + K` or `/` opens the command palette; `T` switches themes. Shortcuts ignore editable fields. Navigation and dialogs support keyboard access and focus restoration.
- Decorative motion stops offscreen or in hidden tabs where applicable. Reduced-motion preferences disable smooth scrolling, pinning, scrubbed effects, drifting, marquee motion, reveal transforms, and animated typing. The marquee also has a pause button.
- Project images load lazily with reserved dimensions.

## Deployment checks

Run a production build, then verify desktop and mobile layouts, section links, the résumé download, theme switching, command palette, project views, and contact validation. Exercise delivery with a controlled EmailJS test only when you intend to send a message. Local browser-verification artifacts belong in the ignored `.qa/` directory.
