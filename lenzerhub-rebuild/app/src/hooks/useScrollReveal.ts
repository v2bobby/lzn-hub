import { useEffect, useRef } from "react";

/**
 * Adds `is-visible` once an element enters the viewport. Reveals immediately
 * when the visitor prefers reduced motion, and disconnects after firing.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options?: { threshold?: number; delayMs?: number },
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduced || typeof IntersectionObserver === "undefined") {
      node.classList.add("is-visible");
      return;
    }

    if (options?.delayMs) {
      node.style.transitionDelay = `${options.delayMs}ms`;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.disconnect();
          }
        }
      },
      { threshold: options?.threshold ?? 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options?.threshold, options?.delayMs]);

  return ref;
}
