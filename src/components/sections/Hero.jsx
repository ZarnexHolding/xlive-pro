import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK, DESKTOP } from '../../lib/gsap'
import { company, clients } from '../../data/company'
import { scrollToTarget } from '../../hooks/useLenis'
import { useMagnetic } from '../../hooks/useMagnetic'
import SplitWords from '../animations/SplitWords'
import LazyVideo from '../ui/LazyVideo'

const HEADLINE = ['Your vision,', 'engineered', 'to perform.']
const VIDEO = { desktop: '/videos/hero-1080.mp4', mobile: '/videos/hero-720.mp4' }

/*
 * Hero: real Jeddah night-circuit footage, centered composition.
 *
 * Load   : masked word reveal + CTAs (once, every device). The eyebrow and
 *          subline paint with the static HTML so first paint carries real copy.
 * Scroll : desktop only. The section pins for one extra viewport while the
 *          footage settles from full-bleed into a framed 16:9 "screen", the
 *          headline lifts away and a ticker of the rights-holders we have built
 *          for rides in underneath (scrubbed). Phones get no pin: a pinned
 *          viewport on touch is just a screen of dead scrolling.
 * Pointer: footage drifts against the cursor, copy drifts with it, and a
 *          soft spotlight follows the pointer over the footage. Magnetic CTAs.
 *
 * Everything is transform/opacity; the poster is the LCP and the video is
 * attached only after load + idle (see ui/LazyVideo).
 */
