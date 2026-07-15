# Portfolio Website — Build Prompt

## Goal
Build a modern, animated personal portfolio website in **React** with **scroll-driven animations** — as the user scrolls, sections/components should react (fade in, slide, scale, parallax, etc.) rather than just appearing statically.

## Tech Stack
- **React** (Vite preferred over CRA for speed)
- **Framer Motion** — for entrance animations, scroll-triggered reveals, and page transitions
- **GSAP + ScrollTrigger** (optional, for more advanced scroll-linked effects like pinning, parallax, horizontal scroll sections)
- **Lenis** or **Locomotive Scroll** — for buttery smooth scrolling (inertia-based)
- **Tailwind CSS** — for fast, modern, responsive styling
- **React Icons / Lucide React** — for icons (GitHub, LinkedIn, Mail, etc.)

## Core Sections
1. **Hero / Landing**
   - Name, title/tagline (e.g. "Flutter Developer | Full-Stack Mobile Engineer")
   - Personal/profile photo (image will be provided — place in `src/assets/` or `public/` and use in Hero)
   - Animated intro (typewriter effect or staggered text reveal)
   - CTA buttons: "View Projects", "Contact Me"
   - Subtle background animation (gradient blobs, particles, or geometric shapes)

2. **About Me**
   - Short bio, skills summary
   - Use the same personal image (or a second shot if provided) alongside the bio
   - Animated skill bars / tech stack icons that animate in on scroll (React, Flutter, Swift, Node.js, GraphQL, ML)
   - Scroll-triggered fade/slide-in

3. **Projects**
   - Card-based grid or horizontal scroll showcase
   - Each project card: title, short description, tech used, links (live demo / GitHub)
   - Hover animations (tilt, scale, glow)
   - Scroll-triggered stagger animation for cards appearing one by one

4. **Testimonials**
   - Carousel or auto-scrolling marquee of client/colleague quotes
   - Fade/slide-in on scroll, smooth auto-transition between quotes

5. **Contact / Footer**
   - Email (clickable `mailto:`)
   - GitHub, LinkedIn icons/links
   - Simple animated contact form (optional) or "Let's connect" CTA
   - Social icons with hover micro-interactions

## Animation & Scroll Behavior
- Smooth scroll across the entire page (Lenis/Locomotive Scroll)
- Scroll-triggered reveal animations (fade + translateY) for each section using `whileInView` in Framer Motion or GSAP ScrollTrigger
- Parallax effect on background elements/images
- Sticky/pinned sections for hero or project showcase (optional, GSAP ScrollTrigger)
- Animated scroll progress indicator (top bar or side dot navigation)
- Smooth active-section highlighting in navbar as user scrolls
- Page load animation (loader or staggered hero entrance)

## Design Guidelines
- Modern, minimal, dark-mode-first design with an accent color
- Generous whitespace, large bold typography for hero section
- Rounded cards with soft shadows/glassmorphism where relevant
- Fully responsive (mobile, tablet, desktop)
- Custom cursor or hover effects for a premium feel (optional)

## Navigation
- Fixed/sticky navbar with smooth-scroll links to each section
- Mobile hamburger menu with animated open/close
- Highlight active section on scroll

## Deliverables
- Component-based structure: `Navbar`, `Hero`, `About`, `Projects`, `Testimonials`, `Contact`, `Footer`
- Reusable `AnimatedSection` wrapper component for scroll-reveal logic
- Placeholder content/data in a separate `data.js`/`data.json` file for easy editing (projects, testimonials, skills)
- Clean, commented code

## Content to Fill In
- **Personal image**: Profile/portrait photo will be provided — use it in Hero (primary) and optionally About
- **Projects**: e.g. vehicle inspection app (Flutter + native iOS camera + on-device ML), car dealership events app + website, car events platform (Flutter), scrap marketplace app (Flutter + Node.js/GraphQL)
- **Skills**: Flutter, Swift/iOS (AVFoundation), Node.js, GraphQL, On-device ML
- **Links**: GitHub, LinkedIn, Email