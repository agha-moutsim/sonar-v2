"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const EASE = [0.16, 1, 0.3, 1] as const;

const MEMBERS = [
  { id: "rico", name: "Rico", role: "CEO / Developer", image: "/team/rico.webp" },
  { id: "eric", name: "Eric", role: "COO", image: "/team/eric.webp" },
  { id: "levinus", name: "Levinus", role: "CTO", image: "/team/levinus.png" },
  { id: "alf", name: "Alf", role: "CMO", image: "/team/aldofo.webp" },
];

const NAME_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

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

function WallPanel({
  member,
  index,
  lit,
  reduced,
  panelRef,
  veilRef,
  infoRef,
  markerRef,
  onTap,
}: {
  member: (typeof MEMBERS)[number];
  index: number;
  lit: boolean;
  reduced: boolean;
  panelRef: (el: HTMLButtonElement | null) => void;
  veilRef: (el: HTMLDivElement | null) => void;
  infoRef: (el: HTMLDivElement | null) => void;
  markerRef: (el: HTMLSpanElement | null) => void;
  onTap: (id: string) => void;
}) {
  const [nameText, setNameText] = useState(member.name);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduced || !lit) {
      setNameText(member.name);
      return;
    }
    let frame = 0;
    const total = 12;
    const tick = () => {
      frame += 1;
      const resolved = Math.floor((frame / total) * member.name.length);
      setNameText(
        member.name
          .split("")
          .map((c, i) =>
            i < resolved || c === " "
              ? c
              : NAME_CHARSET[Math.floor(Math.random() * NAME_CHARSET.length)]
          )
          .join("")
      );
      if (frame < total) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [lit, reduced, member.name]);

  return (
    <button
      ref={panelRef}
      type="button"
      aria-label={`${member.name} — ${member.role}`}
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse") onTap(member.id);
      }}
      onClick={() => onTap(member.id)}
      className="group relative block w-full cursor-pointer overflow-hidden bg-[#0d0e12] text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/60 h-[320px] sm:h-[360px] lg:h-full lg:flex-1"
    >
      <img
        src={member.image}
        alt={`${member.name} — ${member.role}`}
        loading="lazy"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover object-top grayscale"
      />

      <div
        ref={veilRef}
        aria-hidden="true"
        className="absolute inset-0 bg-black"
        style={{ opacity: reduced ? 0 : 0.85 }}
      />

      <span
        className={cn(
          "absolute left-4 top-4 z-10 font-mono text-[10px] tracking-[0.25em] transition-colors duration-500",
          lit ? "text-white/70" : "text-white/25"
        )}
      >
        / {String(index + 1).padStart(2, "0")}
      </span>

      <span
        ref={markerRef}
        aria-hidden="true"
        className="absolute bottom-5 left-5 z-10 rotate-180 font-mono text-[10px] uppercase tracking-[0.3em] text-white/35 [writing-mode:vertical-rl]"
        style={{ opacity: reduced ? 0 : 0.5 }}
      >
        {member.name}
      </span>

      <div
        ref={infoRef}
        className="absolute inset-x-0 bottom-0 z-10 p-5 lg:p-6"
        style={{ opacity: reduced ? 1 : 0 }}
      >
        <p className="font-display text-3xl font-black uppercase tracking-tight text-white lg:text-5xl">
          {nameText}
        </p>
        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/75">
          {member.role}
        </p>
      </div>
    </button>
  );
}

