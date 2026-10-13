import { Reveal, RevealGroup, RevealItem } from '../animations/Reveal'
import { industries } from '../../data/industries'

/*
 * Industries: five sectors, each backed by the real names XLIVE has produced
 * for. A sticky statement on the left; the rows stagger in on the right and
 * a row's clients brighten on hover.
 */
export default function Industries() {
  return (
    <section id="industries" className="relative bg-ink-900 py-section border-t border-line-soft">
      <div className="shell grid lg:grid-cols-12 gap-x-gutter gap-y-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <p className="index mb-5">Industries</p>
              <h2 className="font-display font-bold font-semi-wide text-display-lg text-balance">
                Built for the Kingdom&rsquo;s most demanding clients.
              </h2>
            </Reveal>
          </div>
        </div>

        <RevealGroup className="lg:col-span-8 border-t border-line-soft" stagger={0.07}>
          {industries.map((ind, i) => (
            <RevealItem
              key={ind.title}
              className="group grid grid-cols-[2.5rem_1fr] md:grid-cols-[2.5rem_5fr_6fr] gap-x-4 md:gap-x-6 gap-y-3 py-7 border-b border-line-soft transition-colors duration-500 hover:bg-ink-800/40"
            >
              <span className="index pt-1.5 transition-colors group-hover:text-acid">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="font-display font-bold font-semi-wide text-xl leading-tight">{ind.title}</h3>
              <div className="col-start-2 md:col-start-3 flex flex-wrap gap-2 md:justify-end md:content-start">
                {ind.clients.map((c) => (
                  <span
                    key={c}
                    className="font-body text-xs text-fg-muted border border-line rounded-full px-3 py-1.5 transition-colors group-hover:border-line-strong group-hover:text-fg"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
