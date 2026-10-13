import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap'
import { metrics } from '../../data/company'

/*
 * Proof band: three source-backed numbers, counted up once on entry.
 * The rights-holder ticker lives in the hero exit now, so this band stays a
 * single quiet row that fits under the settled hero screen.
 */
export default function ProofBand() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const nums = ref.current.querySelectorAll('[data-count]')
        nums.forEach((el) => {
          const target = Number(el.dataset.count)
          const obj = { v: 0 }
          gsap.to(obj, {
            v: target,
            duration: 1.6,
            ease: 'power3.out',
            snap: { v: 1 },
            onUpdate: () => (el.textContent = String(Math.round(obj.v))),
            scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
          })
        })
        gsap.fromTo(
          ref.current.querySelectorAll('[data-metric]'),
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1, scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true } },
        )
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="relative bg-ink-950 border-y border-line-soft">
      <div className="shell py-[clamp(2.5rem,5vw,4rem)]">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-10 sm:divide-x divide-line-soft">
          {metrics.slice(0, 3).map((m, i) => (
            <div key={m.label} data-metric className={`flex items-start gap-5 ${i ? 'sm:pl-8' : ''}`}>
              <span className="index pt-2">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <div className="font-display font-black font-wide tracking-tightest leading-none text-[clamp(2.75rem,5vw,4.5rem)] tabular-nums">
                  <span data-count={m.value}>0</span>
                  <span className="text-acid">{m.suffix}</span>
                </div>
                <div className="mt-3 font-body text-sm text-fg">{m.label}</div>
                {m.sub && <div className="mt-1 index">{m.sub}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
