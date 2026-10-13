import { useRef } from 'react'
import { HiArrowRight } from 'react-icons/hi2'
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap'
import { Reveal } from '../animations/Reveal'
import Button from '../ui/Button'
import LazyVideo from '../ui/LazyVideo'

const VIDEO = { desktop: '/videos/pitlane-720.mp4', mobile: '/videos/pitlane-720.mp4' }

/*
 * Partners teaser: the second cinematic moment. Real Jeddah pit-lane footage
 * inside a framed screen (same motif as the settled hero), copy over it. The
 * video attaches only when the block is near the viewport and pauses when it
 * leaves; the frame scales up slightly as it enters.
 */
export default function PartnersTeaser() {
  const frame = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          frame.current,
          { scale: 0.94, autoAlpha: 0.6 },
          { scale: 1, autoAlpha: 1, ease: 'none', scrollTrigger: { trigger: frame.current, start: 'top 90%', end: 'top 35%', scrub: 0.5 } },
        )
      })
      return () => mm.revert()
    },
    { scope: frame },
  )

  return (
    <section id="partners" className="bg-ink-950 py-section border-t border-line-soft">
      <div className="shell">
        <div ref={frame} className="relative overflow-hidden rounded-xl min-h-[70svh] lg:min-h-[76vh] flex items-end gpu">
          <LazyVideo
            poster="/images/pitlane-poster.webp"
            posterAlt="Night-time pit building and crowds along a street circuit"
            sources={VIDEO}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-ink-950/20" />
          <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_10%_20%,rgba(42,26,174,0.35),transparent_60%)]" />
          <div className="absolute inset-0 ring-1 ring-inset ring-line rounded-xl" />

          <div className="relative w-full p-6 md:p-10 lg:p-14 grid lg:grid-cols-12 gap-x-gutter gap-y-8 items-end">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="index text-fg-muted mb-5">For agencies &amp; partnerships</p>
                <h2 className="font-display font-black font-wide uppercase tracking-tightest text-[clamp(2rem,4.6vw,5rem)] leading-[0.95] text-balance">
                  Delivering into Saudi Arabia?
                </h2>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="mt-6 max-w-[42ch] text-body-lg font-body font-light text-fg-muted text-pretty">
                  Your on-ground execution partner: local production, permits, vendor network and delivery at
                  international standards.
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-5 lg:justify-self-end">
              <Reveal delay={0.14}>
                <Button to="/partners" size="lg">
                  For agencies &amp; partnerships <HiArrowRight />
                </Button>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
