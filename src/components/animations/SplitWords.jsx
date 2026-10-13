/*
 * Splits lines of text into masked words so GSAP can animate each word
 * (`.split-word`) sliding up out of its line mask. Renders plain, crawlable
 * text: every word stays in the DOM in reading order.
 *
 *   <SplitWords lines={['Your vision,', 'engineered', 'to perform.']} />
 */
export default function SplitWords({ lines, className = '', wordClass = '' }) {
  return lines.map((line, li) => (
    <span key={li} className={`split-line block overflow-hidden ${className}`}>
      {line.split(' ').map((w, wi) => (
        <span key={wi} className="inline-block overflow-hidden align-top">
          <span className={`split-word inline-block will-change-transform ${wordClass}`}>
            {w}
            {wi < line.split(' ').length - 1 ? ' ' : ''}
          </span>
        </span>
      ))}
    </span>
  ))
}
