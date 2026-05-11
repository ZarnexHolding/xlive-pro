import { useEffect, useRef } from 'react';

export const useParticleCanvas = (active) => {
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = document.getElementById('BGCANVAS');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const pts = Array.from({ length: 80 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.2 + 0.3,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < pts.length; i++) {
        // Draw connections
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(0,200,255,${0.08 * (1 - d / 130)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Update position
        pts[i].x += pts[i].vx;
        pts[i].y += pts[i].vy;
        if (pts[i].x < 0) pts[i].x = W;
        if (pts[i].x > W) pts[i].x = 0;
        if (pts[i].y < 0) pts[i].y = H;
        if (pts[i].y > H) pts[i].y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(pts[i].x, pts[i].y, pts[i].r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,200,255,.35)';
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      window.removeEventListener('resize', resize);
    };
  }, [active]);
};