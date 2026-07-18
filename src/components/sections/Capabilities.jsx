import { motion } from 'framer-motion'
import { capabilities } from '../../data/capabilities'
import { Reveal } from '../animations/Reveal'

export default function Capabilities() {
  return (
    <section id="capabilities" className="relative bg-ink-950 py-section border-t border-line-soft">
      <div className="shell">
        <div className="grid lg:grid-cols-12 gap-x-gutter gap-y-8 items-end mb-16">
          <div className="lg:col-span-8">
            <Reveal><p className="eyebrow mb-8">Our expertise</p></Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display font-bold text-display-lg text-balance">
                Six disciplines.<br />One roof.
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-4">
            <Reveal delay={0.1}>
              <p className="text-body-lg font-body font-light text-fg-muted text-pretty">
                Designers, engineers, fabricators and producers working as one team,
                so complexity never becomes your problem.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="border-b border-line-soft">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="group relative grid grid-cols-1 md:grid-cols-12 gap-x-gutter gap-y-4 py-9 border-t border-line-soft transition-colors duration-500 hover:bg-ink-800/50">
                {/* acid indicator */}
                <span className="absolute left-0 top-0 h-px w-0 bg-acid transition-all duration-500 ease-expo group-hover:w-full" />

                <div className="md:col-span-1 flex items-start">
                  <span className="font-display font-black text-lg text-fg-dim tabular-nums transition-colors duration-300 group-hover:text-acid">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="md:col-span-4">
                  <h3 className="font-display font-bold text-2xl md:text-[1.75rem] leading-tight transition-transform duration-500 ease-expo group-hover:translate-x-1">
                    {cap.title}
                  </h3>
                  <p className="mt-3 font-body text-sm text-fg-muted max-w-[34ch] text-pretty">
                    {cap.summary}
                  </p>
                </div>

                <div className="md:col-span-7 md:pl-6">
                  <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
                    {cap.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 font-body text-sm text-fg-muted transition-colors duration-300 group-hover:text-fg">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-fg-dim transition-colors duration-300 group-hover:bg-acid" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
