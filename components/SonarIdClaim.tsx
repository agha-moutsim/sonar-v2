"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CreepyButton } from "@/components/ui/creepy-button";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const CHAINS = [
  { sym: "ETH" },
  { sym: "SOL" },
  { sym: "BNB" },
  { sym: "POL" },
  { sym: "AVAX" },
  { sym: "+8" },
];

const TAKEN = ["sonar", "admin", "root", "test", "support"];

const BENEFITS = [
  {
    title: "Truly unique",
    body: "No .eth, .app or .xyz extensions fighting over namespaces. One clean name that resolves to you — and only you.",
  },
  {
    title: "Yours forever",
    body: "No yearly renewals, no subscriptions. A single one-time claim and the name is permanently yours.",
  },
  {
    title: "Cross-chain by default",
    body: "One ID routes ETH, SOL, BNB and more. Pick the recipient, and the right chain is resolved automatically.",
  },
  {
    title: "Built for adoption",
    body: "Set up in a couple of clicks with zero learning curve — and built-in protection against address poisoning.",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

function revealProps(reduced: boolean, delay = 0) {
  return reduced
    ? {}
    : {
        initial: { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-12% 0px" },
        transition: { duration: 0.7, ease: EASE, delay },
      };
}

export function SonarIdClaim() {
  const reduced = usePrefersReducedMotion();
  const reveal = revealProps(reduced);

  const [name, setName] = useState("");
  const [phase, setPhase] = useState<"idle" | "checking" | "done">("idle");
  const [claimed, setClaimed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clean = name.replace(/[^a-z0-9-]/g, "").toLowerCase().slice(0, 20);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (!clean) {
      setPhase("idle");
      return;
    }
    setPhase("checking");
    timer.current = setTimeout(() => setPhase("done"), 500);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [clean]);

  const taken = TAKEN.includes(clean);
  const available = clean.length >= 3 && !taken;

  const status = claimed
    ? `> ${clean}.sonar — reserved for 48h. Connect a wallet to mint.`
    : !clean
      ? "> start typing to claim your name"
      : phase === "checking"
        ? "> resolving availability…"
        : clean.length < 3
          ? "> keep typing — min 3 characters"
          : taken
            ? `> ${clean}.sonar — already claimed`
            : `> ${clean}.sonar — available`;

  const statusTone = claimed
    ? "text-white/85"
    : !clean || phase === "checking" || clean.length < 3
      ? "text-white/40"
      : taken
        ? "text-white/35"
        : "text-white";

  const chipsActive = clean.length > 0;

  return (
    <section id="sonar-id-claim" className="sonar-bg relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 left-1/4 h-[28rem] w-[60rem] rounded-full bg-white/[0.05] blur-[140px]"
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-6 py-24 sm:px-10 lg:px-16 lg:py-36">
        {/* header */}
        <div className="grid items-end gap-10 lg:grid-cols-[1.35fr_0.65fr]">
          <motion.div {...reveal}>
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/40">
              {"//"} Register your identity once, use it forever
            </p>
            <h2 className="mt-6 font-display text-[clamp(2.6rem,7vw,6.5rem)] font-black uppercase leading-[0.92] tracking-[-0.04em]">
              <span className="block text-white">Send and Receive Crypto With</span>
              <span
                className="block text-transparent"
                style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.28)" }}
              >
                Just a Simple Username
              </span>
            </h2>
          </motion.div>

          <motion.div {...reveal} className="lg:pb-3">
            <p className="max-w-[42ch] text-[15px] leading-[1.8] text-white/55">
              One name routes every chain. No 0x strings, no renewals, no
              guesswork — claim it once and it resolves everywhere, forever.
            </p>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">
              No subscriptions · Yours forever
            </p>
          </motion.div>
        </div>

        {/* claim console */}
        <motion.div
          {...reveal}
          className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md transition-colors duration-300 focus-within:border-white/30 sm:mt-20 sm:p-6 lg:mx-0"
        >
          <form
            className="flex flex-col gap-4 sm:flex-row sm:items-center"
            onSubmit={(e) => {
              e.preventDefault();
              if (available) setClaimed(true);
            }}
          >
            <div className="flex min-w-0 flex-1 items-baseline gap-3 px-2">
              <span className="font-mono text-2xl text-white/60 sm:text-4xl">@</span>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setClaimed(false);
                }}
                placeholder="yourname"
                spellCheck={false}
                autoComplete="off"
                aria-label="Choose your SONAR ID username"
                className="w-full min-w-0 bg-transparent font-display text-2xl font-bold tracking-tight text-white outline-none placeholder:text-white/20 sm:text-4xl"
              />
              <span className="hidden shrink-0 font-mono text-lg text-white/30 sm:inline sm:text-2xl">
                .sonar
              </span>
            </div>

            <button
              type="submit"
              disabled={!available}
              className="group relative shrink-0 overflow-visible rounded-xl bg-white px-7 py-4 font-display text-sm font-bold uppercase tracking-[0.15em] text-black transition-[filter,opacity] duration-200 hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-30"
            >
              {claimed && !reduced && (
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-xl border border-white/70 opacity-60 [animation:hero-brand-ping_1.6s_ease-out_infinite]"
                />
              )}
              {claimed ? "Reserved" : "Claim ID"}
            </button>
          </form>

          <div className="mt-5 flex flex-col gap-3 border-t border-white/[0.07] px-2 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className={`font-mono text-xs ${statusTone}`}>
              {status}
              <span className="ml-1 animate-pulse text-white/50">▍</span>
            </p>

            <ul className="flex flex-wrap items-center gap-2">
              {CHAINS.map((chain, i) => (
                <li
                  key={chain.sym}
                  style={{ transitionDelay: `${i * 70}ms` }}
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.2em] transition-all duration-500 ${
                    chipsActive
                      ? "border-white/25 text-white/80"
                      : "border-white/[0.08] text-white/30"
                  }`}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-white/70"
                    style={{
                      opacity: chipsActive ? 1 : 0.35,
                      transition: "opacity 500ms",
                      transitionDelay: `${i * 70}ms`,
                    }}
                  />
                  {chain.sym}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* benefits — numbered index rows */}
        <motion.p
          {...reveal}
          className="mt-24 font-mono text-[11px] uppercase tracking-[0.35em] text-white/40 sm:mt-32"
        >
          {"//"} Benefits of SONAR IDs
        </motion.p>

        <ul className="mt-6">
          {BENEFITS.map((benefit, i) => (
            <motion.li
              key={benefit.title}
              {...revealProps(reduced, 0.08 * i)}
              className="group border-t border-white/[0.08] transition-colors duration-300 last:border-b hover:bg-white/[0.02] md:px-4"
            >
              <div className="grid grid-cols-[48px_1fr_32px] items-baseline gap-3 py-7 sm:py-8 md:grid-cols-[72px_1fr_48px]">
                <span className="font-mono text-sm text-white/35 transition-colors duration-300 group-hover:text-white">
                  / {String(i + 1).padStart(2, "0")}
                </span>

                <h3 className="font-display text-2xl font-bold tracking-tight text-white/90 transition-colors duration-300 group-hover:text-white sm:text-3xl lg:text-4xl">
                  {benefit.title}
                </h3>

                <ArrowUpRight
                  className="h-5 w-5 justify-self-end self-center text-white/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white"
                  aria-hidden
                />
              </div>

              <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr]">
                <div className="overflow-hidden">
                  <p className="max-w-[62ch] pb-7 text-sm leading-[1.8] text-white/45 sm:pb-9 md:pl-[84px]">
                    {benefit.body}
                  </p>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>

        {/* CTA */}
        <motion.div {...reveal} className="mt-16 flex justify-center">
          <CreepyButton
            type="button"
            onClick={() => window.open("#", "_self")}
            aria-label="Open the SONAR IDs documentation"
          >
            Documentation
          </CreepyButton>
        </motion.div>
      </div>
    </section>
  );
}

export default SonarIdClaim;
