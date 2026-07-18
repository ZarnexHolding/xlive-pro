import { motion } from 'framer-motion'
import Seo from '../components/Seo'
import { projects } from '../data/projects'
import { Reveal } from '../components/animations/Reveal'
import ProjectCard from '../components/ui/ProjectCard'
import BackButton from '../components/ui/BackButton'
import Contact from '../components/sections/Contact'

const SIZES = ['lg', 'md', 'md', 'lg', 'md', 'md']

export default function Work() {
  return (
    <>
      <Seo
        path="/work"
        title="Work & Case Studies, XLIVE Production · Saudi Arabia"
        description="Selected XLIVE Production case studies, Saudi Arabian Grand Prix, Dakar Rally, GT Race Jeddah, Ferrari Festival and more. Challenge, solution, execution and scale."
      />

      <section className="bg-ink-900 pt-40 pb-section-sm">
        <div className="shell">
          <Reveal><BackButton className="mb-10" /></Reveal>
          <Reveal><p className="eyebrow mb-8">Selected work</p></Reveal>
          <Reveal delay={0.05}>
            <h1 className="font-display font-black uppercase tracking-tightest text-display-xl max-w-[16ch]">
              Proof, at full scale.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-[56ch] text-body-lg font-body font-light text-fg-muted text-pretty">
              Every build is a story of challenge, solution, execution and scale, delivered on the
              ground across the Kingdom.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink-900 pb-section">
        <div className="shell grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {projects.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, delay: (i % 2) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={SIZES[i] === 'lg' ? 'md:col-span-2' : ''}
            >
              <ProjectCard project={p} size={SIZES[i] === 'lg' ? 'wide' : 'md'} />
            </motion.div>
          ))}
        </div>
      </section>

      <Contact />
    </>
  )
}
