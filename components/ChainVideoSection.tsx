"use client";

import { useRef } from "react";
import { FlipText } from "@/components/ui/flip-text";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

export function ChainVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="chains"
      className="sonar-bg relative w-full overflow-hidden py-16 text-center sm:py-24"
    >
      <h2 className="px-4 font-bold leading-[1.05] tracking-tight">
        <FlipText
          className="heading-blend max-w-full text-[clamp(2.5rem,8vw,7rem)]"
          loop={!prefersReducedMotion}
          duration={2.6}
        >
          One Name. Multiple Chains.
        </FlipText>
      </h2>

      <div className="mx-auto mt-10 w-full max-w-4xl px-4 sm:mt-14 sm:px-8">
        <video
          ref={videoRef}
          className="block aspect-video w-full"
          src="/videos/crypto-ecosystem.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>
    </section>
  );
}

export default ChainVideoSection;
