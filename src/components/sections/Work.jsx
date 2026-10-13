import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowRight } from 'react-icons/hi2'
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap'
import { projects } from '../../data/projects'
import { Reveal } from '../animations/Reveal'
import ProjectCard from '../ui/ProjectCard'
import Img from '../ui/Img'

// The flagship gets the full-width cinematic treatment; the rest sit in an
// editorial grid beneath it. Featured first because hierarchy is the story:
// the biggest job in the Kingdom, then everything it proves we can do.
const FEATURED_SLUG = 'saudi-arabian-grand-prix'

// Grid for the remaining 5: two equal large cards, then three equal cards.
// Equal widths per row means equal heights per row, so every edge lines up.
// Tablet (md) runs 2-up with the last card full-width so no cell sits empty.
const LAYOUT = [
  { span: 'md:col-span-1 lg:col-span-6', size: 'lg', sizes: '(min-width:1024px) 50vw, (min-width:768px) 50vw, 100vw' },
  { span: 'md:col-span-1 lg:col-span-6', size: 'lg', sizes: '(min-width:1024px) 50vw, (min-width:768px) 50vw, 100vw' },
  { span: 'md:col-span-1 lg:col-span-4', size: 'md', sizes: '(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw' },
  { span: 'md:col-span-1 lg:col-span-4', size: 'md', sizes: '(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw' },
  { span: 'md:col-span-2 lg:col-span-4', size: 'md', sizes: '(min-width:1024px) 33vw, 100vw' },
]

function Featured({ p }) {
  const wrap = useRef(null)
  const img = useRef(null)
  const strip = p.gallery.slice(0, 3)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // Photo moves slower than the page: depth without a second layer.
        gsap.fromTo(
          img.current,
          { yPercent: -8 },
          { yPercent: 8, ease: 'none', scrollTrigger: { trigger: wrap.current, start: 'top bottom', end: 'bottom top', scrub: true } },
        )
        gsap.fromTo(
          wrap.current.querySelectorAll('[data-stat]'),
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, scrollTrigger: { trigger: wrap.current, start: 'top 70%', once: true } },
        )
        gsap.fromTo(
          wrap.current.querySelectorAll('[data-strip]'),
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, scrollTrigger: { trigger: '[data-strip-row]', start: 'top 85%', once: true } },
        )
      })
      return () => mm.revert()
    },
    { scope: wrap },
  )

  return (
    <div ref={wrap}>
      <Reveal>
        <Link to={`/work/${p.slug}`} className="group block relative overflow-hidden rounded-lg bg-ink-800">
          <div className="relative aspect-[16/10] md:aspect-[16/9] lg:aspect-[21/9] overflow-hidden">
            <div ref={img} className="absolute -inset-y-[10%] inset-x-0 gpu">
              <Img
                src={p.image}
                alt={`${p.title}: ${p.summary}`}
                sizes="(min-width:1440px) 1376px, 100vw"
                className="w-full h-full object-cover transition-transform duration-[1400ms] ease-expo group-hover:scale-[1.03]"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
            <div className="absolute inset-0 ring-1 ring-inset ring-line rounded-lg" />

            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 grid lg:grid-cols-12 gap-x-gutter gap-y-6 items-end">
              <div className="lg:col-span-7">
                <p className="index">
                  {p.category} · {p.year}
                </p>
                {/* Capped so "SAUDI ARABIAN / GRAND PRIX" stays two lines inside the 7-col caption at any width */}
                <h3 className="mt-3 font-display font-black font-wide uppercase tracking-tightest text-[clamp(2rem,4.2vw,4.5rem)] leading-[0.95] max-w-[18ch]">
                  {p.title}
                </h3>
              </div>
              {/* Stats ride the image on desktop only; on mobile they'd crowd the title. */}
              <div className="hidden lg:grid lg:col-span-5 grid-cols-3 gap-6 lg:justify-self-end">
                {p.scale.map((s) => (
                  <div key={s.l} data-stat>
                    <div className="font-display font-black font-wide tracking-tightest leading-none text-3xl">{s.v}</div>
                    <div className="mt-1.5 font-body text-xs text-fg-muted">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Link>
      </Reveal>

      {/* Mobile/tablet stats row, below the image */}
      <div className="mt-5 grid grid-cols-3 gap-4 lg:hidden">
        {p.scale.map((s) => (
          <div key={s.l}>
            <div className="font-display font-black font-wide tracking-tightest leading-none text-2xl md:text-3xl">{s.v}</div>
            <div className="mt-1.5 font-body text-xs text-fg-muted">{s.l}</div>
          </div>
        ))}
      </div>

      {/* One story line + a photo strip. The pictures do the talking. */}
      <div data-strip-row className="mt-5 grid lg:grid-cols-12 gap-x-gutter gap-y-6 items-start">
        <div className="lg:col-span-5">
          <Reveal delay={0.05}>
            <p className="text-body-lg font-body font-light text-fg-muted text-pretty max-w-[40ch]">{p.challenge}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              to={`/work/${p.slug}`}
              className="group mt-5 inline-flex items-center gap-2 font-body text-sm text-fg hover:text-acid transition-colors"
            >
              <span className="border-b border-line-strong pb-1 group-hover:border-acid transition-colors">Read the case study</span>
              <HiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
        <div className="lg:col-span-7 grid grid-cols-3 gap-3 md:gap-4">
          {strip.map((src) => (
            <div key={src} data-strip className="relative aspect-[4/3] overflow-hidden rounded-md bg-ink-800">
              <Img src={src} alt="" sizes="(min-width:1024px) 20vw, 33vw" className="w-full h-full object-cover" />
              <div className="absolute inset-0 ring-1 ring-inset ring-line rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Work() {
  const grid = useRef(null)
  const featured = projects.find((p) => p.slug === FEATURED_SLUG) || projects[0]
  const rest = projects.filter((p) => p.slug !== featured.slug)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray(grid.current.querySelectorAll('[data-cell]')).forEach((cell) => {
          gsap.fromTo(
            cell,
            { autoAlpha: 0, y: 40, scale: 0.98 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: cell, start: 'top 88%', once: true } },
          )
        })
      })
      return () => mm.revert()
    },
    { scope: grid },
  )

  return (
    <section id="work" className="relative bg-ink-900 py-section border-t border-line-soft">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <Reveal>
            <p className="index mb-5">Selected work</p>
            <h2 className="font-display font-bold font-semi-wide text-display-lg text-balance">Proof, at full scale.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link to="/work" className="group inline-flex items-center gap-2 font-body text-sm text-fg-muted hover:text-fg transition-colors">
              <span className="border-b border-line-strong pb-1 group-hover:border-acid transition-colors">All case studies</span>
              <HiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <Featured p={featured} />

        <div ref={grid} className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-5">
          {rest.map((p, i) => {
            const l = LAYOUT[i] || LAYOUT[LAYOUT.length - 1]
            return (
              <div key={p.slug} data-cell className={l.span}>
                <ProjectCard project={p} size={l.size} sizes={l.sizes} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
