"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  ArrowRight,
  Bot,
  Code2,
  Gauge,
  GitBranch,
  Layers,
  LineChart,
  Shield,
  Terminal,
  User,
  Wallet,
} from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const EASE = [0.22, 1, 0.36, 1] as const;

type ConsoleState = "auth" | "apps" | "collab";

const FEATURES: {
  id: ConsoleState;
  index: string;
  title: string;
  body: React.ReactNode;
}[] = [
  {
    id: "auth",
    index: "01",
    title: "Login Without Email and Password",
    body: (
      <>
        Log in to thousands of websites and dApps more securely using just your{" "}
        <span className="text-white">SONAR ID</span>. Say goodbye to email and password logins.
      </>
    ),
  },
  {
    id: "apps",
    index: "02",
    title: "Host Applications & Trading Bots",
    body: (
      <>
        Utilize <span className="text-white">thousands of applications, dynamic trading bots</span>,
        and customize your SONAR hub to fit your needs.
      </>
    ),
  },
  {
    id: "collab",
    index: "03",
    title: "Web3 Dev Collaboration",
    body: (
      <>
        An innovative Web3 developer resource planning and payment system that enhances team
        business operations, featuring platform integrations like{" "}
        <span className="text-white">GitHub</span> for seamless collaboration—all powered by SONAR
        IDs.
      </>
    ),
  },
];

const LOG_LINES = ["> handshake verified", "> no password required", "> identity secured"];

const APP_ICONS = [Wallet, Bot, Gauge, Code2, LineChart, Shield, Layers, Terminal];

const BOTS = [
  { name: "Banana Gun Sniper Bot", tag: "sniper · eth", status: "ACTIVE" },
  { name: "Gas Optimizer", tag: "utility · multi", status: "ACTIVE" },
  { name: "Copy Trade Engine", tag: "social · sol", status: "SYNCING" },
];

