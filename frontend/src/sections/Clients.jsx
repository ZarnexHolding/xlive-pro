import { motion } from 'framer-motion'
import { Section, Container, SectionHeader } from '../components/layout/Section'
import { Reveal, RevealGroup, RevealItem } from '../components/animations/Reveal'
import { clients } from '../data/stats'

function ClientLogo({ name }) {
  // Generate initials for placeholder
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 3)

  return (
    <motion.div
      className="group flex items-center justify-center p-5 md:p-6 border border-border bg-bg-card hover:border-cream/20 transition-all duration-300 aspect-[3/2]"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.25 }}
    >
      {/* Placeholder — replace with real <img> when logos are available */}
      <div className="text-center">
        <span className="font-display font-bold text-sm md:text-base tracking-widest text-cream-muted/40 group-hover:text-cream-muted transition-colors duration-300 uppercase">
          {name}
        </span>
      </div>
    </motion.div>
  )
}

export default function Clients() {
  return (
    <Section id="clients" dark className="py-24 md:py-32">
      <Container>
        <Reveal>
          <SectionHeader
            label="Clients"
            title="Trusted By the Region's Most Ambitious"
            description="We have the privilege of working alongside governments, institutions, and brands that shape the future of the Middle East."
            align="center"
          />
        </Reveal>

        <RevealGroup className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px border border-border">
          {clients.map((client) => (
            <RevealItem key={client.id}>
              <ClientLogo name={client.name} />
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.2}>
          <p className="text-center text-cream-muted text-sm mt-10">
            And many more across government, corporate, and entertainment sectors.
          </p>
        </Reveal>
      </Container>
    </Section>
  )
}
