import { useInView } from '../../hooks/useInView'
import { useCounter } from '../../hooks/useCounter'
import { metrics, clients } from '../../data/company'

function Metric({ value, suffix, label, sub, start }) {
  const count = useCounter(value, 1600, start)
  return (
    <div className="px-2">
      <div className="font-display font-black tracking-tightest leading-none text-[clamp(2.75rem,5vw,4.5rem)]">
        {count}
        <span className="text-acid">{suffix}</span>
      </div>
      <div className="mt-3 font-body text-sm text-fg">{label}</div>
      {sub && <div className="mt-1 font-body text-xs text-fg-dim uppercase tracking-wider">{sub}</div>}
    </div>
  )
}

export default function ProofBand() {
  const [ref, inView] = useInView({ threshold: 0.3 })
  const row = [...clients, ...clients]

  return (
    <section className="relative bg-ink-900 border-y border-line-soft">
      {/* Metrics */}
      <div ref={ref} className="shell py-[clamp(3rem,6vw,5rem)]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 divide-line lg:divide-x">
          {metrics.map((m) => (
            <div key={m.label} className="lg:pl-8 first:pl-0">
              <Metric {...m} start={inView} />
            </div>
          ))}
        </div>
      </div>

      {/* Client marquee */}
      <div className="relative border-t border-line-soft py-8 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-ink-900 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-ink-900 to-transparent" />
        <div className="flex w-max animate-marquee items-center gap-14 will-change-transform">
          {row.map((c, i) => (
            <span
              key={c.id + i}
              className="font-display font-semibold text-lg text-fg-dim hover:text-fg transition-colors whitespace-nowrap uppercase tracking-wide"
            >
              {c.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
