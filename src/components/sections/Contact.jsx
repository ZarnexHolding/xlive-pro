import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiArrowRight } from 'react-icons/hi2'
import { company } from '../../data/company'
import { Reveal } from '../animations/Reveal'

const PROJECT_TYPES = ['Event production', 'Exhibition / stand', 'Fabrication', 'Agency partnership', 'Other']
const field = 'w-full bg-ink-800 border border-line rounded-xs px-4 py-3 font-body text-sm text-fg placeholder:text-fg-dim focus:border-acid focus:outline-none transition-colors'

export default function Contact() {
  const [form, setForm] = useState({ name: '', company: '', email: '', type: PROJECT_TYPES[0], message: '', website: '' })
  const [status, setStatus] = useState('idle') // idle | sending | error | success
  const [errors, setErrors] = useState({})

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const err = {}
    if (!form.name.trim()) err.name = 'Required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'Valid email required'
    if (!form.message.trim()) err.message = 'Tell us a little about the project'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="relative bg-ink-950 py-section border-t border-line-soft overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_15%_10%,rgba(42,26,174,0.2),transparent_60%)]" />
      <div className="shell relative grid lg:grid-cols-12 gap-x-gutter gap-y-14">
        {/* Left — invitation + direct details */}
        <div className="lg:col-span-5">
          <Reveal><p className="eyebrow mb-8">Start a project</p></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display font-black uppercase tracking-tightest text-display-lg text-balance">
              Let&rsquo;s build something the region remembers.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 space-y-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-fg-dim mb-2">Direct</p>
                <a href={company.phoneHref} className="block font-display font-bold text-xl hover:text-acid transition-colors">{company.phone}</a>
                <a href={`mailto:hello@${company.domain}`} className="block font-body text-fg-muted hover:text-acid transition-colors">hello@{company.domain}</a>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-fg-dim mb-2">Studio</p>
                <address className="not-italic font-body text-sm text-fg-muted leading-relaxed">
                  {company.address.line1}<br />{company.address.line2}<br />{company.address.city}, {company.address.country}
                </address>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right — form */}
        <div className="lg:col-span-7">
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="card p-10 h-full flex flex-col justify-center"
            >
              <div className="h-12 w-12 rounded-full bg-acid/15 text-acid grid place-items-center mb-6">
                <HiArrowRight className="rotate-[-45deg]" size={22} />
              </div>
              <h3 className="font-display font-bold text-2xl">Thanks, message received.</h3>
              <p className="mt-3 font-body text-fg-muted max-w-[42ch]">
                We&rsquo;ll be in touch shortly. For anything urgent, call {company.phone}.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="card p-6 md:p-8">
              {/* honeypot — hidden from users, catches bots */}
              <input
                type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
                value={form.website} onChange={set('website')}
                className="absolute -left-[9999px] h-px w-px opacity-0" style={{ position: 'absolute' }}
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block font-body text-xs text-fg-dim mb-2">Name</label>
                  <input id="name" className={field} value={form.name} onChange={set('name')} placeholder="Your name" />
                  {errors.name && <p className="mt-1.5 text-xs text-acid">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="company" className="block font-body text-xs text-fg-dim mb-2">Company / Agency</label>
                  <input id="company" className={field} value={form.company} onChange={set('company')} placeholder="Optional" />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="email" className="block font-body text-xs text-fg-dim mb-2">Email</label>
                <input id="email" type="email" className={field} value={form.email} onChange={set('email')} placeholder="you@company.com" />
                {errors.email && <p className="mt-1.5 text-xs text-acid">{errors.email}</p>}
              </div>
              <div className="mt-4">
                <label htmlFor="type" className="block font-body text-xs text-fg-dim mb-2">Project type</label>
                <select id="type" className={field} value={form.type} onChange={set('type')}>
                  {PROJECT_TYPES.map((t) => <option key={t} value={t} className="bg-ink-800">{t}</option>)}
                </select>
              </div>
              <div className="mt-4">
                <label htmlFor="message" className="block font-body text-xs text-fg-dim mb-2">Project</label>
                <textarea id="message" rows={4} className={`${field} resize-none`} value={form.message} onChange={set('message')} placeholder="What are you planning, and when?" />
                {errors.message && <p className="mt-1.5 text-xs text-acid">{errors.message}</p>}
              </div>

              {status === 'error' && (
                <p className="mt-4 text-sm text-acid">Something went wrong, please email hello@{company.domain}.</p>
              )}

              <button type="submit" disabled={status === 'sending'} className="btn-primary mt-6 w-full sm:w-auto disabled:opacity-60">
                {status === 'sending' ? 'Sending…' : <>Send message <HiArrowRight /></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
