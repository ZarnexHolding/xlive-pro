import { useEffect, useRef, useState } from 'react'

/*
 * Performance-first background video.
 *
 * The poster is a real <img> (it is the LCP element and paints immediately);
 * the <video> gets its source only after the page has loaded and the browser
 * is idle, and only if the user has not asked for reduced motion or data
 * saving. It fades in once it can play, and pauses whenever it leaves the
 * viewport so it never burns CPU off-screen.
 *
 *   <LazyVideo
 *     poster="/images/hero-poster.webp"
 *     sources={{ desktop: '/videos/hero-1080.mp4', mobile: '/videos/hero-720.mp4' }}
 *     priority           // poster is the LCP: eager + fetchpriority=high
 *   />
 *
 * `when="visible"` (default) waits until the element is near the viewport;
 * `when="load"` starts as soon as the page is loaded (hero).
 */
export default function LazyVideo({
  poster,
  posterAlt = '',
  sources,
  priority = false,
  when = 'visible',
  className = '',
  videoClassName = '',
}) {
  const videoRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [src, setSrc] = useState(null)

  // Decide whether and when to attach the source.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const saveData = navigator.connection?.saveData
    if (mq.matches || saveData) return

    let cancelled = false
    const pick = () => (window.innerWidth >= 1024 ? sources.desktop : sources.mobile || sources.desktop)
    const attach = () => {
      if (cancelled) return
      const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200))
      idle(() => !cancelled && setSrc(pick()))
    }

    const afterLoad = (cb) => {
      if (document.readyState === 'complete') cb()
      else window.addEventListener('load', cb, { once: true })
    }

    let io
    if (when === 'load') {
      afterLoad(attach)
    } else {
      const el = videoRef.current
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io.disconnect()
            afterLoad(attach)
          }
        },
        { rootMargin: '400px 0px' },
      )
      if (el) io.observe(el)
    }
    return () => {
      cancelled = true
      io?.disconnect()
    }
  }, [sources, when])

  // Pause off-screen, resume in view.
  useEffect(() => {
    const v = videoRef.current
    if (!v || !src) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.05 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [src])

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <img
        src={poster}
        alt={posterAlt}
        className="absolute inset-0 h-full w-full object-cover"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        width={1600}
        height={900}
      />
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${ready ? 'opacity-100' : 'opacity-0'} ${videoClassName}`}
        src={src || undefined}
        muted
        loop
        playsInline
        autoPlay
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        onCanPlay={() => setReady(true)}
      />
    </div>
  )
}
