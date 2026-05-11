import { useEffect, useRef } from 'react';

export const useScrollReveal = () => {
  const observerRef = useRef(null);

  useEffect(() => {
    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          // Stop observing once revealed for performance
          observerRef.current?.unobserve(entry.target);
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px',
    });

    const observeAll = () => {
      document
        .querySelectorAll('.sr:not(.in), .sr-l:not(.in), .sr-r:not(.in)')
        .forEach((el) => observerRef.current?.observe(el));
    };

    // Observe initially
    observeAll();

    // Re-observe when DOM changes (React renders new elements)
    const mutation = new MutationObserver(() => {
      // Debounce slightly to batch React renders
      requestAnimationFrame(observeAll);
    });

    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      observerRef.current?.disconnect();
      mutation.disconnect();
    };
  }, []);
};