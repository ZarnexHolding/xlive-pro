import { Section, Container } from '../components/layout/Section'
import { Reveal, RevealGroup, RevealItem } from '../components/animations/Reveal'

export default function About() {
  return (
    <Section id="about" className="py-24 md:py-32">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* Left — Label + quote */}
          <div className="lg:col-span-4">
            <Reveal>
              <div className="flex items-center gap-3 mb-8">
                <span className="w-8 h-px bg-accent" />
                <span className="section-label">About</span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="border-l-2 border-accent pl-6 py-2">
                <p className="font-display text-lg text-cream leading-snug font-semibold">
                  "We don't produce events. We engineer moments that outlast the applause."
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-10 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="w-px h-10 bg-border mt-1 flex-shrink-0" />
                  <div>
                    <p className="section-label mb-1">Founded</p>
                    <p className="text-cream font-medium">2008, Dubai UAE</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-px h-10 bg-border mt-1 flex-shrink-0" />
                  <div>
                    <p className="section-label mb-1">Headquarters</p>
                    <p className="text-cream font-medium">Dubai, UAE</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-px h-10 bg-border mt-1 flex-shrink-0" />
                  <div>
                    <p className="section-label mb-1">Operations</p>
                    <p className="text-cream font-medium">Middle East & North Africa</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right — Manifesto */}
          <div className="lg:col-span-8">
            <Reveal>
              <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-cream leading-tight mb-8">
                Precision. Craft.
                <br />
                <span className="text-cream-muted font-medium">Uncompromising quality.</span>
              </h2>
            </Reveal>

            <RevealGroup className="space-y-5 text-cream-muted text-base md:text-lg leading-relaxed">
              <RevealItem>
                <p>
                  XLIVE is a full-service event production and technologies company built on a singular principle: every detail matters. We operate at the intersection of creative vision and technical mastery to deliver experiences that are not just executed — they are felt.
                </p>
              </RevealItem>
              <RevealItem>
                <p>
                  Rooted in the Middle East and operating across the region's most ambitious markets, we have spent over a decade developing the capabilities, relationships, and team to make the impossible routine. From state ceremonies to private galas, from concert productions to international exhibitions — we bring the same level of discipline and craft to everything we touch.
                </p>
              </RevealItem>
              <RevealItem>
                <p>
                  Our team is built differently. Engineers who think like creatives. Directors who understand systems. Producers who obsess over quality as much as delivery. It is this hybrid thinking that allows us to consistently deliver at a level that others cannot.
                </p>
              </RevealItem>
            </RevealGroup>

            <Reveal delay={0.3}>
              <div className="mt-10 pt-8 border-t border-border">
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { val: 'KSA', label: 'Primary Market' },
                    { val: 'UAE', label: 'HQ Region' },
                    { val: 'GCC', label: 'Operating Territory' },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="font-display font-bold text-xl text-accent-warm mb-1">{item.val}</p>
                      <p className="section-label">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  )
}
