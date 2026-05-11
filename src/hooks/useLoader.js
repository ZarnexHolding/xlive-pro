import { useState, useEffect, useCallback, useRef } from 'react';

export const useLoader = () => {
  const [progress, setProgress] = useState(0);
  const [entered, setEntered] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + Math.random() * 2.5 + 0.5, 100);
        if (next >= 100) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return next;
      });
    }, 60);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const enter = useCallback(() => {
    if (progress < 100) return;

    // Clean up any remaining interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Restore body scroll before entering
    document.body.style.overflow = '';

    setEntered(true);
  }, [progress]);

  return { progress, entered, enter };
};