export default function TeamSection() {
  const reduced = usePrefersReducedMotion();
  const [lit, setLit] = useState<string | null>(null);
  const [tracking, setTracking] = useState(false);

  const wallRef = useRef<HTMLDivElement>(null);
  const veilRefs = useRef<(HTMLDivElement | null)[]>([]);
  const infoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const markerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const targetsRef = useRef<number[]>([0, 0, 0, 0]);
  const hasMouseRef = useRef(false);
  const litRef = useRef<string | null>(null);

  const lightX = useMotionValue(0);
  const lightY = useMotionValue(0);
  const lightSX = useSpring(lightX, { stiffness: 250, damping: 30, mass: 0.5 });
  const lightSY = useSpring(lightY, { stiffness: 250, damping: 30, mass: 0.5 });
  const lightO = useMotionValue(0);

  useEffect(() => {
    litRef.current = lit;
    if (!hasMouseRef.current && lit) {
      const idx = MEMBERS.findIndex((m) => m.id === lit);
      targetsRef.current = MEMBERS.map((_, i) => (i === idx ? 1 : 0));
    }
  }, [lit]);

  useEffect(() => {
    if (reduced) return;
    const currents = [0, 0, 0, 0];
    const tick = () => {
      for (let i = 0; i < MEMBERS.length; i++) {
        const target = hasMouseRef.current
          ? targetsRef.current[i]
          : MEMBERS[i].id === litRef.current
            ? 1
            : 0;
        currents[i] += (target - currents[i]) * 0.1;
        const veil = veilRefs.current[i];
        if (veil) veil.style.opacity = String(Math.max(0, 0.85 - currents[i] * 0.85));
        const info = infoRefs.current[i];
        if (info) info.style.opacity = String(Math.min(1, currents[i] * 1.4));
        const marker = markerRefs.current[i];
        if (marker) marker.style.opacity = String(Math.max(0, (1 - currents[i] * 1.6) * 0.5));
      }
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
    };
  }, [reduced]);

  const handleWallMove = (e: React.MouseEvent) => {
    const wall = wallRef.current;
    if (!wall) return;
    hasMouseRef.current = true;
    const r = wall.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    lightX.set(x);
    lightY.set(y);
    if (!tracking) setTracking(true);
    if (lightO.get() !== 1) lightO.set(1);

    let bestIdx = -1;
    let bestF = 0;
    MEMBERS.forEach((_, i) => {
      const panel = panelRefs.current[i];
      if (!panel) return;
      const pr = panel.getBoundingClientRect();
      const cx = pr.left - r.left + pr.width / 2;
      const cy = pr.top - r.top + pr.height / 2;
      const dist = Math.hypot(x - cx, y - cy);
      const f = Math.max(0, 1 - dist / (pr.width * 0.9 + 160));
      targetsRef.current[i] = f;
      if (f > bestF) {
        bestF = f;
        bestIdx = i;
      }
    });
    const nextLit = bestF > 0.3 ? MEMBERS[bestIdx].id : null;
    if (nextLit !== litRef.current) setLit(nextLit);
  };

  const handleWallLeave = () => {
    setTracking(false);
    lightO.set(0);
    targetsRef.current = [0, 0, 0, 0];
    if (litRef.current !== null) setLit(null);
  };

  const handlePanelTap = (id: string) => {
    if (hasMouseRef.current) return;
    setLit(id);
    const idx = MEMBERS.findIndex((m) => m.id === id);
    const wall = wallRef.current;
    const panel = panelRefs.current[idx];
    if (wall && panel) {
      const wr = wall.getBoundingClientRect();
      const pr = panel.getBoundingClientRect();
      lightX.set(pr.left - wr.left + pr.width / 2);
      lightY.set(pr.top - wr.top + pr.height / 2);
      lightO.set(1);
    }
  };

  return (
    <section id="team" className="sonar-bg relative w-full border-t border-white/[0.06] py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-6 text-center sm:px-10 lg:px-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/40"
        >
          {"//"} Team
        </motion.p>

        <h2 className="mt-6 font-display text-[clamp(2.6rem,6vw,5.5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em]">
          <MaskLine delay={0.05} reduced={reduced}>
            Meet
          </MaskLine>
          <MaskLine delay={0.13} reduced={reduced} outlined>
            The team
          </MaskLine>
        </h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
          className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/30"
        >
          {reduced ? "The people behind Sonar" : "Shine your light on the crew"}
        </motion.p>
      </div>

      <div
        ref={wallRef}
        onMouseMove={handleWallMove}
        onMouseLeave={handleWallLeave}
        className="relative mt-12 flex flex-col gap-px overflow-hidden bg-white/10 lg:mt-16 lg:h-[66vh] lg:min-h-[520px] lg:flex-row"
      >
        {MEMBERS.map((member, i) => (
          <WallPanel
            key={member.id}
            member={member}
            index={i}
            lit={lit === member.id}
            reduced={reduced}
            panelRef={(el) => {
              panelRefs.current[i] = el;
            }}
            veilRef={(el) => {
              veilRefs.current[i] = el;
            }}
            infoRef={(el) => {
              infoRefs.current[i] = el;
            }}
            markerRef={(el) => {
              markerRefs.current[i] = el;
            }}
            onTap={handlePanelTap}
          />
        ))}

        {!reduced && (
          <motion.div
            className="pointer-events-none absolute left-0 top-0 z-20"
            style={{ x: lightSX, y: lightSY, opacity: lightO }}
            initial={{ opacity: 0 }}
          >
            <div
              className="h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 38%, transparent 65%)",
                mixBlendMode: "screen",
              }}
            />
          </motion.div>
        )}

        {!reduced && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-4 z-20 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 transition-opacity duration-500"
            style={{ opacity: tracking ? 0 : 1 }}
          >
            Move your light across the crew
          </div>
        )}
      </div>
    </section>
  );
}
