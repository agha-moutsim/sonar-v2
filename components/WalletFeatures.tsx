"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Check, KeyRound } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const EASE = [0.22, 1, 0.36, 1] as const;

type FeatureId = "identity" | "routing" | "custody";

const CHAINS = ["BTC", "ETH", "BNB", "AVAX", "XRP", "LTC"];
const SCAN_ORDER = [0, 2, 3, 4, 5, 1];
const DESTINATION = 1;

const FEATURES: { id: FeatureId; code: string; title: string; body: React.ReactNode }[] = [
  {
    id: "identity",
    code: "F-01 · Identity",
    title: "Native SONAR ID Integration",
    body: (
      <>
        Effortlessly send and receive crypto simply using your{" "}
        <span className="text-white">unique SONAR username</span>. Enjoy a seamless transaction
        experience and wave goodbye to long and error-prone{" "}
        <span className="text-white">0x addresses</span>.
      </>
    ),
  },
  {
    id: "routing",
    code: "F-02 · Routing",
    title: "Multi-Chain Compatible",
    body: (
      <>
        Send funds across <span className="text-white">multiple chains</span> including{" "}
        <span className="text-white">BTC, ETH, BNB, AVAX, XRP, LTC</span>, and more.
        <br />
        <br />
        <span className="text-white">SONAR Auto-chain recognition</span> does the hard work for
        you, ensuring your funds always reach the <span className="text-white">correct destination</span>.
      </>
    ),
  },
  {
    id: "custody",
    code: "F-03 · Custody",
    title: "Fully Decentralized",
    body: (
      <>
        SONAR Wallet is <span className="text-white">fully decentralized and secure</span>. SONAR
        does not store your <span className="text-white">private keys</span> or track our users'{" "}
        <span className="text-white">IP addresses</span>.
        <br />
        <br />
        Remember <span className="text-white">not your keys, not your crypto</span>.
      </>
    ),
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

function Stamp({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.04] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/85"
    >
      <Check className="h-3 w-3" aria-hidden="true" />
      {children}
    </motion.span>
  );
}

function SonarIdDemo({ running, reduced }: { running: boolean; reduced: boolean }) {
  const target = "@ericcott.90ab";
  const source = "0x8C41…b7E2";
  const charset = "0123456789abcdef@.";
  const [text, setText] = useState(source);
  const [phase, setPhase] = useState<"idle" | "morph" | "done">("idle");

  useEffect(() => {
    if (!running) return;
    if (reduced) {
      setText(target);
      setPhase("done");
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));
    const run = () => {
      setText(source);
      setPhase("idle");
      later(() => setPhase("morph"), 800);
      const frames = target.length * 2;
      for (let f = 0; f <= frames; f++) {
        later(() => {
          const resolvedCount = Math.floor(f / 2);
          setText(
            target
              .split("")
              .map((c, i) =>
                i < resolvedCount ? c : charset[Math.floor(Math.random() * charset.length)]
              )
              .join("")
          );
          if (f === frames) setPhase("done");
        }, 850 + f * 28);
      }
      later(run, 850 + frames * 28 + 2400);
    };
    run();
    return () => timers.forEach(clearTimeout);
  }, [running, reduced]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-7 px-6">
      <div className="flex flex-col items-center gap-3">
        <motion.p
          key={phase === "done" ? "sonar" : "legacy"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/35"
        >
          {phase === "done" ? "Sonar ID" : "Legacy address"}
        </motion.p>
        <div className="relative flex min-h-[1.4em] items-center justify-center">
          <p
            className={`min-w-[13ch] text-center font-mono text-2xl tracking-wide transition-colors duration-300 sm:text-4xl ${
              phase === "done" ? "text-white" : "text-white/70"
            }`}
          >
            {text}
          </p>
          <motion.span
            aria-hidden="true"
            className="absolute left-0 top-1/2 h-px w-full origin-left bg-white/50"
            initial={false}
            animate={{ scaleX: phase === "morph" ? 1 : 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === "morph" && (
          <motion.p
            key="morph"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/40"
          >
            Rewriting identity…
          </motion.p>
        )}
        {phase === "done" && (
          <motion.div key="done" exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <Stamp>0x address eliminated</Stamp>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MultiChainDemo({ running, reduced }: { running: boolean; reduced: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [centers, setCenters] = useState<{ x: number; y: number }[]>([]);
  const [step, setStep] = useState(-1);
  const [resolved, setResolved] = useState(false);

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const wr = wrap.getBoundingClientRect();
    setCenters(
      chipRefs.current.map((el) => {
        if (!el) return { x: 0, y: 0 };
        const r = el.getBoundingClientRect();
        return { x: r.left - wr.left + r.width / 2, y: r.top - wr.top + r.height / 2 };
      })
    );
  }, []);

  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    if (!running) return;
    if (reduced) {
      setStep(SCAN_ORDER.length - 1);
      setResolved(true);
      return;
    }
    if (centers.length < CHAINS.length) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));
    const run = () => {
      setStep(-1);
      setResolved(false);
      SCAN_ORDER.forEach((_, i) => {
        later(() => !cancelled && setStep(i), 600 + i * 780);
      });
      later(
        () => !cancelled && (setStep(SCAN_ORDER.length - 1), setResolved(true)),
        600 + SCAN_ORDER.length * 780
      );
      later(run, 600 + SCAN_ORDER.length * 780 + 2600);
    };
    run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [running, reduced, centers]);

  const visitedOf = (chipIdx: number) => {
    const oi = SCAN_ORDER.indexOf(chipIdx);
    return oi >= 0 && oi <= step;
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-9 px-6">
      <div ref={wrapRef} className="relative w-full max-w-sm">
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {CHAINS.map((sym, i) => {
            const isDestination = i === DESTINATION;
            const rejected = visitedOf(i) && !isDestination;
            const isCurrent = step >= 0 && SCAN_ORDER[step] === i && !resolved;
            return (
              <span
                key={sym}
                ref={(el) => {
                  chipRefs.current[i] = el;
                }}
                className={`relative rounded-full border px-4 py-2 font-mono text-xs tracking-[0.15em] transition-all duration-500 ${
                  resolved && isDestination
                    ? "border-white bg-white font-bold text-black"
                    : isCurrent
                      ? "border-white/70 text-white"
                      : rejected
                        ? "border-white/[0.05] text-white/15"
                        : "border-white/10 text-white/40"
                }`}
              >
                {resolved && isDestination && (
                  <>
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full border border-white/60"
                      animate={{ scale: [1, 2], opacity: [0.7, 0] }}
                      transition={{ duration: 1, repeat: 2, ease: "easeOut", delay: 0.1 }}
                    />
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full border border-white/40"
                      animate={{ scale: [1, 2.6], opacity: [0.5, 0] }}
                      transition={{ duration: 1, repeat: 2, ease: "easeOut", delay: 0.35 }}
                    />
                  </>
                )}
                {rejected && (
                  <span
                    aria-hidden="true"
                    className="absolute left-2 right-2 top-1/2 h-px -rotate-6 bg-white/30"
                  />
                )}
                {sym}
              </span>
            );
          })}
        </div>

        {centers.length === CHAINS.length && step >= 0 && !reduced && (
          <motion.span
            aria-hidden="true"
            className="absolute left-0 top-0 z-10 h-2 w-2 rounded-full bg-white"
            initial={{ x: centers[SCAN_ORDER[0]].x, y: centers[SCAN_ORDER[0]].y, opacity: 0 }}
            animate={{
              x: centers[SCAN_ORDER[step]].x,
              y: centers[SCAN_ORDER[step]].y,
              opacity: resolved ? 0 : 1,
            }}
            transition={{ duration: 0.45, ease: EASE }}
          />
        )}
      </div>

      <div className="flex min-h-[2.2rem] flex-col items-center justify-center gap-2">
        <AnimatePresence mode="wait">
          {resolved ? (
            <motion.div key="stamp" exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <Stamp>Auto-chain: resolved</Stamp>
            </motion.div>
          ) : (
            <motion.p
              key={step}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/40"
            >
              {step < 0
                ? "Scanning chains…"
                : SCAN_ORDER[step] === DESTINATION
                  ? `${CHAINS[SCAN_ORDER[step]]} — destination found`
                  : `${CHAINS[SCAN_ORDER[step]]} — not destination, rerouting…`}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const NODES = [
  { x: 8, y: 28 },
  { x: 26, y: 12 },
  { x: 46, y: 24 },
  { x: 66, y: 10 },
  { x: 88, y: 26 },
  { x: 14, y: 62 },
  { x: 86, y: 62 },
  { x: 30, y: 86 },
  { x: 70, y: 88 },
];

const LINKS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 8],
  [8, 6],
  [6, 4],
  [2, 6],
  [1, 6],
  [5, 7],
  [7, 6],
];

const PARTICLES = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  const radius = 30 + (i % 4) * 13;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius + 18,
    scale: 0.4 + (i % 3) * 0.3,
  };
});

const IP_FULL = "84.113.207.45";

const SCRAMBLE_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·";

function ScrambleText({ text, sleep }: { text: string; sleep: boolean }) {
  const [display, setDisplay] = useState(text);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (sleep) {
      setDisplay(text);
      return;
    }
    let frame = 0;
    const total = Math.max(12, text.length * 2);
    const tick = () => {
      frame += 1;
      const resolved = Math.floor((frame / total) * text.length);
      setDisplay(
        text
          .split("")
          .map((c, i) =>
            i < resolved || c === " "
              ? c
              : SCRAMBLE_CHARSET[Math.floor(Math.random() * SCRAMBLE_CHARSET.length)]
          )
          .join("")
      );
      if (frame < total) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [text, sleep]);

  return <span className="contents">{display}</span>;
}

function DecentralizedDemo({ running, reduced }: { running: boolean; reduced: boolean }) {
  const [phase, setPhase] = useState<"draw" | "key" | "shatter" | "redact" | "done">("draw");
  const [ip, setIp] = useState(reduced ? "[REDACTED]" : IP_FULL);

  useEffect(() => {
    if (!running) return;
    if (reduced) {
      setPhase("done");
      setIp("[REDACTED]");
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));
    const run = () => {
      setPhase("draw");
      setIp(IP_FULL);
      later(() => setPhase("key"), 1100);
      later(() => setPhase("shatter"), 1750);
      later(() => setPhase("redact"), 2500);
      IP_FULL.split("").forEach((_, i) => {
        later(() => {
          setIp((prev) =>
            i < IP_FULL.length - 1
              ? prev.slice(0, prev.length - 1 - i) + "█".repeat(i + 1)
              : "[REDACTED]"
          );
        }, 2500 + i * 90);
      });
      later(() => setPhase("done"), 2500 + IP_FULL.length * 90 + 200);
      later(run, 2500 + IP_FULL.length * 90 + 2400);
    };
    run();
    return () => timers.forEach(clearTimeout);
  }, [running, reduced]);

  const showKey = phase === "draw" || phase === "key";

  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-50"
        aria-hidden="true"
      >
        {LINKS.map(([a, b], i) => (
          <motion.line
            key={`${a}-${b}`}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="0.25"
            initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: running || reduced ? 1 : 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: i * 0.07 }}
          />
        ))}
        {NODES.map((n, i) => (
          <motion.circle
            key={i}
            cx={n.x}
            cy={n.y}
            r="1.1"
            fill="rgba(255,255,255,0.6)"
            initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0 }}
            animate={{ opacity: running || reduced ? 1 : 0, scale: running || reduced ? 1 : 0 }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.2 + i * 0.06 }}
          />
        ))}
      </svg>

      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-6">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <AnimatePresence>
            {showKey && (
              <motion.span
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.4 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <KeyRound className="h-10 w-10 text-white/80" aria-hidden="true" />
              </motion.span>
            )}
          </AnimatePresence>
          {phase === "shatter" && !reduced && (
            <span className="pointer-events-none absolute inset-0">
              {PARTICLES.map((p, i) => (
                <motion.span
                  key={i}
                  className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-white/80"
                  initial={{ x: 0, y: 0, opacity: 1, scale: p.scale }}
                  animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.2 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                />
              ))}
            </span>
          )}
        </div>

        <p className="font-mono text-sm tracking-[0.2em] text-white/60 tabular-nums">{ip}</p>

        <div className="flex min-h-[2.2rem] items-center justify-center">
          <AnimatePresence>
            {phase === "redact" && (
              <motion.p
                key="redacting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/40"
              >
                Stripping metadata…
              </motion.p>
            )}
            {phase === "done" && (
              <motion.div key="done" exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <Stamp>Keys: yours · Logs: none</Stamp>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function StageTick({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-20 h-3.5 w-3.5 border-white/40 ${className}`}
    />
  );
}

export default function WalletFeatures() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState<FeatureId>("identity");
  const stageRef = useRef<HTMLDivElement>(null);
  const stageInView = useInView(stageRef, { margin: "-15% 0px -15% 0px" });
  const [hoverCapable] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches
  );
  const [tracking, setTracking] = useState(false);
  const retX = useMotionValue(0);
  const retY = useMotionValue(0);
  const retSX = useSpring(retX, { stiffness: 450, damping: 40, mass: 0.4 });
  const retSY = useSpring(retY, { stiffness: 450, damping: 40, mass: 0.4 });
  const coordXRef = useRef<HTMLSpanElement>(null);
  const coordYRef = useRef<HTMLSpanElement>(null);

  const handleStageMove = (e: React.MouseEvent) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    retX.set(x);
    retY.set(y);
    if (coordXRef.current) {
      coordXRef.current.textContent = String(Math.max(0, Math.round(x))).padStart(4, "0");
    }
    if (coordYRef.current) {
      coordYRef.current.textContent = String(Math.max(0, Math.round(y))).padStart(4, "0");
    }
  };

  const activeIndex = FEATURES.findIndex((f) => f.id === active);

  const selectFeature = (id: FeatureId) => {
    setActive(id);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      stageRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  return (
    <section
      id="wallet-features"
      className="sonar-bg relative w-full border-t border-white/[0.06] py-24 md:py-36"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/40"
        >
          {"//"} Main Features
        </motion.p>

        <h2 className="mt-8 font-display text-[clamp(2.8rem,7vw,6.5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em]">
          <MaskLine delay={0.05} reduced={reduced}>
            Built different.
          </MaskLine>
          <MaskLine delay={0.13} reduced={reduced} outlined>
            By design.
          </MaskLine>
        </h2>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div
            role="tablist"
            aria-label="SONAR Wallet main features"
            className="order-2 lg:order-1"
          >
            {FEATURES.map((feature, i) => {
              const isActive = active === feature.id;
              return (
                <motion.button
                  key={feature.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onMouseEnter={() => setActive(feature.id)}
                  onClick={() => selectFeature(feature.id)}
                  onFocus={() => setActive(feature.id)}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}
                  className="block w-full border-t border-white/[0.08] py-7 text-left last:border-b"
                >
                  <div className="flex items-baseline gap-5">
                    <span
                      className={`font-mono text-sm transition-colors duration-500 ${
                        isActive ? "text-white" : "text-white/30"
                      }`}
                    >
                      / {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className={`font-display text-2xl font-black uppercase tracking-tight transition-colors duration-500 sm:text-3xl lg:text-4xl ${
                        isActive ? "text-white" : "text-white/35"
                      }`}
                    >
                      <ScrambleText text={feature.title} sleep={!isActive} />
                    </h3>
                  </div>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="max-w-[58ch] pl-0 pt-4 text-sm leading-[1.85] text-white/55 sm:pl-[3.4rem]">
                          {feature.body}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>

          <div className="order-1 self-start lg:order-2 lg:sticky lg:top-24">
            <div
              ref={stageRef}
              onMouseMove={handleStageMove}
              onMouseEnter={() => setTracking(true)}
              onMouseLeave={() => setTracking(false)}
              className="relative h-[380px] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0b0f] shadow-[0_30px_80px_rgba(0,0,0,0.7)] sm:h-[420px] lg:h-[480px]"
            >
              <StageTick className="left-3 top-3 border-l border-t" />
              <StageTick className="right-3 top-3 border-r border-t" />
              <StageTick className="bottom-3 left-3 border-b border-l" />
              <StageTick className="bottom-3 right-3 border-b border-r" />

              <div className="absolute left-8 right-8 top-4 z-20 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
                <span>
                  <ScrambleText text={FEATURES[activeIndex]?.code ?? ""} sleep={false} />
                </span>
                <span className="flex items-center gap-3">
                  <span
                    className={`transition-colors duration-300 ${
                      tracking ? "text-white/70" : "text-white/30"
                    }`}
                  >
                    {tracking ? "Tracking" : "Standby"}
                  </span>
                  <span className="flex items-center gap-2">
                    <motion.span
                      className="h-1.5 w-1.5 rounded-full bg-white/70"
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    Live demo
                  </span>
                </span>
              </div>

              <div className="absolute bottom-4 left-8 right-8 z-20 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/25">
                <span>Demonstration</span>
                <span>Sonar Wallet</span>
              </div>

              {hoverCapable && !reduced && (
                <motion.div
                  className="pointer-events-none absolute left-0 top-0 z-30"
                  style={{ x: retSX, y: retSY }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: tracking ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="relative h-12 w-12 -translate-x-1/2 -translate-y-1/2">
                    <span className="absolute left-1/2 top-0 h-2.5 w-px -translate-x-1/2 bg-white/50" />
                    <span className="absolute bottom-0 left-1/2 h-2.5 w-px -translate-x-1/2 bg-white/50" />
                    <span className="absolute left-0 top-1/2 h-px w-2.5 -translate-y-1/2 bg-white/50" />
                    <span className="absolute right-0 top-1/2 h-px w-2.5 -translate-y-1/2 bg-white/50" />
                    <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
                    <span className="absolute left-7 top-4 whitespace-nowrap font-mono text-[9px] tracking-[0.15em] text-white/55">
                      X:<span ref={coordXRef}>0000</span> Y:
                      <span ref={coordYRef}>0000</span>
                    </span>
                  </div>
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="absolute inset-0"
                >
                  {active === "identity" && (
                    <SonarIdDemo running={stageInView && !reduced} reduced={reduced} />
                  )}
                  {active === "routing" && (
                    <MultiChainDemo running={stageInView && !reduced} reduced={reduced} />
                  )}
                  {active === "custody" && (
                    <DecentralizedDemo running={stageInView && !reduced} reduced={reduced} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
