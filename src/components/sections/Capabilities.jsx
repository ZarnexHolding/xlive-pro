import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK, DESKTOP } from '../../lib/gsap'
import { capabilities } from '../../data/capabilities'
import { Reveal } from '../animations/Reveal'
import Img from '../ui/Img'

// One real photo per discipline (all from XLIVE's own project decks).
const PHOTO = {
  technical: '/images/f1-led-detail.jpg',
  build: '/images/sagp-bridge.jpg',
  live: '/images/sagp-grandstand-night.jpg',
  operations: '/images/dakar-bivouac.jpg',
  digital: '/images/katusha-render.jpg',
  media: '/images/hero-jeddah-night.jpg',
}

/*
 * Six disciplines as a horizontal filmstrip. On desktop the section pins and
 * the strip scrolls sideways with the wheel (scrubbed); on tablet and phone it
 * is a normal vertical stack of the same cards. Nothing but transforms.
 */
export default function Capabilities() {
  const section = useRef(null)
  const track = useRef(null)
  const progress = useRef(null)
  const counter = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
        const t = track.current
        const distance = () => t.scrollWidth - window.innerWidth
        gsap.to(t, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            scrub: 0.5,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              gsap.set(progress.current, { scaleX: self.progress })
              const n = Math.min(capabilities.length, Math.floor(self.progress * capabilities.length) + 1)
              counter.current.textContent = `${String(n).padStart(2, '0')} / ${String(capabilities.length).padStart(2, '0')}`
            },
          },
        })
      })
      mm.add(`${MOTION_OK} and (max-width: 1023px)`, () => {
        gsap.fromTo(
          section.current.querySelectorAll('[data-cap]'),
          { autoAlpha: 0, y: 32 },
          { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, scrollTrigger: { trigger: track.current, start: 'top 85%', once: true } },
        )
      })
      return () => mm.revert()
    },
    { scope: section },
  )

  return (
    <section ref={section} id="capabilities" className="relative bg-ink-950 border-t border-line-soft lg:h-[100svh] lg:overflow-hidden">
      <div className="shell pt-section-sm lg:pt-[calc(var(--nav-h)+2.5rem)]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="index mb-5">Capabilities</p>
            <h2 className="font-display font-bold font-semi-wide text-display-lg text-balance max-w-[14ch]">
              Six disciplines. One roof.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="hidden lg:block">
            <div className="w-56">
              <div className="index mb-3 flex justify-between">
                <span>Scroll</span>
                <span ref={counter}>01 / 06</span>
              </div>
              <div className="h-px bg-line">
                <div ref={progress} className="h-px w-full origin-left scale-x-0 bg-acid" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Track: horizontal on desktop, vertical stack below */}
      <div className="mt-12 lg:mt-14 pb-section-sm lg:pb-0 lg:absolute lg:inset-x-0 lg:bottom-[clamp(2rem,6vh,4rem)]">
        <div
          ref={track}
          className="shell grid gap-4 md:grid-cols-2 lg:flex lg:w-max lg:max-w-none lg:gap-5 lg:pr-gutter gpu"
        >
          {capabilities.map((cap, i) => (
            <article
              key={cap.id}
              data-cap
              className="group relative overflow-hidden rounded-lg bg-ink-800 border border-line-soft lg:w-[min(38vw,34rem)] lg:h-[min(58vh,36rem)] aspect-[4/5] md:aspect-[4/3] lg:aspect-auto"
            >
              <Img
                src={PHOTO[cap.id]}
                alt=""
                sizes="(min-width:1024px) 38vw, (min-width:768px) 50vw, 100vw"
                className="absolute inset-0 h-full w-full object-cover opacity-75 transition-[transform,opacity] duration-[1200ms] ease-expo group-hover:scale-[1.04] group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-ink-950/10" />
              <div className="absolute inset-0 ring-1 ring-inset ring-line rounded-lg" />
              <div className="relative h-full p-6 md:p-8 flex flex-col justify-between">
                <span className="font-display font-black font-wide text-lg text-fg-dim tabular-nums transition-colors duration-300 group-hover:text-acid">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-display font-bold font-semi-wide text-2xl md:text-[1.75rem] leading-tight max-w-[14ch]">{cap.title}</h3>
                  <p className="mt-3 font-body text-sm text-fg-muted max-w-[34ch] text-pretty">{cap.summary}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
