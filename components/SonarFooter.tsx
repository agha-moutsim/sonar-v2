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
import { ArrowUpRight } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const EASE = [0.22, 1, 0.36, 1] as const;

const FOOTER_LINKS: { label: string; href: string }[] = [
  { label: "Claim a SONAR ID", href: "#sonar-id-claim" },
  { label: "SONAR Wallet", href: "#sonar-wallet" },
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Team", href: "#team" },
];

const TAGLINE =
  "SONAR is building solutions to make Web3 accessible and secure for everyone.";

const quadX = (t: number) =>
  (1 - t) * (1 - t) * 0.3 + 2 * (1 - t) * t * 0.6 + t * t * 1.08;
const quadY = (t: number) =>
  (1 - t) * (1 - t) * 0.62 + 2 * (1 - t) * t * 0.1 + t * t * 0.16;

export default function SonarFooter() {
  const reduced = usePrefersReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);
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
    <footer ref={sectionRef} className="sonar-bg edge-fade-top-magenta relative w-full overflow-hidden">
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
            <span className="inline-flex overflow-hidden pb-[0.06em]">
              {"Got Questions?".split("").map((ch, i) => (
                <motion.span
                  key={i}
                  className="inline-block will-change-transform"
                  initial={reduced ? { opacity: 0 } : { y: "112%", rotate: 9 }}
                  whileInView={reduced ? { opacity: 1 } : { y: "0%", rotate: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.85, ease: EASE, delay: 0.035 * i }}
                >
                  {ch === " " ? "\u00A0" : ch}
                </motion.span>
              ))}
            </span>
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-5"
          >
            <div className="tag">Community opens with the Hub — roadmap has the dates</div>
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

          <div className="flex flex-wrap gap-x-10 gap-y-3 lg:justify-end">
            {FOOTER_LINKS.map((link, li) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.05 * li }}
                className="group inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors duration-300 hover:text-white"
              >
                {link.label}
                <ArrowUpRight
                  className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-70"
                  aria-hidden="true"
                />
              </motion.a>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-14 flex w-full max-w-[1440px] items-center justify-between border-t border-white/[0.06] py-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/25">
            © {new Date().getFullYear()} SONAR — All rights reserved
          </p>
          <p className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-white/25 sm:block">
            End of transmission
          </p>
        </div>

        <div aria-hidden="true" className="relative mt-[4vw] h-[12vw] overflow-hidden">
          {reduced ? (
            <div className="absolute inset-x-0 top-0 flex justify-center font-display text-[17vw] font-black uppercase leading-[0.8] tracking-[-0.05em] text-white">
              SONAR
            </div>
          ) : (
            <motion.div
              className="absolute inset-x-0 top-0 flex justify-center"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "0px 0px -2% 0px" }}
            >
              {"SONAR".split("").map((letter, i) => {
                const isHovered = hovered === i;
                const dist = hovered === null ? 99 : Math.abs(i - hovered);
                const dip =
                  dist === 0 ? "34%" : dist === 1 ? "-8%" : dist === 2 ? "4%" : "0%";
                return (
                  <span key={i} className="inline-block overflow-hidden pb-[0.06em]">
                    <motion.span
                      className="inline-block will-change-transform"
                      custom={i}
                      variants={{
                        hidden: { y: "115%" },
                        show: (d: number) => ({
                          y: "0%",
                          transition: { duration: 1, ease: EASE, delay: 0.09 * d },
                        }),
                      }}
                    >
                      <motion.span
                        className={`inline-block cursor-default font-display text-[17vw] font-black uppercase leading-[0.8] tracking-[-0.05em] will-change-transform ${
                          isHovered ? "text-transparent" : "text-white"
                        }`}
                        style={
                          isHovered
                            ? { WebkitTextStroke: "2px rgba(255,255,255,0.9)" }
                            : undefined
                        }
                        animate={{ y: dip, rotate: isHovered ? 5 : 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 17 }}
                        onHoverStart={() => setHovered(i)}
                        onHoverEnd={() =>
                          setHovered((cur) => (cur === i ? null : cur))
                        }
                      >
                        {letter}
                      </motion.span>
                    </motion.span>
                  </span>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </footer>
  );
}
