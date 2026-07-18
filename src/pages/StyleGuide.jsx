import { useState } from 'react'

/*
 * XLIVE Design System — living style guide.
 * Phase 2 deliverable: validates the brand-true tokens (color, type, motion,
 * components) render correctly before pages are built. Not a production route.
 */

const SWATCHES = [
  { name: 'Deep Electric Blue', hex: '#2A1AAE', cls: 'bg-electric', note: 'Structural brand color', fg: 'text-white' },
  { name: 'Electric Bright', hex: '#3A28E0', cls: 'bg-electric-bright', note: 'Glows & gradients', fg: 'text-white' },
  { name: 'Acid Green', hex: '#73F83E', cls: 'bg-acid', note: 'Single high-voltage accent', fg: 'text-ink-950' },
  { name: 'Vivid Green', hex: '#089A23', cls: 'bg-vivid', note: 'Supportive / success', fg: 'text-white' },
  { name: 'Muted Olive', hex: '#6E7B63', cls: 'bg-olive', note: 'Organic muted', fg: 'text-ink-950' },
  { name: 'Ink 950', hex: '#050609', cls: 'bg-ink-950', note: 'Deepest base', fg: 'text-fg' },
  { name: 'Ink 900', hex: '#080A11', cls: 'bg-ink-900', note: 'Page background', fg: 'text-fg' },
  { name: 'Ink 700', hex: '#11141F', cls: 'bg-ink-700', note: 'Card / elevated', fg: 'text-fg' },
]

const TYPE = [
  { label: 'display-2xl · Hero', cls: 'text-display-2xl', sample: 'THE FUTURE IS LIVE' },
  { label: 'display-lg · Section', cls: 'text-display-lg', sample: 'Engineered to perform' },
  { label: 'heading', cls: 'text-heading', sample: 'World-class events, delivered on the ground' },
  { label: 'subhead', cls: 'text-subhead font-body font-normal', sample: 'Saudi Arabia’s event production & experience engineering partner.' },
  { label: 'body-lg · Hanken Grotesk', cls: 'text-body-lg font-body font-light', sample: 'XLIVE unites designers, engineers, fabricators and project managers under one roof, ensuring seamless coordination, fast execution and uncompromising quality across every project.' },
]

function Block({ id, kicker, title, children }) {
  return (
    <section id={id} className="shell py-section-sm border-t border-line-soft">
      <p className="eyebrow mb-6">{kicker}</p>
      <h2 className="text-heading font-display font-bold mb-12">{title}</h2>
      {children}
    </section>
  )
}

