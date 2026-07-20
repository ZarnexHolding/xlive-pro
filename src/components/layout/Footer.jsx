import { Link } from 'react-router-dom'
import logo from '../../assets/Xlive-logo-trans.png'
import { company, nav } from '../../data/company'
import XSymbol from '../ui/XSymbol'

export default function Footer() {
  const year = 2026
  return (
    <footer id="footer" className="relative bg-ink-950 border-t border-line-soft">
      <div className="shell py-[clamp(3.5rem,7vw,6rem)]">
        <div className="grid gap-x-gutter gap-y-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <img src={logo} alt="XLIVE Production" className="h-8 w-auto" />
            <p className="mt-6 max-w-[34ch] font-display font-medium text-xl text-fg text-balance">
              {company.tagline}
            </p>
            <p className="mt-4 max-w-[40ch] font-body text-sm text-fg-dim">
              {company.positioning}
            </p>
          </div>

          {/* Sitemap */}
          <nav className="md:col-span-3">
            <p className="font-body text-label uppercase text-fg-dim mb-5">Explore</p>
            <ul className="space-y-3">
              {nav.map((n) => (
                <li key={n.label}>
                  {n.to ? (
                    <Link to={n.to} className="font-body text-sm text-fg-muted hover:text-acid transition-colors">
                      {n.label}
                    </Link>
                  ) : (
                    <a href={n.href} className="font-body text-sm text-fg-muted hover:text-acid transition-colors">
                      {n.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="md:col-span-4">
            <p className="font-body text-label uppercase text-fg-dim mb-5">Riyadh, KSA</p>
            <address className="not-italic font-body text-sm text-fg-muted leading-relaxed">
              {company.parent}<br />
              {company.address.line1}<br />
              {company.address.line2}<br />
              {company.address.city}, {company.address.country}
            </address>
            <a href={company.phoneHref} className="mt-4 inline-block font-body text-sm text-fg hover:text-acid transition-colors">
              {company.phone}
            </a>
            <a href={`https://${company.domain}`} className="mt-2 block font-body text-sm text-fg-muted hover:text-acid transition-colors">
              {company.domain}
            </a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-line-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-fg-dim">
            <XSymbol className="w-5 h-5 text-fg-dim" />
            <span className="font-body text-xs">
              © {year} {company.name} · Part of {company.parent} · CR {company.cr}
            </span>
          </div>
          <span className="font-body text-xs text-fg-dim uppercase tracking-widest">The Future Is Live</span>
        </div>
      </div>
    </footer>
  )
}
