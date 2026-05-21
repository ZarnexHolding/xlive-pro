import clsx from 'clsx'

export function Section({ children, className = '', id = '', dark = false }) {
  return (
    <section
      id={id}
      className={clsx(
        'relative w-full',
        dark ? 'bg-bg-secondary' : 'bg-bg',
        className
      )}
    >
      {children}
    </section>
  )
}

export function Container({ children, className = '' }) {
  return (
    <div className={clsx('w-full max-w-7xl mx-auto px-5 md:px-10 lg:px-16', className)}>
      {children}
    </div>
  )
}

export function SectionHeader({ label, title, description, align = 'left', className = '' }) {
  return (
    <div
      className={clsx(
        'mb-16 md:mb-20',
        align === 'center' && 'text-center',
        className
      )}
    >
      {label && (
        <div className={clsx('flex items-center gap-3 mb-5', align === 'center' && 'justify-center')}>
          <span className="w-8 h-px bg-accent" />
          <span className="section-label">{label}</span>
        </div>
      )}
      {title && (
        <h2
          className={clsx(
            'section-heading text-3xl md:text-4xl lg:text-5xl mb-5',
            align === 'center' && 'mx-auto',
            align !== 'center' && 'max-w-2xl'
          )}
        >
          {title}
        </h2>
      )}
      {description && (
        <p
          className={clsx(
            'text-cream-muted leading-relaxed text-base md:text-lg',
            align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-xl'
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}
