"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Briefcase,
  Check,
  LayoutGrid,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const EASE = [0.22, 1, 0.36, 1] as const;

interface Phase {
  index: string;
  title: string;
  icon: LucideIcon;
  intro?: string;
  items: string[];
}

const PHASES: Phase[] = [
  {
    index: "01",
    title: "Sonar Wallet",
    icon: Wallet,
    items: [
      "Finish new UI/front end design",
      "Connect front end to back end + final touches",
      "Community beta testing",
      "Full release",
      "Host community giveaways & partnership demos",
    ],
  },
  {
    index: "02",
    title: "Sonar Hub",
    icon: LayoutGrid,
    intro: "Deliver a Web3 dashboard to the community that:",
    items: [
      "Enables SONAR ID online security logins",
      "Allows you to tailor your personal Web3 experience",
      "Allows you to add TG bots as essential crypto tools",
    ],
  },
  {
    index: "03",
    title: "Sonar SaaS",
    icon: Briefcase,
    items: [
      "Establish a non Web3 focused business venture",
      "Build a specific software within SONAR Hub",
      "Land first paying clients",
      "Start $SONAR buyback and burn mechanism from revenue generated",
    ],
  },
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

export default function SonarRoadmap() {
  const reduced = usePrefersReducedMotion();
  const [horizontal, setHorizontal] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const craftRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLSpanElement>(null);
  const blocksRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const numeralRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const wipeRef = useRef<HTMLDivElement>(null);
  const craftPulseRef = useRef<HTMLDivElement>(null);
  const stampTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const missionIvRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseRef = useRef(0);
  const finaleRef = useRef(false);
  const missionScramblingRef = useRef(false);
  const [activePhase, setActivePhase] = useState(0);
  const [stamp, setStamp] = useState<number | null>(null);
  const [finale, setFinale] = useState(false);

  useEffect(
    () => () => {
      if (stampTimerRef.current) clearTimeout(stampTimerRef.current);
      if (missionIvRef.current) clearInterval(missionIvRef.current);
    },
    []
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setHorizontal(mq.matches && !reduced);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduced]);

  useEffect(() => {
    if (!horizontal) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const scrambleMission = (target: string) => {
        if (missionIvRef.current) clearInterval(missionIvRef.current);
        missionScramblingRef.current = true;
        let i = 0;
        missionIvRef.current = setInterval(() => {
          i += 1;
          if (missionRef.current) {
            missionRef.current.textContent =
              i >= 8 ? target : String(Math.floor(Math.random() * 100)).padStart(2, "0");
          }
          if (i >= 8) {
            if (missionIvRef.current) clearInterval(missionIvRef.current);
            missionScramblingRef.current = false;
          }
        }, 30);
      };

      const triggerWipe = () => {
        if (!wipeRef.current) return;
        gsap.fromTo(
          wipeRef.current,
          { xPercent: -10, opacity: 1 },
          {
            xPercent: 110,
            duration: 0.55,
            ease: "power2.inOut",
            onComplete: () => {
              if (wipeRef.current) wipeRef.current.style.opacity = "0";
            },
          }
        );
      };

      const runFinale = () => {
        if (craftPulseRef.current) {
          gsap.fromTo(
            craftPulseRef.current,
            { scale: 1 },
            { scale: 2.1, duration: 0.32, yoyo: true, repeat: 3, ease: "power2.inOut" }
          );
        }
        const labels = labelRefs.current.filter((el): el is HTMLSpanElement => Boolean(el));
        if (labels.length) {
          gsap.to(labels, {
            color: "rgba(255,255,255,0.95)",
            duration: 0.4,
            stagger: 0.25,
            ease: "none",
          });
        }
      };

      const setProgress = (p: number) => {
        const clamped = Math.min(1, Math.max(0, p));
        if (fillRef.current) {
          fillRef.current.style.transform = `scaleX(${clamped})`;
        }
        if (craftRef.current) {
          craftRef.current.style.left = `${clamped * 100}%`;
        }
        if (missionRef.current && !missionScramblingRef.current) {
          missionRef.current.textContent = String(
            Math.min(3, 1 + Math.floor(clamped * 3))
          ).padStart(2, "0");
        }
        const blocks = Math.round(clamped * 18);
        if (blocksRef.current) {
          blocksRef.current.textContent =
            "█".repeat(blocks) + "░".repeat(18 - blocks);
        }
        if (pctRef.current) {
          pctRef.current.textContent = `${String(Math.round(clamped * 100)).padStart(3, "0")}%`;
        }

        const phase = Math.min(2, Math.floor(clamped * 3));
        if (phase !== phaseRef.current) {
          const forward = phase > phaseRef.current;
          phaseRef.current = phase;
          setActivePhase(phase);
          if (forward) {
            triggerWipe();
            scrambleMission(String(phase + 1).padStart(2, "0"));
            if (phase > 0) {
              if (stampTimerRef.current) clearTimeout(stampTimerRef.current);
              setStamp(phase);
              stampTimerRef.current = setTimeout(() => setStamp(null), 1600);
            }
          }
        }

        if (trackRef.current) {
          const panelEls = Array.from(trackRef.current.children) as HTMLElement[];
          for (let i = 0; i < panelEls.length; i++) {
            const numeral = numeralRefs.current[i];
            if (!numeral) continue;
            const r = panelEls[i].getBoundingClientRect();
            const offset = r.left + r.width / 2 - window.innerWidth / 2;
            numeral.style.transform = `translateX(${offset * 0.35}px)`;
          }
        }

        if (clamped >= 0.99 && !finaleRef.current) {
          finaleRef.current = true;
          setFinale(true);
          runFinale();
        }
      };

      gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: () => `+=${getDistance()}`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setProgress(self.progress),
          onRefresh: (self) => setProgress(self.progress),
        },
      });

      setProgress(0);
    }, wrapRef);

    return () => ctx.revert();
  }, [horizontal]);

  return (
    <div ref={wrapRef} className="sonar-bg relative overflow-hidden border-t border-white/[0.06]">
      <div
        className={`relative flex flex-col px-6 sm:px-10 lg:px-[7vw] ${
          horizontal ? "lg:h-screen lg:justify-center lg:py-0" : "py-24 md:py-32"
        }`}
      >
        <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: EASE }}
              className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/40"
            >
              {"//"} Roadmap
            </motion.p>
            <h2 className="mt-6 font-display text-[clamp(2.6rem,6vw,5.5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em]">
              <MaskLine delay={0.05} reduced={reduced}>
                Sonar Roadmap
              </MaskLine>
              <MaskLine delay={0.13} reduced={reduced} outlined>
                2025
              </MaskLine>
            </h2>
          </div>

          <div className="hidden shrink-0 text-right font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 lg:block">
            <p>
              Mission <span ref={missionRef}>01</span>/03
            </p>
            <p className="mt-1.5 tracking-[0.35em]">
              <span ref={blocksRef}>░░░░░░░░░░░░░░░░░░</span>
            </p>
            <p className="mt-1.5">
              Progress <span ref={pctRef}>000</span>%
            </p>
          </div>
        </div>

        <div
          ref={trackRef}
          className={`relative z-10 mt-14 flex flex-col ${
            horizontal ? "lg:mt-10 lg:flex-1 lg:flex-row lg:items-center" : ""
          }`}
        >
          {PHASES.map((phase, i) => (
            <motion.div
              key={phase.index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: EASE, delay: i * 0.06 }}
              className={`relative w-full shrink-0 ${
                horizontal
                  ? `lg:w-[52vw] ${i > 0 ? "lg:pl-[7vw]" : ""} ${i === PHASES.length - 1 ? "lg:pr-[10vw]" : ""}`
                  : "border-t border-white/[0.06] first:border-t-0"
              } py-12 lg:py-0`}
            >
              <span
                ref={(el) => {
                  numeralRefs.current[i] = el;
                }}
                aria-hidden="true"
                className="pointer-events-none absolute -top-4 right-0 z-0 grid select-none will-change-transform lg:-top-10"
              >
                <span
                  className="col-start-1 row-start-1 font-display text-[6.5rem] font-black leading-none text-transparent lg:text-[11rem]"
                  style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.10)" }}
                >
                  {phase.index}
                </span>
                <motion.span
                  className="col-start-1 row-start-1 font-display text-[6.5rem] font-black leading-none text-white/[0.07] lg:text-[11rem]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: horizontal && activePhase === i ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  {phase.index}
                </motion.span>
              </span>

              <div className="relative z-10">
                <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                  <phase.icon className="h-3.5 w-3.5" aria-hidden="true" />
                  Phase {phase.index}
                </p>
                <h3 className="mt-4 font-display text-4xl font-black uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {phase.title}
                </h3>
                {phase.intro && (
                  <p className="mt-5 max-w-[52ch] font-mono text-[11px] uppercase leading-[1.9] tracking-[0.12em] text-white/40">
                    {phase.intro}
                  </p>
                )}
                <ul className="mt-6 divide-y divide-white/[0.08] border-y border-white/[0.08]">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-center gap-4 py-3.5">
                      <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-white/50" aria-hidden="true" />
                      <span className="font-mono text-xs uppercase tracking-[0.12em] text-white/70 sm:text-sm">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 mt-14 hidden pb-12 lg:block">
          <div className="relative h-px w-full bg-white/10">
            <div
              ref={fillRef}
              className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-white/60"
            />
            {[0, 33.333, 66.667, 100].map((p) => (
              <span
                key={p}
                aria-hidden="true"
                className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-white/35"
                style={{ left: `${p}%` }}
              />
            ))}
            <div ref={craftRef} className="absolute top-1/2" style={{ left: "0%" }}>
              <div
                ref={craftPulseRef}
                className="-ml-1 -mt-1 h-2 w-2 rounded-full bg-white"
              />
            </div>
          </div>
          <div className="mt-3 flex justify-between font-mono text-[9px] uppercase tracking-[0.25em] text-white/30">
            {["01 Wallet", "02 Hub", "03 SaaS"].map((label, i) => (
              <span
                key={label}
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {horizontal && !reduced && (
          <div
            ref={wipeRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-40 opacity-0"
          >
            <div className="absolute inset-y-0 left-0 w-[140px] bg-white/[0.05]">
              <span className="absolute left-0 top-0 h-full w-[2px] bg-white/80" />
            </div>
          </div>
        )}

        <AnimatePresence>
          {stamp !== null && (
            <motion.div
              key={stamp}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="absolute bottom-24 right-[7vw] z-30 hidden lg:block"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-[#0a0b0f]/90 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/85">
                <Check className="h-3 w-3" aria-hidden="true" />
                Phase 0{stamp + 1} reached
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {finale && (
            <div className="absolute bottom-24 left-1/2 z-30 hidden -translate-x-1/2 lg:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-black">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  Roadmap 2025 · Locked in
                </span>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
