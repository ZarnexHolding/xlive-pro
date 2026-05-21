import { Section, Container } from '../components/layout/Section'
import { Reveal } from '../components/animations/Reveal'
import { useInView } from '../hooks/useInView'
import { useCounter } from '../hooks/useCounter'
import { stats } from '../data/stats'

function StatItem({ value, suffix, label }) {
  const [ref, inView] = useInView({ threshold: 0.5 })
  const count = useCounter(value, 2200, inView)

  return (
    <div ref={ref} className="text-center md:text-left">
      <div className="font-display font-bold text-5xl md:text-6xl lg:text-7xl text-cream leading-none mb-3">
        <span>{count}</span>
        <span className="text-accent">{suffix}</span>
      </div>
      <p className="section-label">{label}</p>
    </div>
  )
}

export default function Stats() {
  return (
    <Section className="py-20 md:py-28 border-y border-border">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1}>
              <StatItem {...stat} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
