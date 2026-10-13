import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap'
import { Reveal } from '../animations/Reveal'
import { materials, processes } from '../../data/fabrication'
import Img from '../ui/Img'

/*
 * Fabrication: the photo is unveiled by a curtain (scaleX), and the four
 * process steps light up in order as a progress rule draws down beside them
 * (scrubbed). Materials sit as quiet chips under the headline.
 */
export default function Fabrication() {
  const section = useRef(null)
  const curtain = useRef(null)
  const rule = useRef(null)
  const steps = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.to(curtain.current, {
          scaleX: 0,
          duration: 1.4,
          ease: 'power4.inOut',
          scrollTrigger: { trigger: curtain.current, start: 'top 80%', once: true },
        })
        gsap.fromTo(
          rule.current,
          { scaleY: 0 },
          { scaleY: 1, ease: 'none', scrollTrigger: { trigger: steps.current, start: 'top 70%', end: 'bottom 60%', scrub: 0.4 } },
        )
        gsap.utils.toArray(steps.current.querySelectorAll('[data-step]')).forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 0.25, x: 12 },
            { autoAlpha: 1, x: 0, duration: 0.7, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 68%', toggleActions: 'play none none reverse' } },
          )
        })
      })
      return () => mm.revert()
    },
    { scope: section },
  )

  return (
    <section ref={section} id="fabrication" className="relative bg-ink-950 py-section border-t border-line-soft overflow-hidden">
      {/* blueprint grid ambience */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.15]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_85%_10%,rgba(42,26,174,0.18),transparent_60%)]" />

      <div className="shell relative grid lg:grid-cols-12 gap-x-gutter gap-y-12">
        {/* Left: headline + photo */}
        <div className="lg:col-span-6">
          <Reveal>
            <p className="index mb-5">X Live Metal Fabrication</p>
            <h2 className="font-display font-bold font-semi-wide text-display-lg text-balance max-w-[12ch]">
              We build what we brand.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-[40ch] text-body-lg font-body font-light text-fg-muted text-pretty">
              In-house metal fabrication, from cut to install.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="mt-5 flex flex-wrap gap-2">
              {materials.map((m) => (
                <span key={m} className="font-mono text-xs uppercase tracking-[0.14em] text-fg-muted border border-line rounded-full px-3.5 py-1.5">
                  {m}
                </span>
              ))}
            </div>
          </Reveal>

          <div className="relative mt-10 overflow-hidden rounded-lg aspect-[16/10]">
            <Img
              src="/images/sagp-bridge.jpg"
              alt="Fabricated steel circuit structure delivered by X Live Metal Fabrication"
              sizes="(min-width:1024px) 50vw, 100vw"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent" />
            <div className="absolute inset-0 ring-1 ring-inset ring-line rounded-lg" />
            <div ref={curtain} className="absolute inset-0 bg-ink-950 origin-right gpu" />
          </div>
        </div>

        {/* Right: process rail */}
        <div className="lg:col-span-6 lg:pl-10 relative">
          <div className="absolute left-0 top-2 bottom-2 hidden lg:block w-px bg-line-soft">
            <div ref={rule} className="w-px h-full bg-acid origin-top" />
          </div>
          <div ref={steps} className="lg:pl-10 divide-y divide-line-soft">
            {processes.map((p, i) => (
              <div key={p.id} data-step className="py-8 first:pt-0 grid grid-cols-[3rem_1fr] gap-x-4">
                <span className="font-mono text-sm text-acid pt-1">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="font-display font-bold font-semi-wide text-2xl leading-tight">{p.title}</h3>
                  <p className="mt-2 font-body text-sm text-fg-muted max-w-[40ch] text-pretty">{p.note}</p>
                  <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-fg-dim">{p.techniques.join(' · ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
