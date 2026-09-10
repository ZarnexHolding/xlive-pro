/*
 * Self-hosted SVG country flag. Renders /flags/<iso2>.svg (copied from the
 * flag-icons set into public/flags). Consistent on every OS — unlike emoji
 * flags, which Windows can't display. The subtle ring keeps white/light flags
 * visible on the dark UI.
 */
export default function Flag({ code, className = '' }) {
  return (
    <img
      src={`/flags/${code.toLowerCase()}.svg`}
      alt=""
      aria-hidden="true"
      loading="lazy"
      width={18}
      height={14}
      className={`inline-block h-3.5 w-[18px] shrink-0 rounded-[2px] object-cover ring-1 ring-white/15 ${className}`}
    />
  )
}
