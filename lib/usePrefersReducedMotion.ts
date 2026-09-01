"use client";

import { useEffect, useState } from "react";

/**
 * Returns true if the user's OS/browser has requested reduced motion.
 * Used to gate GSAP ScrollTrigger choreography and the mouse-parallax
 * effect on the workflow visual.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const handler = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  return reduced;
}
