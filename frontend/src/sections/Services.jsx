import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiPlus, HiMinus } from 'react-icons/hi'
import { Section, Container, SectionHeader } from '../components/layout/Section'
import { Reveal } from '../components/animations/Reveal'
import { services } from '../data/services'

function ServiceCard({ service, isOpen, onToggle }) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 md:py-7 text-left group"
      >
        <div className="flex items-center gap-5 md:gap-8">
          <span className="section-label text-accent-warm hidden sm:block">{service.number}</span>
          <div>
            <h3 className="font-display font-bold text-xl md:text-2xl text-cream group-hover:text-accent transition-colors duration-200">
              {service.title}
            </h3>
            <p className="text-cream-muted text-sm mt-1 hidden md:block">{service.shortDesc}</p>
          </div>
        </div>
        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center border border-border text-cream-muted group-hover:border-accent group-hover:text-accent transition-all duration-200">
          {isOpen ? <HiMinus size={14} /> : <HiPlus size={14} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="pb-8 pl-0 sm:pl-16 md:pl-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <p className="text-cream-muted leading-relaxed">{service.description}</p>
                <ul className="space-y-2">
                  {service.capabilities.map((cap) => (
                    <li key={cap} className="flex items-start gap-3 text-sm text-cream-muted">
                      <span className="w-1 h-1 rounded-full bg-accent mt-2 flex-shrink-0" />
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Services() {
  const [openId, setOpenId] = useState('av')

  return (
    <Section id="services" dark className="py-24 md:py-32">
      <Container>
        <Reveal>
          <SectionHeader
            label="Services"
            title="Full-Spectrum Event Production"
            description="Every discipline required to produce world-class events — under one roof, operating as one team."
          />
        </Reveal>

        <div className="border-t border-border">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isOpen={openId === service.id}
              onToggle={() => setOpenId(openId === service.id ? null : service.id)}
            />
          ))}
        </div>
      </Container>
    </Section>
  )
}
