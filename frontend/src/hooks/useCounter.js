import { useState, useEffect, useRef } from 'react'

export function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  const startedRef = useRef(false)

  useEffect(() => {
    if (!start || startedRef.current) return
    startedRef.current = true

    const startTime = performance.now()
    const startValue = 0

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3)
    }

    function update(currentTime) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutCubic(progress)
      const current = Math.round(startValue + (target - startValue) * eased)
      setCount(current)

      if (progress < 1) {
        requestAnimationFrame(update)
      }
    }

    requestAnimationFrame(update)
  }, [start, target, duration])

  return count
}
