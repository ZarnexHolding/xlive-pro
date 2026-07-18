import { Link } from 'react-router-dom'

/*
 * Button / link primitive. variant: 'primary' (acid), 'outline', 'ghost'.
 * Renders <a> for hrefs, <Link> for `to`, <button> otherwise.
 */
const base =
  'inline-flex items-center justify-center gap-2 rounded-xs font-body font-semibold text-sm tracking-wide transition-all duration-300 ease-expo select-none'

const sizes = {
  md: 'px-7 py-3.5',
  lg: 'px-8 py-4 text-[15px]',
  sm: 'px-5 py-2.5 text-[13px]',
}

const variants = {
  primary: 'bg-acid text-ink-950 hover:-translate-y-0.5 hover:shadow-glow-acid',
  outline: 'border border-line-strong text-fg hover:border-fg hover:bg-white/5',
  dark: 'bg-ink-950 text-fg hover:-translate-y-0.5 hover:bg-ink-900',
  ghost: 'text-fg-muted hover:text-fg',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  to,
  className = '',
  children,
  ...props
}) {
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`
  if (to) return <Link to={to} className={cls} {...props}>{children}</Link>
  if (href) return <a href={href} className={cls} {...props}>{children}</a>
  return <button className={cls} {...props}>{children}</button>
}
