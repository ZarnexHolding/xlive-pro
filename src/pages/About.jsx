import Seo from '../components/Seo'
import { Reveal, RevealGroup, RevealItem } from '../components/animations/Reveal'
import BackButton from '../components/ui/BackButton'
import Img from '../components/ui/Img'
import { company } from '../data/company'
import { divisions, departments, disciplines } from '../data/about'
import Contact from '../components/sections/Contact'

export default function About() {
  return (
    <>
      <Seo
        path="/about"
        image="/images/sagp-grandstand-day.jpg"
        title="About | XLIVE Production · Event Production & Technologies · Saudi Arabia"
        description="XLIVE Production is a fully integrated event production and experience engineering company in Riyadh, part of Zarnex Holding designers, engineers, fabricators and producers under one roof."
      />

      {/* Hero */}
      <section className="relative bg-ink-950 pt-40 pb-section-sm border-b border-line-soft overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.12]" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_80%_0%,rgba(42,26,174,0.22),transparent_60%)]" />
        <div className="shell relative">
          <Reveal><BackButton className="mb-10" /></Reveal>
          <Reveal><p className="eyebrow mb-8">About XLIVE</p></Reveal>
          <Reveal delay={0.05}>
            <h1 className="font-display font-black font-wide uppercase tracking-tightest text-display-xl max-w-[14ch]">
              One roof. Every discipline.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-[62ch] text-body-lg font-body font-light text-fg-muted text-pretty">
              XLIVE Production is a fully integrated event production and experience engineering
              company, delivering turnkey solutions for world-class events, exhibitions, fit-out
              projects, temporary structures and industrial production across the Middle East.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 index normal-case tracking-[0.08em]">
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
              <h2 className="font-display font-bold font-semi-wide text-display-lg text-balance">
                Designers, engineers, fabricators and producers: one team.
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
              <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
                <Img
                  src="/images/sagp-grandstand-day.jpg"
                  alt="XLIVE team delivering the Saudi Arabian Grand Prix grandstand build"
                  sizes="(min-width:1024px) 50vw, 100vw"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-line rounded-lg" />
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
              <h2 className="font-display font-bold font-semi-wide text-display-lg text-balance max-w-[18ch]">
                Built like a company that delivers championships.
              </h2>
            </Reveal>
          </div>

          {/* Division directors */}
          <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4" stagger={0.06}>
            {divisions.map((d) => (
              <RevealItem key={d.title} className="card p-6">
                <span className="index text-acid">Division</span>
                <h3 className="mt-4 font-display font-bold font-semi-wide text-xl leading-tight">{d.title}</h3>
                <p className="mt-2 font-body text-sm text-fg-muted">{d.remit}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          {/* Departments */}
          <Reveal className="mt-12">
            <p className="index mb-5">Departments</p>
            <div className="flex flex-wrap gap-2.5">
              {departments.map((d) => (
                <span key={d} className="font-body text-sm text-fg-muted border border-line rounded-full px-4 py-2">{d}</span>
              ))}
            </div>
          </Reveal>

          {/* Disciplines */}
          <Reveal className="mt-10">
            <p className="index mb-5">In-house teams</p>
            <div className="flex flex-wrap gap-2.5">
              {disciplines.map((d) => (
                <span key={d} className="font-body text-sm text-fg-dim border border-line-soft rounded-full px-4 py-2">{d}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Contact />
    </>
  )
}