export default function Hero() {
  const section = useRef(null)
  const stage = useRef(null)
  const media = useRef(null)
  const drift = useRef(null)
  const spot = useRef(null)
  const copy = useRef(null)
  const ticker = useRef(null)
  const cta1 = useRef(null)
  const cta2 = useRef(null)

  useMagnetic(cta1)
  useMagnetic(cta2)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      /* ---- Entrance, all devices (targets: inner elements only) ---- */
      mm.add(MOTION_OK, () => {
        const words = copy.current.querySelectorAll('.split-word')
        gsap.timeline({ defaults: { ease: 'expo.out' } })
          .fromTo(drift.current, { scale: 1.12, autoAlpha: 0.4 }, { scale: 1, autoAlpha: 1, duration: 1.8, ease: 'power3.out' }, 0)
          .fromTo(words, { yPercent: 115 }, { yPercent: 0, duration: 1.2, stagger: 0.06 }, 0.35)
          .fromTo('[data-hero-cta]', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08 }, 1.05)
      })

      /* ---- Scroll settle + ticker + pointer depth: desktop only ---- */
      mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
        /* Scroll: settle into the screen (targets: wrappers only, so the
           entrance and scrub timelines never fight over one element) */
        const lines = copy.current.querySelectorAll('.split-line')
        gsap.timeline({
          scrollTrigger: {
            trigger: section.current,
            start: 'top top',
            end: '+=120%',
            scrub: 0.6,
            pin: stage.current,
            pinSpacing: true,
            anticipatePin: 1,
          },
        })
          .fromTo(media.current, { scale: 1, yPercent: 0, borderRadius: 0 }, { scale: 0.82, yPercent: -6, borderRadius: 24, ease: 'power2.inOut', duration: 1, immediateRender: false }, 0)
          .fromTo('[data-hero-shade]', { opacity: 1 }, { opacity: 0.25, duration: 1, immediateRender: false }, 0)
          .fromTo(lines, { yPercent: 0 }, { yPercent: -60, duration: 0.6, stagger: 0.04, ease: 'power2.in', immediateRender: false }, 0)
          .fromTo('[data-hero-fade]', { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -40, duration: 0.5, ease: 'power2.in', immediateRender: false }, 0)
          .fromTo(ticker.current, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.5)

        /* Ticker: continuous carousel slide (two copies, loop at -50%) */
        const track = ticker.current.querySelector('[data-ticker-track]')
        const loop = gsap.to(track, { xPercent: -50, duration: 32, ease: 'none', repeat: -1 })
        ticker.current.addEventListener('pointerenter', () => loop.pause())
        ticker.current.addEventListener('pointerleave', () => loop.play())

        /* Pointer depth */
        if (!window.matchMedia('(pointer: fine)').matches) return
        const bx = gsap.quickTo(drift.current, 'x', { duration: 1.2, ease: 'power3.out' })
        const by = gsap.quickTo(drift.current, 'y', { duration: 1.2, ease: 'power3.out' })
        const cx = gsap.quickTo(copy.current, 'x', { duration: 1.2, ease: 'power3.out' })
        const cy = gsap.quickTo(copy.current, 'y', { duration: 1.2, ease: 'power3.out' })
        const sx = gsap.quickTo(spot.current, 'x', { duration: 0.5, ease: 'power2.out' })
        const sy = gsap.quickTo(spot.current, 'y', { duration: 0.5, ease: 'power2.out' })
        const so = gsap.quickTo(spot.current, 'opacity', { duration: 0.6 })

        const onMove = (e) => {
          const r = stage.current.getBoundingClientRect()
          const nx = ((e.clientX - r.left) / r.width) * 2 - 1
          const ny = ((e.clientY - r.top) / r.height) * 2 - 1
          bx(nx * -18)
          by(ny * -12)
          cx(nx * 8)
          cy(ny * 6)
          sx(e.clientX - r.left)
          sy(e.clientY - r.top)
          so(1)
        }
        const onLeave = () => {
          bx(0)
          by(0)
          cx(0)
          cy(0)
          so(0)
        }
        stage.current.addEventListener('pointermove', onMove)
        stage.current.addEventListener('pointerleave', onLeave)
        return () => {
          stage.current?.removeEventListener('pointermove', onMove)
          stage.current?.removeEventListener('pointerleave', onLeave)
        }
      })

      return () => mm.revert()
    },
    { scope: section },
  )

  const go = (id) => (e) => {
    e.preventDefault()
    scrollToTarget(id)
  }

  const row = [...clients, ...clients]

  return (
    <section ref={section} id="top" className="relative bg-ink-950">
      <div ref={stage} className="relative h-[100svh] min-h-[600px] overflow-hidden">
        {/* Footage: full-bleed, settles into a framed screen on scroll (desktop) */}
        <div ref={media} className="absolute inset-0 gpu overflow-hidden bg-ink-950 [transform-origin:50%_42%]">
          <div ref={drift} className="absolute -inset-[4%] gpu">
            <LazyVideo
              poster="/images/hero-poster.webp"
              posterAlt="Race cars at speed on a floodlit night street circuit"
              sources={VIDEO}
              priority
              when="load"
            />
          </div>

          {/* Cinematic grade: footage leads, overlays stay quiet */}
          <div data-hero-shade className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-ink-950/30" />
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_15%,rgba(42,26,174,0.30),transparent_60%)]" />
          <div className="absolute inset-0 grain opacity-[0.07] mix-blend-overlay pointer-events-none" />

          {/* Pointer spotlight */}
          <div
            ref={spot}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 h-[38rem] w-[38rem] rounded-full opacity-0"
            style={{
              background: 'radial-gradient(closest-side, rgba(243,245,251,0.10), rgba(81,56,255,0.06) 45%, transparent 70%)',
              marginLeft: '-19rem',
              marginTop: '-19rem',
            }}
          />
        </div>

        {/* Copy: centered, anchored to the bottom of the viewport */}
        <div className="relative z-10 h-full flex flex-col justify-end pt-24 md:pt-28">
          <div ref={copy} className="shell pb-[clamp(3.5rem,8vh,6rem)] text-center">
            <div data-hero-fade className="flex flex-col items-center">
              <p data-hero-eyebrow className="mb-6 eyebrow">
                {company.descriptor}
                <span className="hidden sm:inline text-fg-dim">/ Riyadh, Saudi Arabia</span>
              </p>

              <h1 className="font-display font-black font-wide uppercase tracking-tightest text-display-2xl max-w-[14ch]">
                <SplitWords lines={HEADLINE} />
              </h1>

              <p data-hero-sub className="mt-8 max-w-[46ch] text-body-lg font-body font-light text-fg-muted text-pretty">
                From Formula&nbsp;1 to the Dakar Rally, we design, build, brand and run the region&rsquo;s
                most demanding live events.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <a ref={cta1} data-hero-cta href="#contact" onClick={go('#contact')} className="btn-primary px-8 py-4 text-[15px]">
                  Start a project
                  <span aria-hidden="true">→</span>
                </a>
                <a ref={cta2} data-hero-cta href="#work" onClick={go('#work')} className="btn-outline px-8 py-4 text-[15px] backdrop-blur-sm">
                  See the work
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Rights-holder ticker rides in as the footage settles (desktop only) */}
        <div ref={ticker} className="absolute inset-x-0 bottom-[clamp(1.5rem,4vh,3rem)] z-10 opacity-0 hidden lg:block">
          <div className="mask-x overflow-hidden">
            <div data-ticker-track className="flex w-max items-center will-change-transform">
              {row.map((c, i) => (
                <span key={c.id + i} className="flex items-center font-display font-semibold font-semi-wide uppercase tracking-wide text-sm text-fg-muted whitespace-nowrap">
                  {c.name}
                  <span aria-hidden="true" className="mx-7 h-1 w-1 rounded-full bg-acid/70" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
