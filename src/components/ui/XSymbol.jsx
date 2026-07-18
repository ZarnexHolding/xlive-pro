/*
 * XLIVE blade-"X" symbol mark — scalable SVG for icons, accents and motifs.
 * `currentColor` so it inherits text color; pass className for sizing/color.
 */
export default function XSymbol({ className = 'w-8 h-8', title }) {
  return (
    <svg viewBox="0 0 120 110" className={className} fill="currentColor" role={title ? 'img' : 'presentation'} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <path d="M6 16 L44 51 L17 96 L35 96 L58 60 L92 96 L114 96 L71 49 L106 12 L86 12 L60 40 L26 16 Z" />
    </svg>
  )
}

// Repeating acid-green chevron pattern (brand X-motif) as a background layer.
export function XMotif({ className = '', color = '#73F83E', opacity = 0.3 }) {
  const id = 'xchevron-' + color.replace('#', '')
  return (
    <svg className={className} width="100%" height="100%" style={{ opacity }} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id={id} width="46" height="34" patternUnits="userSpaceOnUse">
          <path d="M2 27 L23 8 L44 27 L44 31 L23 14 L2 31 Z" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
