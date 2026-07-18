import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { company } from '../../data/company'
import { getLenis } from '../../hooks/useLenis'
import Button from '../ui/Button'

const HEADLINE = ['Your vision,', 'engineered', 'to perform.']

const lineV = {
  hidden: { y: '110%' },
  visible: (i) => ({
    y: '0%',
    transition: { duration: 1.05, delay: 0.35 + i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
}

function scrollToId(id) {
  const el = document.querySelector(id)
  const lenis = getLenis()
  if (lenis && el) lenis.scrollTo(el, { offset: -40 })
  else el?.scrollIntoView({ behavior: 'smooth' })
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yRaw = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const y = useSpring(yRaw, { stiffness: 100, damping: 30, mass: 0.4 })
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} id="top" className="relative min-h-[100svh] overflow-hidden bg-ink-950">
      {/* Real footage — Jeddah F1 night circuit (Higgsfield/on-ground) */}
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <video
          className="w-full h-full object-cover"
          src="/videos/hero-bg.mp4"
          poster="/images/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </motion.div>

      {/* Cinematic grade for legibility — real footage leads, overlays stay quiet */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/45 to-ink-950/35" />
      <div className="absolute inset-0 bg-[radial-gradient(75%_60%_at_20%_20%,rgba(42,26,174,0.28),transparent_60%)]" />
      <div className="absolute inset-0 bg-grid opacity-[0.12]" />

      {/* Content — sits below the navbar (pt clearance), grows if taller than the viewport */}
      <motion.div style={{ opacity: fade }} className="relative min-h-[100svh] flex flex-col justify-end pt-24 md:pt-28">
        <div className="shell pb-[clamp(2rem,6vh,4.5rem)]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="flex items-center gap-3 mb-5"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-acid opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-acid" />
            </span>
            <span className="font-body text-label uppercase text-fg-muted">
              {company.descriptor} · Riyadh, Saudi Arabia
            </span>
          </motion.div>

          <h1 className="font-display font-black uppercase tracking-tightest text-display-2xl max-w-[16ch]">
            {HEADLINE.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span custom={i} variants={lineV} initial="hidden" animate="visible" className="block">
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.9 }}
            className="mt-6 max-w-[52ch] text-body-lg font-body font-light text-fg-muted text-pretty"
          >
            From the Formula&nbsp;1 Saudi Arabian Grand Prix to Dakar Rally — XLIVE designs,
            builds, brands and runs the Middle East&rsquo;s most demanding live events.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.05 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Button href="#contact" size="lg" onClick={(e) => { e.preventDefault(); scrollToId('#contact') }}>
              Start a project →
            </Button>
            <Button href="#work" variant="outline" size="lg" onClick={(e) => { e.preventDefault(); scrollToId('#work') }}>
              See the work
            </Button>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-6 right-[clamp(1.25rem,4vw,3.5rem)] hidden sm:flex items-center gap-3 text-fg-dim">
          <span className="font-body text-[11px] uppercase tracking-[0.2em]">Scroll</span>
          <span className="block h-10 w-px bg-gradient-to-b from-fg-dim to-transparent" />
        </div>
      </motion.div>
    </section>
  )
}