const TASKS = [
  { title: "Resource planner — payment routes", status: "MERGED" },
  { title: "Team roles & permission layers", status: "REVIEW" },
  { title: "GitHub sync adapter", status: "LIVE" },
  { title: "Invoice streaming v2", status: "BUILDING" },
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

function LedChip() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5">
      <motion.span
        className="h-1.5 w-1.5 rounded-full bg-white"
        animate={{ opacity: [1, 0.2, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">
        Coming Soon
      </span>
    </span>
  );
}

function AuthState({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/[0.03]">
        <User className="h-7 w-7 text-white/60" aria-hidden="true" />
      </div>

      <div className="flex w-full max-w-xs items-center justify-center gap-1 rounded-xl border border-white/12 bg-white/[0.03] px-5 py-3.5 font-mono text-base">
        <span className="text-white/40">@</span>
        <span className="text-white">ericcott</span>
        <span className="text-white/40">.90ab</span>
      </div>

      <div className="space-y-1.5 font-mono text-[11px] text-white/40">
        {LOG_LINES.map((line, i) => (
          <motion.p
            key={line}
            animate={reduced ? { opacity: 0.6 } : { opacity: [0, 1, 1, 0.15] }}
            transition={
              reduced
                ? {}
                : {
                    duration: 4.5,
                    times: [0, 0.15, 0.8, 1],
                    repeat: Infinity,
                    delay: i * 0.55,
                    ease: "linear",
                  }
            }
          >
            {line}
          </motion.p>
        ))}
      </div>

      <div className="rounded-full bg-white px-7 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-black">
        Enter Hub
      </div>
    </div>
  );
}

function AppsBotsState({ reduced }: { reduced: boolean }) {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (reduced) {
      setBalance(25542098);
      return;
    }
    const controls = animate(0, 25542098, {
      duration: 2.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setBalance(Math.round(v)),
    });
    return () => controls.stop();
  }, [reduced]);

  return (
    <div className="flex h-full flex-col justify-center gap-5 px-6 sm:px-8">
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
            Total balance
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">USD</p>
        </div>
        <p className="mt-2 font-display text-3xl font-bold tracking-tight text-white tabular-nums">
          ${balance.toLocaleString("en-US")}
        </p>
        <svg viewBox="0 0 220 44" className="mt-3 h-10 w-full" aria-hidden="true">
          <motion.path
            d="M0 36 C 20 32, 34 38, 48 29 S 80 16, 96 22 S 130 32, 148 16 S 190 8, 220 12"
            fill="none"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="1.5"
            initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, ease: EASE, delay: 0.2 }}
          />
          <motion.path
            d="M0 40 C 30 38, 50 41, 70 36 S 110 30, 140 33 S 190 24, 220 26"
            fill="none"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="1.5"
            initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, ease: EASE, delay: 0.45 }}
          />
        </svg>
      </div>

      <div className="space-y-2.5">
        {BOTS.map((bot, i) => (
          <motion.div
            key={bot.name}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.3 + i * 0.12 }}
            className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-white/85">{bot.name}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                {bot.tag}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-white/80"
                animate={reduced ? {} : { opacity: [1, 0.25, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                {bot.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-8 gap-2.5">
        {APP_ICONS.map((Icon, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.55 + i * 0.05 }}
            className="flex h-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] sm:h-12"
          >
            <Icon className="h-4.5 w-4.5 text-white/50" aria-hidden="true" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CollabState({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex h-full flex-col justify-center gap-5 px-6 sm:px-8">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
          Active projects — Collaboration
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1">
          <GitBranch className="h-3 w-3 text-white/60" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
            GitHub
          </span>
        </span>
      </div>

      <div className="space-y-2.5">
        {TASKS.map((task, i) => (
          <motion.div
            key={task.title}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.15 + i * 0.12 }}
            className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded border border-white/20" aria-hidden="true" />
              <p className="text-sm text-white/80">{task.title}</p>
            </div>
            <div className="flex items-center gap-2">
              {task.status === "LIVE" && (
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-white/80"
                  animate={reduced ? {} : { opacity: [1, 0.25, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                {task.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3.5">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
          Payment stream
        </p>
        <p className="font-display text-lg font-bold text-white tabular-nums">$4,200 / mo</p>
      </div>
    </div>
  );
}

function HubConsole({
  active,
  reduced,
}: {
  active: ConsoleState;
  reduced: boolean;
}) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 18 });
  const sry = useSpring(ry, { stiffness: 120, damping: 18 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 6);
    rx.set(-py * 6);
  };

  const resetTilt = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      style={reduced ? undefined : { rotateX: srx, rotateY: sry, transformPerspective: 1200 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0b0f] shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
    >
      <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-3.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        </div>
        <p className="font-mono text-[11px] text-white/35">sonar://hub</p>
        <LedChip />
      </div>

      <div className="relative h-[420px] lg:h-[460px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: reduced ? 0.15 : 0.4, ease: EASE }}
            className="absolute inset-0"
          >
            {active === "auth" && <AuthState reduced={reduced} />}
            {active === "apps" && <AppsBotsState reduced={reduced} />}
            {active === "collab" && <CollabState reduced={reduced} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function Chapter({
  index,
  title,
  body,
  isActive,
  reduced,
  onActive,
}: {
  index: string;
  title: string;
  body: React.ReactNode;
  isActive: boolean;
  reduced: boolean;
  onActive: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inZone = useInView(ref, { margin: "-40% 0px -40% 0px" });

  useEffect(() => {
    if (inZone) onActive();
  }, [inZone, onActive]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: EASE }}
      className="grid grid-cols-[56px_1fr] gap-4 border-t border-white/[0.08] py-8"
    >
      <span
        className={`font-mono text-sm transition-colors duration-500 ${
          isActive ? "text-white" : "text-white/30"
        }`}
      >
        / {index}
      </span>
      <div>
        <h3
          className={`font-display text-2xl font-bold tracking-tight transition-colors duration-500 sm:text-3xl ${
            isActive ? "text-white" : "text-white/70"
          }`}
        >
          {title}
        </h3>
        <p className="mt-3 max-w-[56ch] text-sm leading-[1.8] text-white/50">{body}</p>
      </div>
    </motion.div>
  );
}

export default function SonarHub() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState<ConsoleState>("auth");

  return (
    <section id="sonar-hub" className="sonar-bg edge-fade-top relative w-full border-t border-white/[0.06] py-24 md:py-36">
      <div className="mx-auto grid w-full max-w-[1440px] gap-14 px-6 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-16">
        <div className="self-start lg:sticky lg:top-24">
          <HubConsole active={active} reduced={reduced} />
        </div>

        <div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/40"
          >
            {"//"} Sonar Hub — Coming Soon
          </motion.p>

          <h2 className="mt-8 font-display text-[clamp(3.2rem,8vw,7.5rem)] font-black uppercase leading-[0.88] tracking-[-0.04em]">
            <MaskLine delay={0.05} reduced={reduced}>
              Sonar
            </MaskLine>
            <MaskLine delay={0.13} reduced={reduced} outlined>
              Hub
            </MaskLine>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
            className="mt-8 max-w-[60ch] text-sm leading-[1.85] text-white/55 sm:text-base"
          >
            SONAR HUB is your{" "}
            <span className="text-white">personalized Web3 dashboard</span> designed to
            revolutionize your digital experience. Seamlessly{" "}
            <span className="text-white">host thousands of applications</span>, leverage advanced{" "}
            <span className="text-white">crypto bots for automated trading</span>, and access
            comprehensive project insights and Web3 data—all safeguarded by your{" "}
            <span className="text-white">unique SONAR ID</span>. This game-changing platform
            ensures unparalleled security and customization, setting a new standard for efficient
            and secure Web3 workflows.
          </motion.p>

          <div className="mt-12">
            {FEATURES.map((feature) => (
              <Chapter
                key={feature.id}
                index={feature.index}
                title={feature.title}
                body={feature.body}
                isActive={active === feature.id}
                reduced={reduced}
                onActive={() => setActive(feature.id)}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="mt-12 flex flex-wrap items-center gap-4"
          >
            <button
              type="button"
              className="group inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.12em] text-black transition-transform duration-300 hover:scale-[1.03] active:scale-95"
            >
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-black"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
              Coming Soon
            </button>
            <a
              href="#roadmap"
              className="group inline-flex items-center gap-2.5 rounded-full border border-white/25 px-8 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black active:scale-95"
            >
              Roadmap
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
