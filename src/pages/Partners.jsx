import { motion } from 'framer-motion'
import { HiArrowRight } from 'react-icons/hi2'
import Seo from '../components/Seo'
import { Reveal } from '../components/animations/Reveal'
import Button from '../components/ui/Button'
import BackButton from '../components/ui/BackButton'
import { XMotif } from '../components/ui/XSymbol'
import Contact from '../components/sections/Contact'
import { partnerFriction, partnerOffer, partnerWhy } from '../data/partners'

const HEAD = ['Your trusted', 'execution partner', 'in Saudi Arabia.']
const lineV = {
  hidden: { y: '110%' },
  visible: (i) => ({ y: '0%', transition: { duration: 1, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] } }),
}

export default function Partners() {
  return (
    <>
      <Seo
        path="/partners"
        image="/images/sagp-grandstand-night.jpg"
        title="For Agencies & Partnerships, XLIVE Production · Saudi Arabia"
        description="XLIVE is the Saudi execution partner for Dubai and international agencies delivering events, exhibitions and experiences in KSA local production, permits, vendor network and on-ground delivery at international standards."
      />

      {/* Hero */}
      <section className="relative min-h-[82svh] flex items-end overflow-hidden bg-ink-950">
        <img
          src="/images/sagp-grandstand-night.jpg"
          alt="XLIVE grandstand production at the Saudi Arabian Grand Prix"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-ink-950/50" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_20%_10%,rgba(42,26,174,0.35),transparent_62%)]" />
        <div className="absolute inset-0 bg-grid opacity-[0.12]" />

        <div className="absolute top-[88px] inset-x-0 z-20">
          <div className="shell"><BackButton /></div>
        </div>

        <div className="shell relative pb-[clamp(3rem,8vh,6rem)] pt-32">
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="eyebrow mb-7"
          >
            For agencies &amp; partnerships
          </motion.p>
          <h1 className="font-display font-black uppercase tracking-tightest text-display-xl max-w-[18ch]">
            {HEAD.map((l, i) => (
              <span key={l} className="block overflow-hidden">
                <motion.span custom={i} variants={lineV} initial="hidden" animate="visible" className="block">
                  {l}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.8 }}
            className="mt-8 max-w-[54ch] text-body-lg font-body font-light text-fg-muted text-pretty"
          >
            For Dubai and international agencies, creative studios and global production partners
            delivering into the Kingdom, XLIVE is your team on the ground.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.95 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Button href="#contact" size="lg">Partner with us →</Button>
            <Button to="/work" variant="outline" size="lg">See our work</Button>
          </motion.div>
        </div>
      </section>

      {/* The gap */}
      <section className="bg-ink-900 py-section border-t border-line-soft">
        <div className="shell grid lg:grid-cols-12 gap-x-gutter gap-y-12">
          <div className="lg:col-span-6">
            <Reveal><p className="eyebrow mb-8">The gap we close</p></Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display font-bold text-display-lg text-balance">
                Delivering in Saudi Arabia is different.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-[46ch] text-body-lg font-body font-light text-fg-muted text-pretty">
                Permits, vendors, logistics and local standards can stall even the best creative.
                You need a partner who already knows the ground. <span className="text-fg">We close that gap.</span>
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-6 lg:pt-4">
            <div className="border-t border-line-soft">
              {partnerFriction.map((f, i) => (
                <motion.div
                  key={f.k}
                  initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.08 }}
                  className="flex gap-5 py-6 border-b border-line-soft"
                >
                  <span className="font-mono text-sm text-acid pt-1">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="font-display font-semibold text-lg">{f.k}</h3>
                    <p className="mt-1.5 font-body text-sm text-fg-muted max-w-[42ch]">{f.v}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What we handle */}
      <section className="bg-ink-950 py-section border-t border-line-soft">
        <div className="shell">
          <div className="mb-14 max-w-[24ch]">
            <Reveal><p className="eyebrow mb-8">What we handle</p></Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display font-bold text-display-lg text-balance">The whole stack, one partner.</h2>
            </Reveal>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {partnerOffer.map((o, i) => (
              <motion.div
                key={o.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.55, delay: (i % 3) * 0.07 }}
                className="group card p-7 transition-colors duration-500 hover:bg-ink-600"
              >
                <span className="block h-8 w-8 mb-6 rounded-xs bg-acid/10 text-acid grid place-items-center font-display font-black">
                  {i + 1}
                </span>
                <h3 className="font-display font-bold text-xl leading-tight">{o.title}</h3>
                <p className="mt-3 font-body text-sm text-fg-muted text-pretty">{o.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why XLIVE */}
      <section className="bg-ink-900 py-section border-t border-line-soft">
        <div className="shell">
          <div className="mb-14">
            <Reveal><p className="eyebrow mb-8">Why XLIVE</p></Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display font-bold text-display-lg text-balance max-w-[20ch]">
                We understand KSA. We execute at international standards.
              </h2>
            </Reveal>
          </div>
          <div className="border-t border-line-soft">
            {partnerWhy.map((w, i) => (
              <motion.div
                key={w.k}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.55, delay: i * 0.05 }}
                className="group grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-2 py-7 border-b border-line-soft transition-colors duration-500 hover:bg-ink-800/40"
              >
                <span className="md:col-span-1 font-display font-black text-lg text-fg-dim group-hover:text-acid transition-colors">{w.k}</span>
                <h3 className="md:col-span-4 font-display font-bold text-xl leading-tight">{w.title}</h3>
                <p className="md:col-span-7 font-body text-body-lg font-light text-fg-muted max-w-[52ch] text-pretty">{w.body}</p>
              </motion.div>
            ))}
          </div>

          {/* Collaboration model */}
          <div className="mt-16 relative overflow-hidden rounded-lg bg-electric p-[clamp(2rem,5vw,4rem)]">
            <XMotif className="absolute inset-0" color="#5138FF" opacity={0.3} />
            <div className="relative max-w-[60ch]">
              <p className="font-body text-label uppercase text-white/70 mb-5">How we collaborate</p>
              <p className="font-display font-bold text-2xl md:text-3xl text-white text-balance leading-tight">
                We work with Dubai agencies, international event companies and creative studios, white-label
                or name, as your production partner in the Kingdom.
              </p>
              <div className="mt-8">
                <Button href="#contact" variant="dark" size="lg">Start a conversation <HiArrowRight /></Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Contact />
    </>
  )
}
