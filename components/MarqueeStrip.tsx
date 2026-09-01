"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PHRASE = "SONAR — WEB3 IDENTITY — ";

export function MarqueeStrip() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    if (reducedMotion || !track) return;

    const tween = gsap.to(track, { xPercent: -50, duration: 26, ease: "none", repeat: -1 });
    const st = ScrollTrigger.create({
      trigger: track,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const timeScale = gsap.utils.clamp(-4, 4, 1 + self.getVelocity() / 800);
        gsap.to(tween, { timeScale, duration: 0.4, ease: "power2.out", overwrite: true });
      },
    });
    return () => {
      st.kill();
      tween.kill();
    };
  }, [reducedMotion]);

  const row = PHRASE.repeat(6);

  return (
    <div className="relative overflow-hidden py-14 sm:py-20" aria-hidden>
      <div
        ref={trackRef}
        className="flex w-max whitespace-nowrap text-[64px] font-semibold leading-none tracking-tight sm:text-[96px]"
        style={{ WebkitTextStroke: "1px rgba(255,255,255,0.13)", color: "transparent" }}
      >
        <span>{row}</span>
        <span>{row}</span>
      </div>
    </div>
  );
}
