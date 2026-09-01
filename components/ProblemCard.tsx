"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import type { ProblemCardData } from "../data/content";

function StackVisual() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" className="h-11 w-11">
      <path
        d="M 112 32 L 54.627 32 L 128 105.373 L 201.373 32 L 144 32 L 144 0 L 256 0 L 256 112 L 224 112 L 224 54.627 L 150.627 128 L 224 201.373 L 224 144 L 256 144 L 256 256 L 144 256 L 144 224 L 201.373 224 L 128 150.627 L 54.627 224 L 112 224 L 112 256 L 0 256 L 0 144 L 32 144 L 32 201.373 L 105.373 128 L 32 54.627 L 32 112 L 0 112 L 0 0 L 112 0 Z"
        fill="rgb(84, 84, 84)"
      />
    </svg>
  );
}

function GearVisual() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" className="h-11 w-11">
      <path
        d="M 128 192 C 92.654 192 64 220.654 64 256 L 0 256 C 0 185.308 57.308 128 128 128 Z M 256 128 C 256 198.692 198.692 256 128 256 L 128 192 C 163.346 192 192 163.346 192 128 Z M 128 64 C 92.654 64 64 92.654 64 128 L 0 128 C 0 57.308 57.308 0 128 0 Z M 256 0 C 256 70.692 198.692 128 128 128 L 128 64 C 163.346 64 192 35.346 192 0 Z"
        fill="rgb(84, 84, 84)"
      />
    </svg>
  );
}

function TilesVisual() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" className="h-11 w-11">
      <path
        d="M 256 256 L 128 256 C 198.692 256 256 198.692 256 128 C 256 57.308 198.692 0 128 0 C 57.308 0 0 57.308 0 128 C 0 198.692 57.308 256 128 256 L 0 256 L 0 0 L 256 0 Z M 128 104 C 141.255 104 152 114.745 152 128 C 152 141.255 141.255 152 128 152 C 114.745 152 104 141.255 104 128 C 104 114.745 114.745 104 128 104 Z"
        fill="rgb(84, 84, 84)"
      />
    </svg>
  );
}

function DashboardVisual() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" className="h-11 w-11">
      <path
        d="M 120 136 L 120 176 L 40 256 L 0 256 L 0 216 L 80 136 Z M 256 216 L 256 256 L 216 256 L 136 176 L 136 136 L 176 136 Z M 120 80 L 120 120 L 80 120 L 0 40 L 0 0 L 40 0 Z M 256 40 L 176 120 L 136 120 L 136 80 L 216 0 L 256 0 Z"
        fill="rgb(84, 84, 84)"
      />
    </svg>
  );
}

const visualMap: Record<ProblemCardData["visual"], React.FC> = {
  stack: StackVisual,
  gear: GearVisual,
  tiles: TilesVisual,
  dashboard: DashboardVisual,
};

export function ProblemCard({
  card,
  index,
  isLast,
}: {
  card: ProblemCardData;
  index: number;
  isLast: boolean;
}) {
  const Visual = visualMap[card.visual];
  const reduceMotion = useReducedMotion();
  const tiltRef = useRef<HTMLDivElement>(null);

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = tiltRef.current;
    if (!el || reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(el, { rotateY: px * 6, rotateX: -py * 6, duration: 0.5, ease: "power2.out" });
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }
  function handleLeave() {
    const el = tiltRef.current;
    if (!el || reduceMotion) return;
    gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.7, ease: "power3.out" });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ perspective: 700 }}
      className={`group relative flex flex-1 px-6 py-9 sm:px-8 ${
        !isLast ? "border-b border-dashed border-white/10 sm:border-b-0 sm:border-r" : ""
      }`}
    >
      <div
        ref={tiltRef}
        className="relative flex w-full flex-col items-center gap-4 text-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="pointer-events-none absolute -inset-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(300px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.08), transparent 55%)",
          }}
        />
        <motion.div
          className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all duration-300 group-hover:border-white/15 group-hover:bg-white/[0.05] group-hover:shadow-[0_0_24px_rgba(255,255,255,0.08)]"
          animate={reduceMotion ? {} : { y: [0, -5, 0], rotateZ: [-2, 2, -2] }}
          transition={{
            duration: 6 + index,
            repeat: reduceMotion ? 0 : Infinity,
            ease: "easeInOut",
            delay: index * 0.4,
          }}
          whileHover={{ scale: 1.02 }}
        >
          <Visual />
        </motion.div>
        <p className="max-w-[170px] text-[13px] leading-snug text-white/55 transition-colors duration-300 group-hover:text-white/80">
          {card.title}
        </p>
      </div>
    </motion.div>
  );
}
