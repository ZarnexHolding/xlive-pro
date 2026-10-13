import { useRef } from 'react'
import { HiArrowRight } from 'react-icons/hi2'
import Seo from '../components/Seo'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { Reveal, RevealGroup, RevealItem } from '../components/animations/Reveal'
import SplitWords from '../components/animations/SplitWords'
import Button from '../components/ui/Button'
import BackButton from '../components/ui/BackButton'
import Img from '../components/ui/Img'
import { XMotif } from '../components/ui/XSymbol'
import Contact from '../components/sections/Contact'
import { partnerFriction, partnerOffer, partnerWhy } from '../data/partners'

const HEAD = ['Your trusted', 'execution partner', 'in Saudi Arabia.']

function PartnersHero() {
  const ref = useRef(null)
  const img = useRef(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.timeline({ defaults: { ease: 'expo.out' } })
          .fromTo(img.current, { scale: 1.1 }, { scale: 1, duration: 1.8, ease: 'power3.out' }, 0)
          .fromTo('.split-word', { yPercent: 115 }, { yPercent: 0, duration: 1.1, stagger: 0.05 }, 0.3)
        gsap.to(img.current, {
          yPercent: 16,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )
  return (
    <section ref={ref} className="relative min-h-[82svh] flex items-end overflow-hidden bg-ink-950">
      <div ref={img} className="absolute inset-0 gpu">
        <Img
          src="/images/sagp-grandstand-night.jpg"
          alt="XLIVE grandstand production at the Saudi Arabian Grand Prix"
          priority
          sizes="100vw"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-ink-950/50" />
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_20%_10%,rgba(42,26,174,0.35),transparent_62%)]" />
      <div className="absolute inset-0 bg-grid opacity-[0.12]" />

      <div className="absolute top-[88px] inset-x-0 z-20">
        <div className="shell"><BackButton /></div>
      </div>

      <div className="shell relative pb-[clamp(3rem,8vh,6rem)] pt-32">
        <p className="eyebrow mb-7">For agencies &amp; partnerships</p>
        <h1 className="font-display font-black font-wide uppercase tracking-tightest text-display-xl max-w-[18ch]">
          <SplitWords lines={HEAD} />
        </h1>
        <p className="mt-8 max-w-[54ch] text-body-lg font-body font-light text-fg-muted text-pretty">
          For Dubai and international agencies, creative studios and global production partners
          delivering into the Kingdom, XLIVE is your team on the ground.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="#contact" size="lg">Partner with us →</Button>
          <Button to="/work" variant="outline" size="lg">See our work</Button>
        </div>
      </div>
    </section>
  )
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

      <PartnersHero />

      {/* The gap */}
      <section className="bg-ink-900 py-section border-t border-line-soft">
        <div className="shell grid lg:grid-cols-12 gap-x-gutter gap-y-12">
          <div className="lg:col-span-6">
            <Reveal><p className="eyebrow mb-8">The gap we close</p></Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display font-bold font-semi-wide text-display-lg text-balance">
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
            <RevealGroup className="border-t border-line-soft">
              {partnerFriction.map((f, i) => (
                <RevealItem key={f.k} className="flex gap-5 py-6 border-b border-line-soft">
                  <span className="font-mono text-sm text-acid pt-1">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="font-display font-semibold font-semi-wide text-lg">{f.k}</h3>
                    <p className="mt-1.5 font-body text-sm text-fg-muted max-w-[42ch]">{f.v}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* What we handle */}
      <section className="bg-ink-950 py-section border-t border-line-soft">
        <div className="shell">
          <div className="mb-14 max-w-[24ch]">
            <Reveal><p className="eyebrow mb-8">What we handle</p></Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display font-bold font-semi-wide text-display-lg text-balance">The whole stack, one partner.</h2>
            </Reveal>
          </div>
          <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" stagger={0.07}>
            {partnerOffer.map((o, i) => (
              <RevealItem key={o.title} className="group card p-7 transition-colors duration-500 hover:bg-ink-600">
                <span className="block h-8 w-8 mb-6 rounded-full bg-acid/10 text-acid grid place-items-center font-display font-black text-sm">
                  {i + 1}
                </span>
                <h3 className="font-display font-bold font-semi-wide text-xl leading-tight">{o.title}</h3>
                <p className="mt-3 font-body text-sm text-fg-muted text-pretty">{o.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Why XLIVE */}
      <section className="bg-ink-900 py-section border-t border-line-soft">
        <div className="shell">
          <div className="mb-14">
            <Reveal><p className="eyebrow mb-8">Why XLIVE</p></Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display font-bold font-semi-wide text-display-lg text-balance max-w-[20ch]">
                We understand KSA. We execute at international standards.
              </h2>
            </Reveal>
          </div>
          <RevealGroup className="border-t border-line-soft" stagger={0.05}>
            {partnerWhy.map((w) => (
              <RevealItem
                key={w.k}
                className="group grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-2 py-7 border-b border-line-soft transition-colors duration-500 hover:bg-ink-800/40"
              >
                <span className="md:col-span-1 font-display font-black text-lg text-fg-dim group-hover:text-acid transition-colors">{w.k}</span>
                <h3 className="md:col-span-4 font-display font-bold font-semi-wide text-xl leading-tight">{w.title}</h3>
                <p className="md:col-span-7 font-body text-body-lg font-light text-fg-muted max-w-[52ch] text-pretty">{w.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          {/* Collaboration model */}
          <Reveal className="mt-16">
            <div className="relative overflow-hidden rounded-xl bg-electric p-[clamp(2rem,5vw,4rem)]">
              <XMotif className="absolute inset-0" color="#5138FF" opacity={0.3} />
              <div className="relative max-w-[60ch]">
                <p className="font-mono text-label uppercase text-white/70 mb-5">How we collaborate</p>
                <p className="font-display font-bold font-semi-wide text-2xl md:text-3xl text-white text-balance leading-tight">
                  We work with Dubai agencies, international event companies and creative studios, white-label
                  or named, as your production partner in the Kingdom.
                </p>
                <div className="mt-8">
                  <Button href="#contact" variant="dark" size="lg">Start a conversation <HiArrowRight /></Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Contact />
    </>
  )
}
