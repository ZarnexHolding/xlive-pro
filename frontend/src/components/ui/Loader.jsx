import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import xliveLogo from '../../assets/Xlive-logo-trans.png'

const EASE_LUXURY = [0.16, 1, 0.3, 1]
const EXIT_DELAY_MS = 220
const EXIT_DURATION_MS = 700

export default function Loader({ ready = false, onComplete }) {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (ready) return undefined

    const interval = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 94) return current
        const next = current + Math.random() * 4 + 1
        return Math.min(94, Math.floor(next))
      })
    }, 90)

    return () => window.clearInterval(interval)
  }, [ready])

  useEffect(() => {
    if (!ready) return undefined

    setProgress(100)

    const doneTimer = window.setTimeout(() => {
      setDone(true)
    }, EXIT_DELAY_MS)

    const completeTimer = window.setTimeout(() => {
      onComplete?.()
    }, EXIT_DELAY_MS + EXIT_DURATION_MS)

    return () => {
      window.clearTimeout(doneTimer)
      window.clearTimeout(completeTimer)
    }
  }, [onComplete, ready])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.7,
            ease: EASE_LUXURY,
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at center, rgba(232,69,48,0.08) 0%, transparent 70%)',
            }}
          />

          <div className="relative flex flex-col items-center">
            <motion.img
              src={xliveLogo}
              alt="XLIVE"
              className="w-[160px] md:w-[190px] object-contain mb-12"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                ease: EASE_LUXURY,
              }}
            />

            <div className="w-52 md:w-72 flex items-center justify-between mb-3">
              <span className="text-[9px] uppercase tracking-[0.28em] text-white/25">
                Loading
              </span>

              <motion.span
                className="text-[9px] uppercase tracking-[0.18em] text-[#E84530]"
                key={progress}
              >
                {progress}%
              </motion.span>
            </div>

            <div className="relative w-52 md:w-72 h-[2px] bg-white/[0.06] overflow-hidden rounded-full">
              <motion.div
                className="absolute inset-y-0 left-0 bg-[#E84530]"
                animate={{
                  width: `${progress}%`,
                }}
                transition={{
                  ease: 'easeOut',
                  duration: 0.25,
                }}
              />

              <motion.div
                className="absolute top-1/2 -translate-y-1/2 h-4 w-10 bg-[#E84530]/40 blur-xl"
                animate={{
                  left: `calc(${progress}% - 20px)`,
                }}
                transition={{
                  ease: 'easeOut',
                  duration: 0.25,
                }}
              />
            </div>

            <motion.p
              className="mt-6 text-[9px] tracking-[0.3em] uppercase text-white/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.4,
                duration: 1,
              }}
            >
              Event Production & Technologies
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
