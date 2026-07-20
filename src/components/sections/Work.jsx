import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiArrowRight } from 'react-icons/hi2'
import { projects } from '../../data/projects'
import { Reveal } from '../animations/Reveal'
import ProjectCard from '../ui/ProjectCard'

// Editorial asymmetric layout for 6 featured projects: [7|5] [5|7] [7|5]
const LAYOUT = [
  { span: 'lg:col-span-7', size: 'lg' },
  { span: 'lg:col-span-5', size: 'md' },
  { span: 'lg:col-span-5', size: 'md' },
  { span: 'lg:col-span-7', size: 'lg' },
  { span: 'lg:col-span-7', size: 'lg' },
  { span: 'lg:col-span-5', size: 'md' },
]

function Cell({ children, span, i }) {
  return (
    <motion.div
      className={span}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: (i % 2) * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function Work() {
  return (
    <section id="work" className="relative bg-ink-900 py-section border-t border-line-soft">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <div>
            <Reveal><p className="eyebrow mb-8">Selected work</p></Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display font-bold text-display-lg text-balance">Proof, at full scale.</h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <Link to="/work" className="group inline-flex items-center gap-2 font-body text-sm text-fg-muted hover:text-fg transition-colors">
              <span className="border-b border-line-strong pb-1 group-hover:border-acid transition-colors">All case studies</span>
              <HiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
          {projects.map((p, i) => (
            <Cell key={p.slug} span={(LAYOUT[i] || LAYOUT[LAYOUT.length - 1]).span} i={i}>
              <ProjectCard project={p} size={(LAYOUT[i] || LAYOUT[LAYOUT.length - 1]).size} />
            </Cell>
          ))}
        </div>
      </div>
    </section>
  )
}
