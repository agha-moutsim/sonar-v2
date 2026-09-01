"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PainBadge } from "./PainBadge";
import { ProblemGrid } from "./ProblemGrid";
import { SolutionIntro } from "./SolutionIntro";
import { WorkflowScene } from "./WorkflowScene";
import { FeatureHighlights } from "./FeatureHighlights";
import { MarqueeStrip } from "./MarqueeStrip";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const problemHeadingLines = ["Remove the", "Complexity of Crypto"];

const GLYPHS = "01<>/#*+—";

function ScrambleText({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [out, setOut] = useState(() => text.replace(/[^\s]/g, "\u00A0"));

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now() + delay * 1000;
    const settleDuration = 620;
    const tick = (t: number) => {
      const elapsed = t - start;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      let next = "";
      let done = true;
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === " ") {
          next += " ";
          continue;
        }
        const revealAt = (i / text.length) * settleDuration;
        if (elapsed >= revealAt + 240) {
          next += ch;
        } else {
          done = false;
          next += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }
      if (done) {
        setOut(text);
        return;
      }
      setOut(next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, text, delay]);

  return (
    <span ref={ref} className="block">
      {out}
    </span>
  );
}

export function ProblemSolutionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Cursor spotlight on the black canvas.
  useEffect(() => {
    const section = sectionRef.current;
    const spot = spotRef.current;
    if (reducedMotion || !section || !spot) return;

    const xTo = gsap.quickTo(spot, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(spot, "y", { duration: 0.4, ease: "power3" });
    const move = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      xTo(e.clientX - rect.left);
      yTo(e.clientY - rect.top);
    };
    const enter = () => gsap.to(spot, { opacity: 1, duration: 0.4 });
    const leave = () => gsap.to(spot, { opacity: 0, duration: 0.5 });
    section.addEventListener("pointermove", move);
    section.addEventListener("pointerenter", enter);
    section.addEventListener("pointerleave", leave);
    return () => {
      section.removeEventListener("pointermove", move);
      section.removeEventListener("pointerenter", enter);
      section.removeEventListener("pointerleave", leave);
    };
  }, [reducedMotion]);

  // Velocity skew — content leans with scroll speed and settles back.
  useEffect(() => {
    const el = cardRef.current;
    if (reducedMotion || !el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const skew = gsap.utils.clamp(-1.2, 1.2, self.getVelocity() / -400);
        gsap.to(el, { skewY: skew, duration: 0.6, ease: "power3.out", overwrite: "auto" });
      },
    });
    return () => st.kill();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="sonar-bg w-full px-3 py-10 sm:px-6 sm:py-14" id="home">
      <div
        ref={spotRef}
        className="pointer-events-none absolute left-0 top-0 h-[620px] w-[620px] rounded-full opacity-0"
        style={{
          marginLeft: "-310px",
          marginTop: "-310px",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.02) 35%, transparent 65%)",
        }}
      />

      <div ref={cardRef} className="relative mx-auto max-w-[1120px] overflow-hidden rounded-[22px]">
        {/* Problem section */}
        <div className="relative z-10 mx-auto flex max-w-[560px] flex-col items-center px-6 pt-10 text-center sm:pt-16">
          <h1 className="mt-5 flex flex-col text-[clamp(28px,5vw,46px)] font-medium leading-[1.1] tracking-tight text-white">
            {problemHeadingLines.map((line, i) => (
              <ScrambleText key={line} text={line} delay={0.15 + i * 0.3} />
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="mt-4 max-w-[520px] text-[14px] leading-relaxed text-white/50"
          >
            Crypto is complicated, especially for newcomers. Entering Web3
            often feels overwhelming, causing many to give up before they have
            even begun. Whether it&apos;s juggling hundreds of wallet addresses
            across various chains or dodging the countless scams daily, crypto
            can seem intimidating. This complexity is hindering the mainstream
            adoption of Web3. Simplification is essential, and that&apos;s
            where SONAR comes in.
          </motion.p>
        </div>

        <div className="px-4 sm:px-8">
          <ProblemGrid />
        </div>

        <MarqueeStrip />

        <div className="h-10 sm:h-16" />

        {/* Solution section */}
        <div id="features" className="relative">
          <SolutionIntro />
          <WorkflowScene />

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-16 max-w-[520px] px-6 text-center text-[16px] text-white/55 sm:mt-20 sm:text-[18px]"
          >
            No clutter. No steep learning curve. Just clear workflows.
          </motion.p>

          <FeatureHighlights />
        </div>

        <div className="h-16 sm:h-20" />
      </div>
    </section>
  );
}
