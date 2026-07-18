import { motion } from 'framer-motion'
import Seo from '../components/Seo'
import { Reveal } from '../components/animations/Reveal'
import BackButton from '../components/ui/BackButton'
import { company } from '../data/company'
import { divisions, departments, disciplines } from '../data/about'
import Contact from '../components/sections/Contact'

export default function About() {
  return (
    <>
      <Seo
        path="/about"
        image="/images/sagp-grandstand-day.jpg"
        title="About — XLIVE Production · Event Production & Technologies · Saudi Arabia"
        description="XLIVE Production is a fully integrated event production and experience engineering company in Riyadh, part of Zarnex Holding designers, engineers, fabricators and producers under one roof."
      />

      {/* Hero */}
      <section className="relative bg-ink-950 pt-40 pb-section-sm border-b border-line-soft overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.12]" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_80%_0%,rgba(42,26,174,0.22),transparent_60%)]" />
        <div className="shell relative">
          <Reveal><BackButton className="mb-10" /></Reveal>
          <Reveal><p className="eyebrow mb-8">About XLIVE</p></Reveal>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black uppercase tracking-tightest text-display-xl max-w-[14ch]"
          >
            One roof. Every discipline.
          </motion.h1>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-[62ch] text-body-lg font-body font-light text-fg-muted text-pretty">
              XLIVE Production is a fully integrated event production and experience engineering
              company, delivering turnkey solutions for world-class events, exhibitions, fit-out
              projects, temporary structures and industrial production across the Middle East.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 font-body text-sm text-fg-dim">
              Based in Riyadh · Part of {company.parent} · CR {company.cr}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Statement + image */}
      <section className="bg-ink-900 py-section">
        <div className="shell grid lg:grid-cols-12 gap-x-gutter gap-y-12 items-center">
          <div className="lg:col-span-6">
            <Reveal>
              <h2 className="font-display font-bold text-display-lg text-balance">
                Designers, engineers, fabricators and producers one team.
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mt-6 max-w-[46ch] text-body-lg font-body font-light text-fg-muted text-pretty">
                Uniting every discipline under one roof means seamless coordination, fast execution
                and uncompromising quality on every project, with no seams to fall through and no
                finger-pointing between vendors.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-6">
            <Reveal delay={0.1}>
              <div className="relative overflow-hidden rounded-md aspect-[4/3]">
                <img src="/images/sagp-grandstand-day.jpg" alt="XLIVE team delivering the Saudi Arabian Grand Prix grandstand build" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 ring-1 ring-inset ring-line rounded-md" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Organisation */}
      <section className="bg-ink-950 py-section border-y border-line-soft">
        <div className="shell">
          <div className="mb-14">
            <Reveal><p className="eyebrow mb-8">The organisation</p></Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display font-bold text-display-lg text-balance max-w-[18ch]">
                Built like a company that delivers championships.
              </h2>
            </Reveal>
          </div>

          {/* Division directors */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {divisions.map((d, i) => (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }}
                className="card p-6"
              >
                <span className="font-mono text-[11px] uppercase tracking-widest text-acid">Division</span>
                <h3 className="mt-4 font-display font-bold text-xl leading-tight">{d.title}</h3>
                <p className="mt-2 font-body text-sm text-fg-muted">{d.remit}</p>
              </motion.div>
            ))}
          </div>

          {/* Departments */}
          <div className="mt-12">
            <p className="font-mono text-xs uppercase tracking-widest text-fg-dim mb-5">Departments</p>
            <div className="flex flex-wrap gap-2.5">
              {departments.map((d) => (
                <span key={d} className="font-body text-sm text-fg-muted border border-line rounded-xs px-4 py-2">{d}</span>
              ))}
            </div>
          </div>

          {/* Disciplines */}
          <div className="mt-10">
            <p className="font-mono text-xs uppercase tracking-widest text-fg-dim mb-5">In-house teams</p>
            <div className="flex flex-wrap gap-2.5">
              {disciplines.map((d) => (
                <span key={d} className="font-body text-sm text-fg-dim border border-line-soft rounded-xs px-4 py-2">{d}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Contact />
    </>
  )
}
