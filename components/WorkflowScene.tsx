"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Send,
  LayoutGrid,
  Box,
  Layers,
  MoreHorizontal,
  Flag,
  Mail,
  Feather,
  type LucideIcon,
} from "lucide-react";
import { WorkflowCallout } from "./WorkflowCallout";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Icon centers computed from the isometric box geometry below (viewBox 0 0 400 300).
// Left face bottom edge W2(40,200) -> S2(200,290); right face bottom edge S2(200,290) -> E2(360,200).
const trayIcons: { icon: LucideIcon; x: number; y: number }[] = [
  { icon: Send, x: 64, y: 213.5 },
  { icon: LayoutGrid, x: 100.8, y: 234.2 },
  { icon: Box, x: 139.2, y: 255.8 },
  { icon: Layers, x: 176, y: 276.5 },
  { icon: MoreHorizontal, x: 224, y: 276.5 },
  { icon: Flag, x: 260.8, y: 255.8 },
  { icon: Mail, x: 299.2, y: 234.2 },
  { icon: Feather, x: 336, y: 213.5 },
];

const TRAY_BASE_SHADOW =
  "0px 0px 0px rgba(255,255,255,0), 0px 0px 0px rgba(255,255,255,0), 0px 2px 6px rgba(0,0,0,0.5)";
const TRAY_GLOW_SHADOW =
  "0px 0px 14px rgba(255,255,255,0.20), 0px 0px 3px rgba(255,255,255,0.35), 0px 2px 6px rgba(0,0,0,0.5)";

// Isometric grid on the top face: N(200,40), u=W-N=(-160,90), v=E-N=(160,90).
// Lines parallel to v at s = i/8; lines parallel to u at t = i/8 (interior lines only).
const isoGridLines = [1, 2, 3, 4, 5, 6, 7].flatMap((i) => {
  const s = i / 8;
  return [
    { x1: 200 - 160 * s, y1: 40 + 90 * s, x2: 360 - 160 * s, y2: 130 + 90 * s },
    { x1: 200 + 160 * s, y1: 40 + 90 * s, x2: 40 + 160 * s, y2: 130 + 90 * s },
  ];
});

function CentralBurst({
  outerRef,
  innerRef,
}: {
  outerRef: React.RefObject<SVGGElement | null>;
  innerRef: React.RefObject<SVGGElement | null>;
}) {
  const petals = Array.from({ length: 12 });
  return (
    <>
      {/* back, dimmer burst — reflection of the core on the platform face */}
      <g
        ref={outerRef}
        className="burst-back"
        transform="translate(200 108) scale(0.8)"
        style={{ transformBox: "fill-box" }}
        filter="url(#softBlur)"
      >
        {petals.map((_, i) => (
          <rect
            key={`b-${i}`}
            x="-2.2"
            y="-20"
            width="4.4"
            height="16"
            rx="2.2"
            fill="#8a8a8a"
            opacity="0.6"
            transform={`rotate(${(i * 360) / 12})`}
          />
        ))}
      </g>
      {/* front, bright burst — spins continuously once bloomed in */}
      <g
        ref={innerRef}
        className="burst-front"
        transform="translate(200 88)"
        style={{ transformBox: "fill-box" }}
      >
        {petals.map((_, i) => (
          <rect
            key={`f-${i}`}
            className="petal-front"
            x="-2.6"
            y="-22"
            width="5.2"
            height="18"
            rx="2.6"
            fill="#f5f5f5"
            transform={`rotate(${(i * 360) / 12 + 15})`}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        ))}
      </g>
    </>
  );
}

