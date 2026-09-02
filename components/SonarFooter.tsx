"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Send, X } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const EASE = [0.22, 1, 0.36, 1] as const;

const FOOTER_LINKS: { title: string; links: string[] }[] = [
  { title: "Resources", links: ["Gitbook", "Integration Docs", "Audits"] },
  { title: "SONAR Products", links: ["SONAR IDs", "SONAR Hub", "SONAR Wallet", "Staking"] },
  { title: "About", links: ["Team", "Merchandise", "Contact Us"] },
  { title: "Social Media", links: ["X", "Telegram"] },
];

const TAGLINE =
  "SONAR is building solutions to make Web3 accessible and secure for everyone.";

const quadX = (t: number) =>
  (1 - t) * (1 - t) * 0.3 + 2 * (1 - t) * t * 0.6 + t * t * 1.08;
const quadY = (t: number) =>
  (1 - t) * (1 - t) * 0.62 + 2 * (1 - t) * t * 0.1 + t * t * 0.16;

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

export default function SonarFooter() {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const finaleRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const { scrollYProgress } = useScroll({
    target: finaleRef,
    offset: ["start end", "end end"],
  });
  const smoothed = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.4 });

  const planeX = useTransform(smoothed, (t) => size.w * quadX(t));
  const planeY = useTransform(smoothed, (t) => size.h * quadY(t));
  const planeR = useTransform(smoothed, [0, 0.25, 0.5, 0.75, 1], [-16, -30, -6, 16, 8]);
  const planeS = useTransform(smoothed, [0, 0.5, 1], [0.85, 1.15, 1]);

  useEffect(() => {
    const el = finaleRef.current;
    if (!el) return;
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      ScrollTrigger.refresh();
    }, sectionRef);
    return () => ctx.revert();
  }, [reduced]);

  const trailProgress = reduced ? { pathLength: 1 } : { pathLength: smoothed };

  return (
    <footer ref={sectionRef} className="sonar-bg relative w-full overflow-hidden">
      <div
        ref={finaleRef}
        className="relative flex min-h-[76vh] flex-col justify-center overflow-hidden px-6 pb-10 pt-24 sm:px-10 lg:min-h-[86vh] lg:px-16"
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        >
          <motion.path
            d="M 30 62 Q 60 10 108 16"
            fill="none"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            {...trailProgress}
          />
        </svg>

        {!reduced && (
          <motion.div
            className="absolute left-0 top-0 z-20"
            style={{ x: planeX, y: planeY, rotate: planeR, scale: planeS }}
          >
            <svg
              viewBox="0 0 64 64"
              className="h-12 w-12 lg:h-20 lg:w-20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M60 10 L4 30 L32 36 Z"
                fill="rgba(255,255,255,0.10)"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M60 10 L32 36 L36 54 Z"
                fill="rgba(255,255,255,0.05)"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        )}

        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/40"
          >
            {"//"} Last transmission
          </motion.p>

          <h2 className="mt-6 whitespace-nowrap font-display text-[10vw] font-black uppercase leading-[0.88] tracking-[-0.045em] text-white lg:text-[9vw]">
            <MaskLine delay={0.05} reduced={reduced}>
              Got Questions?
            </MaskLine>
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-5"
          >
            <p className="text-base text-white/60 sm:text-lg">
              Come join our community on Telegram!
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3 font-mono text-xs font-bold uppercase tracking-[0.15em] text-black transition-transform duration-300 hover:scale-[1.04] active:scale-95"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              Join Here
            </a>
          </motion.div>
        </div>
      </div>

      <div className="relative border-t border-white/[0.06] px-6 pb-0 pt-16 sm:px-10 lg:px-16">
        <div className="mx-auto grid w-full max-w-[1440px] gap-12 lg:grid-cols-[1.1fr_2fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <p className="font-display text-3xl font-black uppercase tracking-tight text-white">
              Sonar
            </p>
            <p className="mt-4 max-w-[30ch] text-sm leading-[1.85] text-white/55">{TAGLINE}</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {FOOTER_LINKS.map((column, ci) => (
              <motion.div
                key={column.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.08 * ci }}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                  {column.title}
                </p>
                <ul className="mt-5 space-y-1">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="group inline-flex items-center gap-1.5 py-1.5 text-sm text-white/60 transition-colors duration-300 hover:text-white"
                      >
                        {link}
                        <ArrowUpRight
                          className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-70"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-14 flex w-full max-w-[1440px] items-center justify-between border-t border-white/[0.06] py-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/25">
            © 2025 SONAR — All rights reserved
          </p>
          <p className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-white/25 sm:block">
            End of transmission
          </p>
        </div>

        <div aria-hidden="true" className="relative h-[10.5vw] overflow-hidden">
          <motion.div
            initial={reduced ? { y: "18%" } : { y: "60%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "0px 0px -4% 0px" }}
            transition={{ duration: 1.2, ease: EASE }}
            className="absolute inset-x-0 top-0 flex justify-center font-display text-[15.5vw] font-black uppercase leading-[0.82] tracking-[-0.05em] text-white"
          >
            {"SONAR".split("").map((letter, i) => (
              <span key={i} className="inline-block">
                {letter}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
