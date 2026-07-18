import { motion } from 'framer-motion'
import { HiArrowRight } from 'react-icons/hi2'
import { Reveal } from '../animations/Reveal'
import Button from '../ui/Button'

export default function PartnersTeaser() {
  return (
    <section id="partners" className="bg-ink-950 py-section border-t border-line-soft">
      <div className="shell grid lg:grid-cols-12 gap-x-gutter gap-y-12 items-center">
        <div className="lg:col-span-6">
          <Reveal><p className="eyebrow mb-8">For agencies &amp; partnerships</p></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display font-bold text-display-lg text-balance">
              Delivering into Saudi Arabia?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-[46ch] text-body-lg font-body font-light text-fg-muted text-pretty">
              XLIVE is the on-ground execution partner for Dubai and international agencies —
              local production, permits, vendor network and delivery at international standards.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9">
              <Button to="/partners" size="lg">
                For agencies &amp; partnerships <HiArrowRight />
              </Button>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-6">
          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-md aspect-[16/11]">
              <img
                src="/images/ferrari-fest-jeddah.jpg"
                alt="XLIVE fan-zone production at a brand festival in Jeddah"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-line rounded-md" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 to-transparent" />
              <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                {['Riyadh', 'Jeddah', 'NEOM'].map((c) => (
                  <span key={c} className="font-body text-[11px] uppercase tracking-widest text-fg/80 bg-ink-950/50 backdrop-blur-sm px-3 py-1.5 rounded-xs">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
