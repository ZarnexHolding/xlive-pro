# XLIVE — Event Production & Technologies

> Premium React website for XLIVE, a high-end event production company operating across the Middle East.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 + Vite | Core framework & bundler |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animations & transitions |
| GSAP | (Available, used only if complex timelines needed) |
| Lenis | Smooth scrolling |
| React Icons | Icon library |
| Swiper.js | Mobile project carousel |
| clsx | Conditional class utility |

**Typography:** Syne (display) + DM Sans (body) from Google Fonts

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Project Structure

```
src/
├── assets/
│   ├── videos/         ← Place hero.mp4 here
│   ├── images/         ← Project images (optional)
│   └── logos/          ← Client logo files (optional)
│
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx      — Sticky nav with mobile overlay
│   │   └── Section.jsx     — Section, Container, SectionHeader wrappers
│   ├── animations/
│   │   └── Reveal.jsx      — Reveal, RevealGroup, RevealItem components
│   └── ui/                 — (Add reusable UI atoms here as needed)
│
├── sections/
│   ├── Hero.jsx            — Fullscreen video hero
│   ├── About.jsx           — Company manifesto + info
│   ├── Stats.jsx           — Animated counter stats
│   ├── Services.jsx        — Expandable accordion services
│   ├── Projects.jsx        — Project grid + mobile Swiper
│   ├── Sectors.jsx         — Tabbed sector breakdown
│   ├── Clients.jsx         — Client logo grid
│   └── Footer.jsx          — CTA band + full footer
│
├── hooks/
│   ├── useLenis.js         — Smooth scroll initialization
│   ├── useInView.js        — Intersection Observer hook
│   └── useCounter.js       — Animated number counter
│
├── data/
│   ├── projects.js         — Project card data
│   ├── services.js         — Services accordion data
│   ├── sectors.js          — Sectors tab data
│   └── stats.js            — Stats + clients data
│
├── styles/
│   └── globals.css         — Tailwind base + design tokens
│
├── utils/
│   └── cn.js               — clsx utility wrapper
│
├── App.jsx
└── main.jsx
```

---

## Design System

### Colors (CSS Variables + Tailwind tokens)

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg` | `#080808` | Page background |
| `--bg-secondary` | `#0E0E0E` | Alternate section background |
| `--bg-card` | `#111111` | Card backgrounds |
| `--cream` | `#EDE8DF` | Primary text |
| `--cream-muted` | `#9A9590` | Secondary/muted text |
| `--accent` | `#E84530` | Brand red accent |
| `--accent-warm` | `#C8A97A` | Warm gold accent |
| `--border` | `rgba(237,232,223,0.08)` | Subtle borders |

### Typography

- **Display / Headings:** `Syne` — Bold, weight 700–800
- **Body / UI:** `DM Sans` — Light to Medium, weight 300–500
- Base font size: 16px, line-height 1.6
- Heading line-height: 1.05–1.1
- Letter-spacing on headings: -0.02em

---

## Adding Content

### Hero Video
Place your hero video at:
```
src/assets/videos/hero.mp4
```
Optional: Add a poster image at `public/poster.jpg` for the initial frame before video loads.

### Project Images
Add project images to `src/assets/images/` and reference them in `src/data/projects.js`:
```js
{
  id: 1,
  title: 'Project Title',
  image: '/src/assets/images/project-1.jpg', // or import at top of file
  ...
}
```

### Client Logos
Add logo files to `src/assets/logos/` and update `src/data/stats.js` clients array. In `Clients.jsx`, replace the placeholder div with:
```jsx
<img
  src={`/src/assets/logos/${client.id}.svg`}
  alt={client.name}
  className="max-w-[120px] max-h-[40px] object-contain opacity-40 group-hover:opacity-80 transition-opacity duration-300 grayscale group-hover:grayscale-0"
/>
```

---

## Animation Philosophy

> **"Luxury restraint"** — Motion that enhances, never distracts.

- **Framer Motion** handles all scroll-triggered reveals, section entrances, navbar transitions, hover states
- **Lenis** provides premium smooth scrolling (duration: 1.2s, exponential easing)
- **GSAP** is available but reserved for complex timeline sequences only
- No constant movement, no floating effects, no gimmicks

### Reveal System
```jsx
// Single element reveal
<Reveal delay={0.2}>
  <YourComponent />
</Reveal>

// Staggered group reveal
<RevealGroup>
  <RevealItem>Item 1</RevealItem>
  <RevealItem>Item 2</RevealItem>
  <RevealItem>Item 3</RevealItem>
</RevealGroup>
```

---

## Responsiveness

- **Mobile-first** Tailwind breakpoints throughout
- Mobile menu: full-screen overlay with slide animation
- Projects: grid on desktop → Swiper carousel on mobile
- Typography: fluid sizing with `clamp()` on hero heading
- All sections: tested at 375px, 768px, 1024px, 1440px

---

## Performance Notes

- Video: `autoplay muted loop playsInline` + poster fallback
- Images: `loading="lazy"` on all project cards
- Animations: `viewport={{ once: true }}` prevents re-triggering
- Lenis: initialized once at App level, RAF-based (no resize jank)
- No unnecessary re-renders: all data is static imports

---

## Customization

All content lives in `src/data/` — no hardcoded strings in components (except Navbar/Footer structural text). Update data files to change any copy, add projects, modify services, etc.
