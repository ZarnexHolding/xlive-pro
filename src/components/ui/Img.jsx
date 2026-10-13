/*
 * Responsive image for /images/<name>.jpg assets.
 * Serves the WebP variants generated alongside every JPG (<name>.webp at
 * 1600w max, <name>-800.webp at 800w) with the JPG as the fallback, and always
 * carries width/height so the browser reserves space (no layout shift).
 *
 *   <Img src="/images/sagp-bridge.jpg" alt="…" sizes="(min-width:1024px) 50vw, 100vw" />
 *
 * `priority` marks the LCP candidate (eager + fetchpriority=high).
 * Regenerate variants with scripts/images.py after adding a photo, and add its
 * dimensions to DIMS below.
 */
const DIMS = {
  'dakar-bivouac': [1440, 1080],
  'dakar-shop': [2000, 1125],
  'dakar-tent-sunset': [1664, 936],
  'f1-led-detail': [1210, 681],
  'ferrari-fest-jeddah': [1664, 936],
  'fortinet-corporate': [1440, 1080],
  'gtrace-corniche-fanzone': [2000, 1500],
  'hero-jeddah-night': [1613, 908],
  'jeddah-bridge-day': [2000, 1125],
  'jeddah-bridge-night': [2000, 1125],
  'katusha-aisle': [1280, 720],
  'katusha-render': [1536, 864],
  'katusha-stand': [1280, 720],
  'sagp-bridge': [2000, 1125],
  'sagp-dusk-circuit': [2000, 1125],
  'sagp-grandstand-day': [2000, 1125],
  'sagp-grandstand-night': [2000, 1125],
  'sagp-lightbox-tunnel': [2000, 1125],
  'tent-branding-row': [2000, 1125],
}

export default function Img({ src, alt = '', sizes = '100vw', className = '', priority = false, style, ...rest }) {
  const m = /^\/images\/([a-z0-9-]+)\.jpg$/i.exec(src || '')
  const name = m?.[1]
  const dims = name && DIMS[name]
  const loading = priority ? 'eager' : 'lazy'

  if (!name || !dims) {
    return <img src={src} alt={alt} className={className} loading={loading} decoding="async" style={style} {...rest} />
  }

  const [w, h] = dims
  const srcSet = w >= 800 ? `/images/${name}-800.webp 800w, /images/${name}.webp ${Math.min(w, 1600)}w` : `/images/${name}.webp ${w}w`

  return (
    <picture>
      <source type="image/webp" srcSet={srcSet} sizes={sizes} />
      <img
        src={src}
        alt={alt}
        width={w}
        height={h}
        className={className}
        loading={loading}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
        style={style}
        {...rest}
      />
    </picture>
  )
}
