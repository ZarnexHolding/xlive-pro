import { motion } from 'framer-motion'
import { Reveal } from '../animations/Reveal'
import { clientCategories } from '../../data/company'

const WORDS = 'A fully integrated event production and experience engineering company.'.split(' ')

export default function WhoWeAre() {
  return (
    <section id="about" className="relative bg-ink-900 py-section">
      <div className="shell">
        <Reveal>
          <p className="eyebrow mb-8">Who we are</p>
        </Reveal>

        {/* Word-by-word statement reveal */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ staggerChildren: 0.045 }}
          className="font-display font-bold text-display-lg max-w-[20ch] text-balance"
        >
          {WORDS.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden align-top">
              <motion.span
                variants={{ hidden: { y: '110%' }, visible: { y: '0%' } }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block pr-[0.25em]"
              >
                {w}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        <div className="mt-16 grid lg:grid-cols-12 gap-x-gutter gap-y-12 items-start">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="relative overflow-hidden rounded-md aspect-[16/10]">
                <img
                  src="/images/sagp-lightbox-tunnel.jpg"
                  alt="Illuminated driver-portrait tunnel built by XLIVE at the Saudi Arabian Grand Prix"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-line rounded-md" />
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:pt-6">
            <Reveal delay={0.1}>
              <p className="text-body-lg font-body font-light text-fg-muted text-pretty">
                XLIVE delivers turnkey solutions for world-class events, exhibitions, fit-out
                projects, temporary structures and industrial production across the Middle East.
                Our multidisciplinary team unites designers, engineers, fabricators and project
                managers <span className="text-fg">under one roof</span> — ensuring seamless
                coordination, fast execution and uncompromising quality on every project.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <ul className="mt-10 space-y-3 border-t border-line-soft pt-8">
                {clientCategories.map((c) => (
                  <li key={c} className="flex items-center gap-3 font-body text-sm text-fg-muted">
                    <span className="h-1 w-1 rounded-full bg-acid" />
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