export default function StyleGuide() {
  const [tab, setTab] = useState('A')

  return (
    <div className="min-h-screen bg-ink-900 text-fg selection:bg-acid">

      {/* Masthead */}
      <header className="relative overflow-hidden bg-ink-950">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute inset-0 bg-glow-blue" />
        {/* light-streaks */}
        <div className="pointer-events-none absolute inset-0 flex justify-around opacity-40">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-px bg-gradient-to-b from-transparent via-electric-glow to-transparent animate-streak"
                 style={{ animationDelay: `${i * 0.5}s`, height: '100%' }} />
          ))}
        </div>
        <div className="shell relative py-24">
          <p className="eyebrow mb-8">XLIVE · Design System · v1</p>
          <h1 className="text-display-2xl font-display font-black uppercase leading-[0.9]">
            The Future<br />Is <span className="text-acid">Live</span>
          </h1>
          <p className="mt-8 max-w-prose text-body-lg font-body font-light text-fg-muted">
            The brand-true visual language, Deep Electric Blue, Acid Green, near-black canvas,
            Helvetica display. Every token below is live from <code className="text-acid">tailwind.config.js</code>.
          </p>
        </div>
      </header>

      {/* Color */}
      <Block id="color" kicker="01 — Palette" title="Color system">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SWATCHES.map((s) => (
            <div key={s.name} className={`card overflow-hidden`}>
              <div className={`${s.cls} ${s.fg} h-32 p-4 flex flex-col justify-end`}>
                <span className="font-mono text-xs opacity-80">{s.hex}</span>
              </div>
              <div className="p-4">
                <p className="font-display font-semibold text-sm">{s.name}</p>
                <p className="text-fg-dim text-xs mt-1">{s.note}</p>
              </div>
            </div>
          ))}
        </div>
      </Block>

      {/* Type */}
      <Block id="type" kicker="02 — Typography" title="Type scale">
        <div className="space-y-10">
          {TYPE.map((t) => (
            <div key={t.label} className="grid md:grid-cols-[180px_1fr] gap-4 md:gap-10 items-baseline">
              <p className="text-fg-dim text-xs uppercase tracking-widest pt-2">{t.label}</p>
              <p className={`${t.cls} ${t.cls.includes('font-') ? '' : 'font-display font-bold'} text-balance`}>{t.sample}</p>
            </div>
          ))}
        </div>
      </Block>

      {/* Components */}
      <Block id="components" kicker="03 — Components" title="Core elements">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-fg-dim text-xs uppercase tracking-widest mb-5">Buttons</p>
            <div className="flex flex-wrap items-center gap-4">
              <button className="btn-primary">Start a project →</button>
              <button className="btn-outline">View our work</button>
              <a href="#type" className="group inline-flex items-center gap-2 text-sm font-body font-medium">
                <span className="border-b border-acid pb-1 transition-colors group-hover:text-acid">Text link</span>
              </a>
            </div>

            <p className="text-fg-dim text-xs uppercase tracking-widest mt-10 mb-5">Eyebrow / label</p>
            <p className="eyebrow">Capabilities</p>
          </div>

          <div>
            <p className="text-fg-dim text-xs uppercase tracking-widest mb-5">Card · with hover</p>
            <div className="card p-6 transition-transform duration-500 ease-expo hover:-translate-y-1" data-cursor="hover">
              <div className="flex items-start justify-between">
                <span className="font-display font-black text-4xl text-acid">01</span>
                <span className="text-fg-dim text-xs">TECHNICAL</span>
              </div>
              <h3 className="font-display font-bold text-xl mt-6">Technical Production</h3>
              <p className="text-fg-muted text-sm mt-3 font-body font-light">
                Stage design & fabrication, lighting, audio, LED media facades, projection mapping and special effects.
              </p>
            </div>
          </div>
        </div>
      </Block>

      {/* Graphic language */}
      <Block id="motif" kicker="04 — Graphic language" title="X-motif · grid · gradient">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card h-56 bg-electric relative overflow-hidden flex items-center justify-center">
            <XMotif />
            <span className="relative text-white/70 text-xs uppercase tracking-widest">X-chevron motif</span>
          </div>
          <div className="card h-56 bg-ink-800 bg-grid flex items-center justify-center">
            <span className="text-fg-muted text-xs uppercase tracking-widest">Digital grid</span>
          </div>
          <div className="card h-56 bg-blue-curtain flex items-center justify-center">
            <span className="text-white/70 text-xs uppercase tracking-widest">Blue light-curtain</span>
          </div>
        </div>
      </Block>

      {/* Motion */}
      <Block id="motion" kicker="05 — Motion" title="Easing tabs (Framer/GSAP)">
        <div className="flex gap-2 mb-8">
          {['A', 'B', 'C'].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xs text-sm font-body font-medium transition-colors ${tab === t ? 'bg-acid text-ink-950' : 'border border-line text-fg-muted'}`}>
              {t === 'A' ? 'luxury' : t === 'B' ? 'snap' : 'expo'}
            </button>
          ))}
        </div>
        <div className="card h-40 relative overflow-hidden">
          <div key={tab}
            className="absolute top-1/2 -translate-y-1/2 h-16 w-16 bg-acid rounded-xs"
            style={{
              animation: `slide 1.4s ${tab === 'A' ? 'cubic-bezier(0.25,0.46,0.45,0.94)' : tab === 'B' ? 'cubic-bezier(0.87,0,0.13,1)' : 'cubic-bezier(0.16,1,0.3,1)'} infinite alternate`,
            }} />
        </div>
        <style>{`@keyframes slide { from { left: 1rem } to { left: calc(100% - 5rem) } }`}</style>
      </Block>

      <footer className="shell py-16 border-t border-line-soft text-fg-dim text-xs uppercase tracking-widest">
        XLIVE Production · Brand-true design system · Riyadh, KSA
      </footer>
    </div>
  )
}

function XMotif() {
  // Repeating acid-green upper-blade chevron (brand motif) on electric blue.
  return (
    <svg className="absolute inset-0 w-full h-full opacity-30" aria-hidden>
      <defs>
        <pattern id="xchevron" width="46" height="34" patternUnits="userSpaceOnUse">
          <path d="M2 26 L23 8 L44 26 L44 30 L23 14 L2 30 Z" fill="#73F83E" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#xchevron)" />
    </svg>
  )
}
