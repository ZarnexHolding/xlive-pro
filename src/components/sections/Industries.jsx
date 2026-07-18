import { motion } from 'framer-motion'
import { Reveal } from '../animations/Reveal'
import { industries } from '../../data/industries'

export default function Industries() {
  return (
    <section id="industries" className="relative bg-ink-900 py-section border-t border-line-soft">
      <div className="shell grid lg:grid-cols-12 gap-x-gutter gap-y-12">
        {/* Sticky statement */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Reveal><p className="eyebrow mb-8">Who we serve</p></Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display font-bold text-display-lg text-balance">
                Built for the Kingdom&rsquo;s most demanding clients.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-[38ch] text-body-lg font-body font-light text-fg-muted text-pretty">
                From federations and ministries to global brands and agencies - the same
                standard, whoever we&rsquo;re building for.
              </p>
            </Reveal>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-8 border-t border-line-soft">
          {industries.map((ind, i) => (
            <motion.div
              key={ind.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="group grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-4 py-8 border-b border-line-soft"
            >
              <div className="md:col-span-1 font-mono text-sm text-fg-dim pt-1 group-hover:text-acid transition-colors">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="md:col-span-11">
                <h3 className="font-display font-bold text-2xl leading-tight max-w-[22ch]">{ind.title}</h3>
                <p className="mt-3 font-body text-body-lg font-light text-fg-muted max-w-[54ch] text-pretty">{ind.line}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {ind.clients.map((c) => (
                    <span key={c} className="font-body text-xs text-fg-muted border border-line rounded-xs px-3 py-1.5 group-hover:border-line-strong transition-colors">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
