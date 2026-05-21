import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiCheck } from 'react-icons/hi'
import { Section, Container } from '../components/layout/Section'
import { Reveal } from '../components/animations/Reveal'
import { sectors } from '../data/sectors'

export default function Sectors() {
  const [active, setActive] = useState(sectors[0].id)

  const current = sectors.find((s) => s.id === active)

  return (
    <Section id="sectors" dark className="py-24 md:py-32">
      <Container>
        {/* Header */}
        <Reveal>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-px bg-accent" />
            <span className="section-label">Sectors</span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-cream mb-16">
            Industries We Serve
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Tab list */}
          <div className="lg:col-span-4">
            <div className="flex flex-row lg:flex-col gap-0 border border-border overflow-x-auto lg:overflow-visible">
              {sectors.map((sector) => (
                <button
                  key={sector.id}
                  onClick={() => setActive(sector.id)}
                  className={`
                    relative flex-shrink-0 lg:flex-shrink text-left px-5 py-4 lg:py-5
                    font-body text-sm transition-all duration-200
                    border-r lg:border-r-0 lg:border-b border-border last:border-0
                    ${
                      active === sector.id
                        ? 'bg-accent text-cream'
                        : 'text-cream-muted hover:text-cream hover:bg-bg-card'
                    }
                  `}
                >
                  <span className="font-medium tracking-wide">{sector.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <h3 className="font-display font-bold text-2xl md:text-3xl text-cream mb-5">
                  {current.title}
                </h3>
                <p className="text-cream-muted leading-relaxed text-base md:text-lg mb-8">
                  {current.description}
                </p>

                <div className="border-t border-border pt-6">
                  <p className="section-label mb-4">Key Capabilities</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {current.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-cream">
                        <span className="w-4 h-4 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <HiCheck size={10} className="text-accent" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </Section>
  )
}
