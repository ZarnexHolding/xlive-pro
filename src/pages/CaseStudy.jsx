import { useRef } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi2'
import Seo from '../components/Seo'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { projects, getProject } from '../data/projects'
import { Reveal, RevealGroup, RevealItem } from '../components/animations/Reveal'
import Img from '../components/ui/Img'
import Contact from '../components/sections/Contact'

function StoryBlock({ label, heading, body, delay = 0 }) {
  return (
    <div className="grid md:grid-cols-12 gap-x-gutter gap-y-4 py-12 border-t border-line-soft">
      <div className="md:col-span-3">
        <Reveal delay={delay}>
          <p className="index text-acid">{label}</p>
        </Reveal>
      </div>
      <div className="md:col-span-9">
        <Reveal delay={delay}>
          <h2 className="font-display font-bold font-semi-wide text-heading text-balance">{heading}</h2>
          <p className="mt-5 max-w-[62ch] text-body-lg font-body font-light text-fg-muted text-pretty">{body}</p>
        </Reveal>
      </div>
    </div>
  )
}

function CaseHero({ project }) {
  const ref = useRef(null)
  const img = useRef(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo(img.current, { scale: 1.1 }, { scale: 1, duration: 1.8, ease: 'power3.out' })
        gsap.to(img.current, {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )
  return (
    <section ref={ref} className="relative min-h-[80svh] flex items-end overflow-hidden bg-ink-950">
      <div ref={img} className="absolute inset-0 gpu">
        <Img src={project.image} alt={project.title} priority sizes="100vw" className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-ink-950/45" />
      <div className="absolute inset-0 bg-grid opacity-[0.1]" />
      <div className="shell relative pt-32 pb-[clamp(2.5rem,6vh,5rem)]">
        <Link to="/work" className="inline-flex items-center gap-2 font-body text-sm text-fg-muted hover:text-acid transition-colors mb-8">
          <HiArrowLeft /> All work
        </Link>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 index mb-6">
          <span className="text-acid">{project.category}</span>
          <span>·</span><span>{project.client}</span>
          <span>·</span><span>{project.location}</span>
          <span>·</span><span className="tabular-nums">{project.year}</span>
        </div>
        <h1 className="font-display font-black font-wide uppercase tracking-tightest text-display-xl max-w-[18ch]">
          {project.title}
        </h1>
      </div>
    </section>
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
        title={`${project.title} | XLIVE Production Case Study`}
        description={project.summary}
      />

      <CaseHero key={project.slug} project={project} />

      {/* Intro summary */}
      <section className="bg-ink-900 py-section-sm border-t border-line-soft">
        <div className="shell">
          <Reveal>
            <p className="max-w-[30ch] font-display font-bold font-semi-wide text-display-lg text-balance">{project.summary}</p>
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
          <RevealGroup className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-10">
            {project.scale.map((s) => (
              <RevealItem key={s.l} className="sm:border-l sm:first:border-l-0 border-line sm:pl-8 sm:first:pl-0">
                <div className="font-display font-black font-wide tracking-tightest leading-none text-[clamp(2.5rem,4.5vw,4rem)]">{s.v}</div>
                <div className="mt-3 font-body text-sm text-fg-muted">{s.l}</div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Services + Gallery */}
      <section className="bg-ink-900 py-section">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-6">Services used</p>
            <div className="flex flex-wrap gap-2.5 mb-16">
              {project.services.map((s) => (
                <span key={s} className="font-body text-sm text-fg-muted border border-line rounded-full px-4 py-2">{s}</span>
              ))}
            </div>
          </Reveal>

          {project.gallery.length > 0 && (
            <RevealGroup className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5" y={36}>
              {project.gallery.map((src, i) => (
                <RevealItem
                  key={src}
                  className={`relative overflow-hidden rounded-lg ${i % 3 === 0 ? 'md:col-span-2 aspect-[16/8]' : 'aspect-[4/3]'}`}
                >
                  <Img
                    src={src}
                    alt={`${project.title}, production detail`}
                    sizes={i % 3 === 0 ? '(min-width:1440px) 1376px, 100vw' : '(min-width:768px) 50vw, 100vw'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-line rounded-lg" />
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      </section>

      {/* Next project */}
      <section className="bg-ink-950 border-t border-line-soft">
        <Link to={`/work/${next.slug}`} className="group block relative overflow-hidden">
          <Img
            src={next.image}
            alt={next.title}
            sizes="100vw"
            className="absolute inset-0 w-full h-full object-cover opacity-30 transition-all duration-[900ms] ease-expo group-hover:opacity-45 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 to-ink-950/40" />
          <div className="shell relative py-section-sm text-center">
            <p className="index mb-5">Next project</p>
            <h2 className="font-display font-black font-wide uppercase tracking-tightest text-display-lg inline-flex items-center gap-4">
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