export function WorkflowScene() {
  return (
    <div className="relative mx-auto mt-16 w-full max-w-[900px] px-4">
      <div className="hidden items-start justify-between gap-6 lg:flex">
        <div className="w-[200px] pt-16">
          <WorkflowCallout
            side="left"
            lines={["SONAR bring them all", "together in one place AI"]}
            delay={0.2}
          />
        </div>

        <SceneVisual />

        <div className="w-[200px] pt-40 self-end">
          <WorkflowCallout
            side="right"
            lines={["Set of tools you use in", "your workflow"]}
            delay={0.35}
          />
        </div>
      </div>

      {/* Mobile / tablet: visual first, callouts stacked below */}
      <div className="flex flex-col items-center gap-6 lg:hidden">
        <SceneVisual compact />
        <div className="flex w-full max-w-sm items-start justify-between gap-4 text-left">
          <WorkflowCallout
            side="left"
            lines={["SONAR bring them all", "together in one place AI"]}
            delay={0.1}
          />
          <WorkflowCallout
            side="right"
            lines={["Set of tools you use in", "your workflow"]}
            delay={0.2}
          />
        </div>
      </div>
    </div>
  );
}

function SceneVisual({ compact }: { compact?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const platformRef = useRef<HTMLDivElement>(null);
  const bootRef = useRef<HTMLDivElement>(null);
  const glassFloatRef = useRef<SVGGElement>(null);
  const glassDropRef = useRef<SVGGElement>(null);
  const glassRef = useRef<SVGGElement>(null);
  const glassDrawRef = useRef<SVGPolygonElement>(null);
  const impactFlashRef = useRef<SVGPolygonElement>(null);
  const burstOuterRef = useRef<SVGGElement>(null);
  const burstInnerRef = useRef<SVGGElement>(null);
  const glowRef = useRef<SVGEllipseElement>(null);
  const ripplesRef = useRef<SVGGElement>(null);
  const sweepRef = useRef<SVGRectElement>(null);
  const dashedRingRef = useRef<SVGEllipseElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);
  const burstLoopsRef = useRef<(() => void) | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Scroll-driven lift choreography.
  useEffect(() => {
    const root = containerRef.current;
    if (reducedMotion || !root) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 75%",
          end: "top 20%",
          scrub: 0.6,
        },
      });

      tl.to(platformRef.current, { y: -14, duration: 1 }, 0)
        .to(glassFloatRef.current, { y: -10, duration: 1 }, 0)
        .to(burstOuterRef.current, { rotate: 40, transformOrigin: "50% 50%", duration: 1 }, 0);
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Ambient life: glow breathing, ripples, light sweep, orbit, float, tray pulses.
  useEffect(() => {
    const root = containerRef.current;
    const tray = trayRef.current;
    if (reducedMotion || !root || !tray) return;

    const ctx = gsap.context(() => {
      gsap.to(glowRef.current, {
        opacity: 0.75,
        duration: 2.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      gsap.to(glassRef.current, {
        y: 3.5,
        duration: 3.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      root.querySelectorAll<SVGEllipseElement>(".iso-ripple").forEach((el, i) => {
        gsap.fromTo(
          el,
          { scale: 0.15, opacity: 0.5, transformOrigin: "50% 50%" },
          {
            scale: 1.4,
            opacity: 0,
            duration: 3.4,
            ease: "power1.out",
            repeat: -1,
            delay: i * 1.13,
          }
        );
      });

      gsap
        .timeline({ repeat: -1, repeatDelay: 3.8 })
        .fromTo(
          sweepRef.current,
          { x: -170, opacity: 0 },
          { opacity: 0.9, duration: 0.5, ease: "power1.out" },
          0
        )
        .to(sweepRef.current, { x: 250, duration: 2.2, ease: "power2.inOut" }, 0)
        .to(sweepRef.current, { opacity: 0, duration: 0.5, ease: "power1.in" }, 1.9);

      const dots = Array.from(
        root.querySelectorAll<SVGCircleElement>(".orbit-dot")
      );
      const orbit = { t: 0 };
      gsap.to(orbit, {
        t: Math.PI * 2,
        duration: 10,
        ease: "none",
        repeat: -1,
        onUpdate: () => {
          dots.forEach((d, i) => {
            const a = orbit.t - i * 0.55;
            d.setAttribute("cx", String(200 + 78 * Math.cos(a)));
            d.setAttribute("cy", String(130 + 43.875 * Math.sin(a)));
            d.setAttribute("opacity", String([0.9, 0.45, 0.2][i] ?? 0.2));
          });
        },
      });

      gsap.to(dashedRingRef.current, {
        strokeDashoffset: -24,
        duration: 6,
        ease: "none",
        repeat: -1,
      });

      // Tray icons idle float + live shadows.
      const floats = Array.from(tray.querySelectorAll<HTMLElement>(".tray-float"));
      const shadows = Array.from(tray.querySelectorAll<HTMLElement>(".tray-shadow"));
      floats.forEach((el, i) => {
        const dur = 2.3 + (i % 4) * 0.4;
        const floatTl = gsap.timeline({ repeat: -1, yoyo: true, delay: i * 0.35 });
        floatTl
          .to(el, { y: -(2.2 + (i % 3) * 0.8), duration: dur, ease: "sine.inOut" }, 0)
          .to(
            shadows[i],
            { opacity: 0.22, scaleX: 0.78, transformOrigin: "50% 50%", duration: dur, ease: "sine.inOut" },
            0
          );
      });

      // Perimeter light runner.
      const pdots = Array.from(root.querySelectorAll<SVGCircleElement>(".perimeter-dot"));
      const corners = [
        [200, 40],
        [360, 130],
        [200, 220],
        [40, 130],
      ];
      const vecs = [
        [160, 90],
        [-160, 90],
        [-160, -90],
        [160, -90],
      ];
      const posAt = (p: number): [number, number] => {
        const q = ((p % 4) + 4) % 4;
        const i = Math.floor(q);
        return [corners[i][0] + vecs[i][0] * (q - i), corners[i][1] + vecs[i][1] * (q - i)];
      };
      const peri = { p: 0 };
      gsap.to(peri, {
        p: 4,
        duration: 16,
        ease: "none",
        repeat: -1,
        onUpdate: () => {
          pdots.forEach((d, i) => {
            const [x, y] = posAt(peri.p - i * 0.05);
            d.setAttribute("cx", String(x));
            d.setAttribute("cy", String(y));
            d.setAttribute("opacity", String([0.5, 0.25, 0.12][i] ?? 0.12));
          });
        },
      });

      // Causality loop: core pings, ripple spreads, tools answer in sequence.
      const icons = Array.from(tray.querySelectorAll<HTMLElement>(".tray-icon"));
      const pingEl = root.querySelector<SVGCircleElement>(".core-ping");
      const pingRipple = root.querySelector<SVGEllipseElement>(".ping-ripple");
      const pingTl = gsap.timeline({ repeat: -1, repeatDelay: 4.6, delay: 3 });
      if (pingEl) {
        pingTl.fromTo(
          pingEl,
          { scale: 0.25, opacity: 0.7, transformOrigin: "50% 50%" },
          { scale: 2.4, opacity: 0, duration: 0.9, ease: "power1.out" },
          0
        );
      }
      if (pingRipple) {
        pingTl.fromTo(
          pingRipple,
          { scale: 0.2, opacity: 0.5, transformOrigin: "50% 50%" },
          { scale: 1.4, opacity: 0, duration: 1.2, ease: "power1.out" },
          0.1
        );
      }
      pingTl.to(
        icons,
        {
          keyframes: [
            { boxShadow: TRAY_GLOW_SHADOW, duration: 0.22, ease: "sine.in" },
            { boxShadow: TRAY_BASE_SHADOW, duration: 0.6, ease: "sine.out" },
          ],
          stagger: { each: 0.09, from: "center" },
        },
        0.5
      );

      // Burst loops: created paused, started by the boot sequence.
      const spin = gsap.to(burstInnerRef.current, {
        rotate: 360,
        transformOrigin: "50% 50%",
        duration: 26,
        ease: "none",
        repeat: -1,
        paused: true,
      });
      const breathe = gsap.to(burstInnerRef.current, {
        scale: 1.06,
        transformOrigin: "50% 50%",
        duration: 2.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        paused: true,
      });
      const petals = Array.from(
        root.querySelectorAll<SVGRectElement>(".petal-front")
      );
      const shimmer = gsap.fromTo(
        petals,
        { scale: 1 },
        {
          scale: 0.88,
          transformOrigin: "50% 50%",
          duration: 1.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          stagger: { each: 0.07 },
          paused: true,
        }
      );
      burstLoopsRef.current = () => {
        spin.play();
        breathe.play();
        shimmer.play();
      };
    }, containerRef);

    return () => {
      burstLoopsRef.current = null;
      ctx.revert();
    };
  }, [reducedMotion]);

  // Boot sequence: the scene assembles itself the first time it scrolls into view.
  useEffect(() => {
    const root = containerRef.current;
    const tray = trayRef.current;
    if (reducedMotion || !root || !tray) return;

    const ctx = gsap.context(() => {
      const boot = bootRef.current;
      const drop = glassDropRef.current;
      const flash = impactFlashRef.current;
      const draw = glassDrawRef.current;
      const impactRipple = root.querySelector<SVGEllipseElement>(".impact-ripple");

      const gridLines = Array.from(
        root.querySelectorAll<SVGLineElement>(".grid-line")
      );
      const icons = Array.from(tray.querySelectorAll<HTMLElement>(".tray-icon"));

      // Initial (hidden) states — applied only when animations are enabled.
      if (boot) gsap.set(boot, { y: 70, opacity: 0 });
      if (drop) gsap.set(drop, { y: -36, opacity: 0 });
      gsap.set(burstOuterRef.current, { scale: 0, opacity: 0, transformOrigin: "50% 50%" });
      gsap.set(burstInnerRef.current, { scale: 0, opacity: 0, transformOrigin: "50% 50%" });
      gsap.set(icons, {
        y: 22,
        opacity: 0,
        scale: 0.55,
        x: (i: number) => (i - 3.5) * 10,
      });
      gridLines.forEach((line) => {
        const len = line.getTotalLength();
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 });
      });
      if (flash) gsap.set(flash, { opacity: 0 });

      let drawLen = 0;
      if (draw) {
        drawLen = draw.getTotalLength();
        gsap.set(draw, { strokeDasharray: drawLen, strokeDashoffset: drawLen, opacity: 1 });
      }

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 78%", once: true },
        onComplete: () => burstLoopsRef.current?.(),
      });

      // 1. Platform rises into place.
      if (boot) {
        tl.to(boot, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, 0);
      }

      // 2. Grid lines draw themselves across the top face.
      tl.to(
        gridLines,
        {
          strokeDashoffset: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.inOut",
          stagger: 0.035,
        },
        0.15
      );

      // 3. Glass layer drops onto the platform.
      if (drop) {
        tl.to(drop, { y: 0, opacity: 1, duration: 0.45, ease: "power2.in" }, 0.95);
      }

      // 4. Impact: dip, flash, ripple burst.
      if (boot) {
        tl.to(boot, { y: 3, duration: 0.1, ease: "power2.out" }, 1.4).to(
          boot,
          { y: 0, duration: 0.3, ease: "power2.out" },
          1.5
        );
      }
      if (flash) {
        tl.fromTo(flash, { opacity: 0.55 }, { opacity: 0, duration: 0.6, ease: "power1.out" }, 1.4);
      }
      if (impactRipple) {
        tl.fromTo(
          impactRipple,
          { scale: 0.25, opacity: 0.65, transformOrigin: "50% 50%" },
          { scale: 1.45, opacity: 0, duration: 0.9, ease: "power1.out" },
          1.4
        );
      }

      // 5. Glass perimeter draws itself, then dissolves into the dashed line.
      if (draw && drawLen > 0) {
        tl.to(draw, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }, 1.5)
          .to(draw, { opacity: 0, duration: 0.7, ease: "power1.out" }, 2.5);
      }

      // 6. Core blooms.
      tl.to(
        burstOuterRef.current,
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
        1.55
      ).to(
        burstInnerRef.current,
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
        1.7
      );

      // 7. Tray icons arc up out of the edges and dock, blooming outward from center.
      tl.to(
        icons,
        {
          opacity: 1,
          duration: 0.3,
          ease: "power1.out",
          stagger: { each: 0.07, from: "center" },
        },
        1.75
      ).to(
        icons,
        {
          y: 0,
          x: 0,
          scale: 1,
          duration: 0.75,
          ease: "back.out(1.6)",
          stagger: { each: 0.07, from: "center" },
        },
        1.75
      );
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Pointer parallax on the whole scene.
  useEffect(() => {
    if (reducedMotion) return;
    const el = containerRef.current;
    if (!el) return;

    function handleMove(e: PointerEvent) {
      const rect = el!.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(el, {
        rotateY: px * 6,
        rotateX: -py * 4,
        duration: 0.6,
        ease: "power2.out",
      });
    }
    function handleLeave() {
      gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "power3.out" });
    }

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);
    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
    };
  }, [reducedMotion]);

  function handleTrayEnter(e: React.PointerEvent<HTMLDivElement>) {
    if (reducedMotion) return;
    gsap.to(e.currentTarget, {
      y: -3,
      borderColor: "rgba(255,255,255,0.35)",
      backgroundColor: "#242424",
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
  }
  function handleTrayLeave(e: React.PointerEvent<HTMLDivElement>) {
    if (reducedMotion) return;
    gsap.to(e.currentTarget, {
      y: 0,
      borderColor: "rgba(255,255,255,0.1)",
      backgroundColor: "#1c1c1c",
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto",
    });
  }

  return (
    <div
      ref={containerRef}
      style={{ transformStyle: "preserve-3d", perspective: 900 }}
      className={`relative mx-auto ${compact ? "w-[280px]" : "w-[400px]"} aspect-[4/3] flex-shrink-0`}
    >
      <div ref={platformRef} className="absolute inset-0">
        <div ref={bootRef} className="h-full w-full">
          <svg viewBox="0 0 400 300" className="h-full w-full overflow-visible">
            <defs>
              <linearGradient id="faceTop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#232323" />
                <stop offset="100%" stopColor="#141414" />
              </linearGradient>
              <linearGradient id="faceLeft" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1a1a1a" />
                <stop offset="100%" stopColor="#0c0c0c" />
              </linearGradient>
              <linearGradient id="faceRight" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#161616" />
                <stop offset="100%" stopColor="#090909" />
              </linearGradient>
              <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
              <linearGradient id="sweepGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="42%" stopColor="rgba(255,255,255,0.04)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.13)" />
                <stop offset="58%" stopColor="rgba(255,255,255,0.04)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              <filter id="softBlur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="0.7" />
              </filter>
              <clipPath id="topClip">
                <polygon points="200,40 360,130 200,220 40,130" />
              </clipPath>
            </defs>

            {/* Front-left face */}
            <polygon points="40,130 200,220 200,290 40,200" fill="url(#faceLeft)" />
            {/* Front-right face */}
            <polygon points="360,130 200,220 200,290 360,200" fill="url(#faceRight)" />
            {/* Top face */}
            <polygon
              points="200,40 360,130 200,220 40,130"
              fill="url(#faceTop)"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />

            {/* isometric grid, drawn in during boot */}
            <g clipPath="url(#topClip)">
              {isoGridLines.map((l, i) => (
                <line
                  key={i}
                  className="grid-line"
                  x1={l.x1}
                  y1={l.y1}
                  x2={l.x2}
                  y2={l.y2}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </g>

            {/* light sweep traveling across the top face */}
            <g clipPath="url(#topClip)">
              <rect
                ref={sweepRef}
                x="155"
                y="-140"
                width="90"
                height="520"
                fill="url(#sweepGrad)"
                transform="rotate(-29 200 130)"
                opacity="0"
              />
            </g>

            {/* isometric energy ripples spreading from the core */}
            <g ref={ripplesRef} clipPath="url(#topClip)">
              <ellipse
                className="iso-ripple"
                cx="200"
                cy="130"
                rx="104"
                ry="58.5"
                fill="none"
                stroke="rgba(255,255,255,0.32)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
              <ellipse
                className="iso-ripple"
                cx="200"
                cy="130"
                rx="104"
                ry="58.5"
                fill="none"
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
              <ellipse
                className="iso-ripple"
                cx="200"
                cy="130"
                rx="104"
                ry="58.5"
                fill="none"
                stroke="rgba(255,255,255,0.16)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
              <ellipse
                className="impact-ripple"
                cx="200"
                cy="130"
                rx="104"
                ry="58.5"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
              <ellipse
                className="ping-ripple"
                cx="200"
                cy="130"
                rx="104"
                ry="58.5"
                fill="none"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                opacity="0"
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            </g>

            {/* soft glow pooling under the core */}
            <ellipse ref={glowRef} cx="200" cy="140" rx="90" ry="55" fill="url(#coreGlow)" opacity="0.5" />

            {/* Glass layer, floating above the top face */}
            <g ref={glassFloatRef}>
              <g ref={glassDropRef}>
                <g ref={glassRef}>
                  <polygon
                    points="200,18 372,124 200,230 28,124"
                    fill="rgba(255,255,255,0.02)"
                    stroke="rgba(255,255,255,0.22)"
                    strokeWidth="1"
                    strokeDasharray="2 4"
                  />
                  {/* solid outline that draws itself on landing, then fades away */}
                  <polygon
                    ref={glassDrawRef}
                    points="200,18 372,124 200,230 28,124"
                    fill="none"
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth="1.2"
                    opacity="0"
                  />
                </g>
                {/* impact flash on landing */}
                <polygon
                  ref={impactFlashRef}
                  points="200,18 372,124 200,230 28,124"
                  fill="none"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="1.5"
                />
              </g>
            </g>

            {/* orbital instrument rings + comet dot */}
            <g>
              <ellipse
                cx="200"
                cy="130"
                rx="78"
                ry="43.9"
                fill="none"
                stroke="rgba(255,255,255,0.07)"
                strokeWidth="1"
              />
              <ellipse
                ref={dashedRingRef}
                cx="200"
                cy="130"
                rx="88"
                ry="49.5"
                fill="none"
                stroke="rgba(255,255,255,0.14)"
                strokeWidth="1"
                strokeDasharray="3 9"
              />
              <circle className="orbit-dot" cx="278" cy="130" r="2.4" fill="#ffffff" opacity="0.9" />
              <circle className="orbit-dot" cx="278" cy="130" r="1.6" fill="#ffffff" opacity="0.45" />
              <circle className="orbit-dot" cx="278" cy="130" r="1.2" fill="#ffffff" opacity="0.2" />
            </g>

            {/* core ping ring — emitted by the causality loop */}
            <circle
              className="core-ping"
              cx="200"
              cy="88"
              r="12"
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1"
              opacity="0"
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />

            <CentralBurst outerRef={burstOuterRef} innerRef={burstInnerRef} />

            {/* edge highlights */}
            <polygon
              points="200,40 360,130 200,220 40,130"
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
            />

            {/* perimeter light runner */}
            <circle className="perimeter-dot" r="2" fill="#ffffff" opacity="0" />
            <circle className="perimeter-dot" r="1.4" fill="#ffffff" opacity="0" />
            <circle className="perimeter-dot" r="1" fill="#ffffff" opacity="0" />
          </svg>
        </div>
      </div>

      {/* App tray icons, positioned to match the isometric edge coordinates above */}
      <div ref={trayRef} className="pointer-events-none absolute inset-0">
        {trayIcons.map(({ x, y }, i) => (
          <div
            key={`shadow-${i}`}
            className="tray-shadow pointer-events-none absolute h-[7px] w-[26px] rounded-full bg-black/60"
            style={{
              left: `${(x / 400) * 100}%`,
              top: `calc(${(y / 300) * 100}% + 16px)`,
              marginLeft: "-13px",
              filter: "blur(2px)",
              opacity: 0.45,
            }}
          />
        ))}
        {trayIcons.map(({ icon: Icon, x, y }, i) => (
          <div
            key={i}
            className="tray-icon group pointer-events-auto absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[9px] border border-white/10 bg-[#1c1c1c] shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
            style={{
              left: `${(x / 400) * 100}%`,
              top: `${(y / 300) * 100}%`,
              boxShadow: TRAY_BASE_SHADOW,
            }}
            onPointerEnter={handleTrayEnter}
            onPointerLeave={handleTrayLeave}
          >
            <div className="tray-float flex h-full w-full items-center justify-center">
              <Icon
                size={12}
                strokeWidth={2}
                className="text-white/70 transition-colors duration-300 group-hover:text-white"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
