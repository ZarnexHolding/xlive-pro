import { Reveal } from '../animations/Reveal'

/*
 * Temporary anchor section for pages/sections still in production, styled
 * on-brand so the WIP home reads as coherent. Removed as each real section ships.
 */
export default function Placeholder({ id, index, title, blurb }) {
  return (
    <section id={id} className="bg-ink-900 border-t border-line-soft py-section-sm">
      <div className="shell">
        <Reveal>
          <div className="flex items-baseline gap-5">
            <span className="font-display font-black text-fg-dim/40 text-2xl tabular-nums">{index}</span>
            <p className="eyebrow">Next in production</p>
          </div>
          <h2 className="mt-6 font-display font-bold text-display-lg text-fg/90">{title}</h2>
          <p className="mt-5 max-w-[52ch] text-body-lg font-body font-light text-fg-muted">{blurb}</p>
        </Reveal>
      </div>
    </section>
  )
}
