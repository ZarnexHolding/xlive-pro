import { useEffect, useRef } from 'react';

export const useCursor = () => {
  const rafRef = useRef(null);

  useEffect(() => {
    const cur = document.getElementById('CUR');
    const ring = document.getElementById('CRING');
    if (!cur || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      cur.style.left = `${mx}px`;
      cur.style.top = `${my}px`;
    };

    const animRing = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      rafRef.current = requestAnimationFrame(animRing);
    };

    document.addEventListener('mousemove', onMove);
    rafRef.current = requestAnimationFrame(animRing);

    return () => {
      document.removeEventListener('mousemove', onMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);
};