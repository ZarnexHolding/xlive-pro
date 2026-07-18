import { motion } from 'framer-motion'
import { Reveal } from '../animations/Reveal'
import {
  fabricationIntro,
  materials,
  processes,
  fabricationSectors,
} from '../../data/fabrication'

export default function Fabrication() {
  return (
    <section id="fabrication" className="relative bg-ink-950 py-section border-t border-line-soft overflow-hidden">
      {/* blueprint grid ambience */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.15]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_85%_10%,rgba(42,26,174,0.18),transparent_60%)]" />

      <div className="shell relative">
        {/* Header */}
        <div className="grid lg:grid-cols-12 gap-x-gutter gap-y-8 items-end mb-16">
          <div className="lg:col-span-7">
            <Reveal><p className="eyebrow mb-8">In-house fabrication</p></Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display font-bold text-display-lg text-balance">
                We build what<br />we brand.
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <p className="text-body-lg font-body font-light text-fg-muted text-pretty">{fabricationIntro}</p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-wider text-fg-dim">
                {materials.map((m) => (
                  <span key={m} className="flex items-center gap-2">
                    <span className="h-1 w-1 bg-acid" />{m}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* Image + process spec sheet */}
        <div className="grid lg:grid-cols-12 gap-x-gutter gap-y-10">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="lg:sticky lg:top-28 relative overflow-hidden rounded-md aspect-[4/5]">
                <img
                  src="/images/sagp-bridge.jpg"
                  alt="Fabricated steel circuit structure delivered by X Live Metal Fabrication"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-line rounded-md" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent" />
                <div className="absolute bottom-5 left-5 font-mono text-xs uppercase tracking-widest text-fg/80">
                  Concept → Cut → Weld → Finish → Install
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <div className="border-t border-line-soft">
              {processes.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.55, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-x-6 gap-y-3 py-7 border-b border-line-soft"
                >
                  <div className="sm:col-span-1 font-mono text-sm text-acid pt-1">{String(i + 1).padStart(2, '0')}</div>
                  <div className="sm:col-span-4">
                    <h3 className="font-display font-bold text-xl leading-tight">{p.title}</h3>
                    <p className="mt-2 font-body text-xs text-fg-dim max-w-[28ch]">{p.note}</p>
                  </div>
                  <ul className="sm:col-span-7 font-mono text-[13px] text-fg-muted space-y-1.5">
                    {p.techniques.map((t) => (
                      <li key={t} className="flex gap-3">
                        <span className="text-fg-dim">→</span>{t}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sectors served */}
        <div className="mt-16">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-widest text-fg-dim mb-6">Sectors we fabricate for</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 border-t border-line-soft">
            {fabricationSectors.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="py-6 lg:px-6 lg:first:pl-0 border-b border-line-soft lg:border-b-0 lg:border-r lg:last:border-r-0 border-line-soft"
              >
                <h4 className="font-display font-semibold text-base text-fg">{s.title}</h4>
                <p className="mt-2 font-body text-sm text-fg-muted text-pretty">{s.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
