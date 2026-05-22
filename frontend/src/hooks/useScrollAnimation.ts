import { useEffect, useRef, useState } from "react";

// Shared IntersectionObserver — one observer for all animated elements
// Much more efficient than creating one per element
let sharedObserver: IntersectionObserver | null = null;
const callbacks = new Map<Element, () => void>();

const getObserver = () => {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cb = callbacks.get(entry.target);
            if (cb) {
              cb();
              callbacks.delete(entry.target);
              sharedObserver?.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    );
  }
  return sharedObserver;
};

export const useScrollAnimation = (_threshold = 0.05) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Already in viewport on mount
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      setVisible(true);
      return;
    }

    const observer = getObserver();
    callbacks.set(el, () => setVisible(true));
    observer.observe(el);

    return () => {
      callbacks.delete(el);
      observer.unobserve(el);
    };
  }, []);

  return { ref, visible };
};
