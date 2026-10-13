import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK, DESKTOP } from '../../lib/gsap'
import Img from '../ui/Img'

const STATEMENT =
  'We design, build, brand and run the live events the Kingdom is judged by. Designers, engineers, fabricators and producers under one roof, from concept to dismantle.'

/*
 * Manifesto: one statement, lit word by word as you scroll (scrubbed), with a
 * photo that drifts slower than the page beside it. On desktop the statement
 * pins for one viewport so the read is paced by the scroll; on smaller screens
 * it scrubs in place with no pin.
 */
export default function WhoWeAre() {
  const section = useRef(null)
  const pin = useRef(null)
  const photo = useRef(null)
  const words = STATEMENT.split(' ')

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      const light = (pinned) => {
        const els = section.current.querySelectorAll('.m-word')
        gsap.fromTo(
          els,
          { color: 'rgba(243,245,251,0.4)' },
          {
            color: 'rgba(243,245,251,1)',
            stagger: 0.04,
            ease: 'none',
            scrollTrigger: {
              trigger: section.current,
              start: pinned ? 'top top' : 'top 70%',
              end: pinned ? '+=110%' : 'bottom 60%',
              scrub: 0.4,
              pin: pinned ? pin.current : false,
              anticipatePin: 1,
            },
          },
        )
      }
      mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
        light(true)
        gsap.fromTo(
          photo.current,
          { yPercent: 10 },
          { yPercent: -10, ease: 'none', scrollTrigger: { trigger: section.current, start: 'top bottom', end: 'bottom top', scrub: true } },
        )
      })
      mm.add(`${MOTION_OK} and (max-width: 1023px)`, () => light(false))
      return () => mm.revert()
    },
    { scope: section },
  )

  return (
    <section ref={section} id="about" className="relative bg-ink-900">
      <div ref={pin} className="lg:h-[100svh] lg:flex lg:items-center py-section lg:py-0">
        <div className="shell grid lg:grid-cols-12 gap-x-gutter gap-y-12 items-center w-full">
          <div className="lg:col-span-7">
            <p className="index mb-8">Who we are</p>
            <h2 className="font-display font-bold font-semi-wide text-[clamp(1.75rem,3.4vw,3.6rem)] leading-[1.08] tracking-tight max-w-[26ch]">
              {words.map((w, i) => (
                <span key={i} className="m-word inline-block mr-[0.28em]">
                  {w}
                </span>
              ))}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-lg aspect-[4/5] lg:aspect-auto lg:h-[min(66vh,40rem)]">
              <div ref={photo} className="absolute -inset-y-[12%] inset-x-0 gpu">
                <Img
                  src="/images/sagp-lightbox-tunnel.jpg"
                  alt="Illuminated driver-portrait tunnel built by XLIVE at the Saudi Arabian Grand Prix"
                  sizes="(min-width:1024px) 40vw, 100vw"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink-950/80 to-transparent" />
              <div className="absolute inset-0 ring-1 ring-inset ring-line rounded-lg" />
              <div className="absolute left-5 bottom-5 index text-fg-muted">Saudi Arabian Grand Prix · Jeddah</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
