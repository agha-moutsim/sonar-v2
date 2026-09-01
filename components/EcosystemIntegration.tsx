"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { FileCode, ArrowRight } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { CircularGallery } from "@/components/ui/circular-gallery";

const EASE = [0.22, 1, 0.36, 1] as const;

const GALLERY_IMAGES = [
  "/gallery/1.webp",
  "/gallery/2.webp",
  "/gallery/3.png",
  "/gallery/4.webp",
  "/gallery/5.webp",
  "/gallery/6.webp",
  "/gallery/7.webp",
  "/gallery/8.webp",
  "/gallery/9.webp",
  "/gallery/10.webp",
];

function MaskLine({
  children,
  delay,
  reduced,
  outlined = false,
}: {
  children: React.ReactNode;
  delay: number;
  reduced: boolean;
  outlined?: boolean;
}) {
  if (reduced) {
    return (
      <motion.span
        className={`block ${outlined ? "text-transparent" : "text-white"}`}
        style={outlined ? { WebkitTextStroke: "1.2px rgba(255,255,255,0.38)" } : undefined}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay }}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
      <motion.span
        className="block"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.span
          className={`block will-change-transform ${outlined ? "text-transparent" : "text-white"}`}
          style={outlined ? { WebkitTextStroke: "1.2px rgba(255,255,255,0.38)" } : undefined}
          custom={delay}
          variants={{
            hidden: { y: "115%" },
            show: (d: number) => ({
              y: "0%",
              transition: { duration: 0.9, ease: EASE, delay: d },
            }),
          }}
        >
          {children}
        </motion.span>
      </motion.span>
    </span>
  );
}

export default function EcosystemIntegration() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const sx = useSpring(mx, { stiffness: 140, damping: 30, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 140, damping: 30, mass: 0.5 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left - 450);
    my.set(e.clientY - rect.top - 450);
  };

  return (
    <section
      id="ecosystem"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="sonar-bg group relative w-full overflow-hidden border-t border-white/[0.06] py-24 md:py-36"
    >
      <motion.div
        aria-hidden="true"
        className="absolute left-0 top-0 h-[900px] w-[900px] rounded-full pointer-events-none opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          x: sx,
          y: sy,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 65%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-6xl mx-auto px-4 sm:px-6 md:px-12">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/40"
        >
          {"//"} Ecosystem Integration
        </motion.p>

        <h2 className="mt-10 font-display text-[clamp(2.4rem,7.2vw,6.75rem)] font-black uppercase leading-[0.93] tracking-[-0.03em]">
          <MaskLine delay={0.05} reduced={reduced}>
            Sonar IDs are easily
          </MaskLine>
          <MaskLine delay={0.12} reduced={reduced}>
            integrated into any
          </MaskLine>
          <MaskLine delay={0.19} reduced={reduced} outlined>
            Wallet, DEX, CEX
          </MaskLine>
          <MaskLine delay={0.26} reduced={reduced} outlined>
            or Gaming Ecosystem
          </MaskLine>
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
          className="mt-12 max-w-2xl space-y-4 text-sm sm:text-base leading-[1.85] text-white/55"
        >
          <p>
            SONAR strives to accelerate <span className="text-white">mass adoption</span> by
            making the transaction experience straightforward and simple. Using{" "}
            <span className="text-white">SONAR technology</span>, we allow any project that
            incorporates complicated addresses to simplify the process with{" "}
            <span className="text-white">unique usernames</span>. We want to greatly reduce any
            mistakes around <span className="text-white">wallets, networks</span>, and the
            general complexity that comes with learning cryptocurrencies.
          </p>
          <p>
            If you have a project which you think could benefit from{" "}
            <span className="text-white">integration of SONAR IDs</span>, please{" "}
            <span className="text-white">reach out to a team member</span>. Or alternatively you
            can check out our robust <span className="text-white">integration documentation</span>{" "}
            below.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.42 }}
          className="mt-12"
        >
          <a
            href="#integration-docs"
            className="group/btn inline-flex items-center gap-2.5 rounded-full border border-white/25 px-8 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black active:scale-95"
          >
            <FileCode className="h-4 w-4" aria-hidden="true" />
            <span>Integration Docs</span>
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1"
              aria-hidden="true"
            />
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.1, ease: EASE }}
        className="relative mt-16 h-[580px] w-full md:mt-20 md:h-[680px]"
      >
        <CircularGallery
          images={GALLERY_IMAGES}
          count={56}
          radius={460}
          tilt={45}
          itemWidth={64}
          itemHeight={86}
        />
      </motion.div>
    </section>
  );
}
