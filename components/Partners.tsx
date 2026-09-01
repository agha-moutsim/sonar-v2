"use client";

import React from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const EASE = [0.22, 1, 0.36, 1] as const;

const LOGOS = [
  { src: "/partners/1.png", alt: "Partner logo" },
  { src: "/partners/2.webp", alt: "Partner logo" },
  { src: "/partners/3.png", alt: "Partner logo" },
  { src: "/partners/4.png", alt: "Partner logo" },
  { src: "/partners/6.webp", alt: "Partner logo" },
  { src: "/partners/7.png", alt: "Partner logo" },
  { src: "/partners/8.webp", alt: "Partner logo" },
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
        style={outlined ? { WebkitTextStroke: "1.5px rgba(255,255,255,0.28)" } : undefined}
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
          style={outlined ? { WebkitTextStroke: "1.5px rgba(255,255,255,0.28)" } : undefined}
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

function Logo({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex shrink-0 items-center justify-center px-8 sm:px-12">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        draggable={false}
        className="h-9 w-auto object-contain opacity-45 transition-[opacity,transform] duration-500 hover:scale-105 hover:opacity-100 sm:h-11"
      />
    </div>
  );
}

export default function Partners() {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="sonar-bg relative w-full overflow-hidden border-t border-white/[0.06] py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-6 text-center sm:px-10 lg:px-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/40"
        >
          {"//"} Partners
        </motion.p>

        <h2 className="mt-6 font-display text-[clamp(2.6rem,6vw,5.5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em]">
          <MaskLine delay={0.05} reduced={reduced}>
            Our
          </MaskLine>
          <MaskLine delay={0.13} reduced={reduced} outlined>
            Partners
          </MaskLine>
        </h2>
      </div>

      <div className="mt-14 flex flex-col gap-8 lg:mt-16">
        <div className="marquee-row overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div
            className="marquee-track flex w-max"
            style={
              reduced
                ? undefined
                : { animation: "marquee-left 48s linear infinite" }
            }
          >
            {[0, 1].map((copy) => (
              <div key={copy} className="flex w-max" aria-hidden={copy === 1}>
                {LOGOS.map((logo, i) => (
                  <Logo key={`${copy}-${i}`} src={logo.src} alt={copy === 0 ? `Partner ${i + 1}` : ""} />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="marquee-row overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div
            className="marquee-track flex w-max"
            style={
              reduced
                ? undefined
                : { animation: "marquee-right 56s linear infinite" }
            }
          >
            {[0, 1].map((copy) => (
              <div key={copy} className="flex w-max" aria-hidden={copy === 1}>
                {[...LOGOS].reverse().map((logo, i) => (
                  <Logo key={`${copy}-${i}`} src={logo.src} alt={copy === 0 ? `Partner ${i + 1}` : ""} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
