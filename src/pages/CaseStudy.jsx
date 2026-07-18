import { useParams, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Seo from '../components/Seo'
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi2'
import { projects, getProject } from '../data/projects'
import { Reveal } from '../components/animations/Reveal'
import Button from '../components/ui/Button'
import Contact from '../components/sections/Contact'

function StoryBlock({ label, heading, body, delay = 0 }) {
  return (
    <div className="grid md:grid-cols-12 gap-x-gutter gap-y-4 py-12 border-t border-line-soft">
      <div className="md:col-span-3">
        <Reveal delay={delay}>
          <p className="font-mono text-xs uppercase tracking-widest text-acid">{label}</p>
        </Reveal>
      </div>
      <div className="md:col-span-9">
        <Reveal delay={delay}>
          <h2 className="font-display font-bold text-heading text-balance">{heading}</h2>
          <p className="mt-5 max-w-[62ch] text-body-lg font-body font-light text-fg-muted text-pretty">{body}</p>
        </Reveal>
      </div>
    </div>
  )
}

export default function CaseStudy() {
  const { slug } = useParams()
  const project = getProject(slug)
  if (!project) return <Navigate to="/work" replace />

  const idx = projects.findIndex((p) => p.slug === slug)
  const next = projects[(idx + 1) % projects.length]

  return (
    <>
      <Seo
        path={`/work/${project.slug}`}
        image={project.image}
        title={`${project.title} — XLIVE Production Case Study`}
        description={project.summary}
      />

      {/* Hero */}
      <section className="relative min-h-[80svh] flex items-end overflow-hidden bg-ink-950">
        <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-ink-950/45" />
        <div className="absolute inset-0 bg-grid opacity-[0.1]" />
        <div className="shell relative pt-32 pb-[clamp(2.5rem,6vh,5rem)]">
          <Reveal>
            <Link to="/work" className="inline-flex items-center gap-2 font-body text-sm text-fg-muted hover:text-acid transition-colors mb-8">
              <HiArrowLeft /> All work
            </Link>
          </Reveal>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-body text-label uppercase text-fg-muted mb-6">
            <span className="text-acid">{project.category}</span>
            <span className="text-fg-dim">·</span><span>{project.client}</span>
            <span className="text-fg-dim">·</span><span>{project.location}</span>
            <span className="text-fg-dim">·</span><span className="tabular-nums">{project.year}</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black uppercase tracking-tightest text-display-xl max-w-[18ch]"
          >
            {project.title}
          </motion.h1>
        </div>
      </section>

      {/* Intro summary */}
      <section className="bg-ink-900 py-section-sm border-t border-line-soft">
        <div className="shell">
          <Reveal>
            <p className="max-w-[30ch] font-display font-bold text-display-lg text-balance">{project.summary}</p>
          </Reveal>
        </div>
      </section>

      {/* Story */}
      <section className="bg-ink-900 pb-section-sm">
        <div className="shell">
          <StoryBlock label="The challenge" heading="What made it hard." body={project.challenge} />
          <StoryBlock label="The solution" heading="How we approached it." body={project.solution} delay={0.05} />
          <StoryBlock label="The execution" heading="What we delivered." body={project.execution} delay={0.05} />
        </div>
      </section>

      {/* Scale */}
      <section className="bg-ink-950 py-section-sm border-y border-line-soft">
        <div className="shell">
          <p className="eyebrow mb-10">At scale</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-10">
            {project.scale.map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.08 }}
                className="sm:border-l sm:first:border-l-0 border-line sm:pl-8 sm:first:pl-0"
              >
                <div className="font-display font-black tracking-tightest leading-none text-[clamp(2.5rem,4.5vw,4rem)]">{s.v}</div>
                <div className="mt-3 font-body text-sm text-fg-muted">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services + Gallery */}
      <section className="bg-ink-900 py-section">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-6">Services used</p>
            <div className="flex flex-wrap gap-2.5 mb-16">
              {project.services.map((s) => (
                <span key={s} className="font-body text-sm text-fg-muted border border-line rounded-xs px-4 py-2">{s}</span>
              ))}
            </div>
          </Reveal>

          {project.gallery.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {project.gallery.map((src, i) => (
                <motion.div
                  key={src}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, delay: (i % 2) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative overflow-hidden rounded-md ${i % 3 === 0 ? 'md:col-span-2 aspect-[16/8]' : 'aspect-[4/3]'}`}
                >
                  <img src={src} alt={`${project.title} — production detail`} loading="lazy" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-line rounded-md" />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Next project */}
      <section className="bg-ink-950 border-t border-line-soft">
        <Link to={`/work/${next.slug}`} className="group block relative overflow-hidden">
          <img src={next.image} alt={next.title} className="absolute inset-0 w-full h-full object-cover opacity-30 transition-all duration-[900ms] ease-expo group-hover:opacity-45 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 to-ink-950/40" />
          <div className="shell relative py-section-sm text-center">
            <p className="font-body text-label uppercase text-fg-muted mb-5">Next project</p>
            <h2 className="font-display font-black uppercase tracking-tightest text-display-lg inline-flex items-center gap-4">
              {next.title}
              <HiArrowRight className="transition-transform duration-300 group-hover:translate-x-2" />
            </h2>
          </div>
        </Link>
      </section>

      <Contact />
    </>
  )
}
