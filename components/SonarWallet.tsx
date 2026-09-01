"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
} from "framer-motion";
import gsap from "gsap";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Box,
  Check,
  Copy,
  Download,
  ExternalLink,
  Frame,
  Gem,
  Hexagon,
  Image as ImageIcon,
  Layers,
  Send as SendIcon,
  Shapes,
} from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const EASE = [0.22, 1, 0.36, 1] as const;

type NetworkKey = "ethereum" | "bnb" | "polygon" | "solana";
type Tab = "tokens" | "nfts" | "activity";

interface Token {
  sym: string;
  name: string;
  sub: string;
  usd: number;
  change: string;
}

const NETWORKS: Record<
  NetworkKey,
  { chip: string; net: string; tokens: Token[] }
> = {
  ethereum: {
    chip: "EVM A… 0x25AF…15bd",
    net: "Ethereum",
    tokens: [
      { sym: "ETH", name: "Ethereum", sub: "1.02 ETH", usd: 404.18, change: "+$24.50" },
      { sym: "WBTC", name: "Wrapped BTC", sub: "0.08 BTC", usd: 554.18, change: "+$12.10" },
      { sym: "STETH", name: "Staked ETH", sub: "1.02 ETH", usd: 654.18, change: "+$24.50" },
    ],
  },
  bnb: {
    chip: "BSC 0x9fC3…77aa",
    net: "BNB Chain",
    tokens: [
      { sym: "BNB", name: "BNB", sub: "1.20 BNB", usd: 361.1, change: "+$9.80" },
      { sym: "CAKE", name: "PancakeSwap", sub: "95 CAKE", usd: 188.2, change: "+$6.20" },
      { sym: "BTCB", name: "Bitcoin BEP-20", sub: "0.05 BTC", usd: 455.88, change: "+$15.40" },
    ],
  },
  polygon: {
    chip: "MATIC 0x44b1…02e9",
    net: "Polygon",
    tokens: [
      { sym: "POL", name: "Polygon", sub: "1,240 POL", usd: 412.75, change: "+$11.05" },
      { sym: "QUICK", name: "QuickSwap", sub: "18 QUICK", usd: 205.3, change: "+$4.10" },
      { sym: "STMATIC", name: "Staked MATIC", sub: "500 MATIC", usd: 402.05, change: "+$9.90" },
    ],
  },
  solana: {
    chip: "SOL 7Xkq…m2vE",
    net: "Solana",
    tokens: [
      { sym: "SOL", name: "Solana", sub: "3.10 SOL", usd: 448.95, change: "+$18.60" },
      { sym: "JUP", name: "Jupiter", sub: "320 JUP", usd: 176.4, change: "+$5.75" },
      { sym: "JITOSOL", name: "Jito Staked SOL", sub: "12 JITOSOL", usd: 394.66, change: "+$14.20" },
    ],
  },
};

const NETWORK_ORDER: NetworkKey[] = ["ethereum", "bnb", "polygon", "solana"];

const NFTS = [
  { name: "Sonar Genesis #041", floor: "2.40 ETH", Icon: Gem },
  { name: "Void Mask #017", floor: "1.10 ETH", Icon: ImageIcon },
  { name: "Chain Bloom #233", floor: "0.85 ETH", Icon: Shapes },
  { name: "Node Relic #009", floor: "3.20 ETH", Icon: Box },
  { name: "Hex Saint #118", floor: "0.60 ETH", Icon: Hexagon },
  { name: "Silver Frame #076", floor: "1.45 ETH", Icon: Frame },
];

interface ActivityItem {
  hash: string;
  label: string;
  amount: string;
  time: string;
}

const INITIAL_ACTIVITY: ActivityItem[] = [
  { hash: "0x8f42…9d1c", label: "Received · Ethereum", amount: "+$1,240.00", time: "2m" },
  { hash: "0x51c7…04be", label: "Sent · BNB Chain", amount: "-$96.40", time: "1h" },
];

const SIGN_LOG = ["SIGNING TRANSACTION…", "BROADCASTING TO MEMPOOL…", "CONFIRMED ✓"];

const fmtUsd = (v: number) =>
  `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

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

export default function SonarWallet() {
  const reduced = usePrefersReducedMotion();
  const [hoverCapable] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches
  );

  const [open, setOpen] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const startedRef = useRef(false);
  const idleTweensRef = useRef<gsap.core.Tween[]>([]);
  const unlockCtxRef = useRef<gsap.Context | null>(null);

  const [network, setNetwork] = useState<NetworkKey>("ethereum");
  const [tokens, setTokens] = useState<Token[]>([...NETWORKS.ethereum.tokens]);
  const [tab, setTab] = useState<Tab>("tokens");
  const [balance, setBalance] = useState(2020433);
  const [display, setDisplay] = useState(0);
  const displayRef = useRef(0);
  const [activity, setActivity] = useState<ActivityItem[]>(INITIAL_ACTIVITY);

  const [sendStep, setSendStep] = useState<"idle" | "form" | "signing" | "flying">("idle");
  const [sendTo, setSendTo] = useState("");
  const [sendAmt, setSendAmt] = useState("");
  const [signLog, setSignLog] = useState(0);
  const [depositing, setDepositing] = useState(false);
  const busy = sendStep !== "idle" || depositing;

  const [packet, setPacket] = useState<
    null | { x0: number; y0: number; x1: number; y1: number; label: string; mode: "send" | "deposit" }
  >(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const doorLRef = useRef<HTMLDivElement>(null);
  const doorRRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLButtonElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const quickRefs = useRef<{ x: (v: number) => void; y: (v: number) => void }[]>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const later = (fn: () => void, ms: number) => {
    timersRef.current.push(setTimeout(fn, ms));
  };

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  const vaultRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (reduced) {
      setOpen(true);
      return;
    }
  }, [reduced]);

  useEffect(() => {
    if (open || reduced) return;
    const tweens: gsap.core.Tween[] = [];
    if (scanRef.current) {
      tweens.push(
        gsap.fromTo(
          scanRef.current,
          { y: -50 },
          { y: 50, duration: 1.6, ease: "sine.inOut", repeat: -1, yoyo: true }
        )
      );
    }
    const fpGroup = overlayRef.current?.querySelector("[data-fp-group]");
    if (fpGroup) {
      tweens.push(
        gsap.fromTo(
          fpGroup,
          { opacity: 1 },
          { opacity: 0.45, duration: 1.8, ease: "sine.inOut", repeat: -1, yoyo: true }
        )
      );
    }
    idleTweensRef.current = tweens;
    return () => {
      tweens.forEach((t) => t.kill());
    };
  }, [open, reduced]);

  useEffect(() => () => unlockCtxRef.current?.revert(), []);

  const handleUnlock = () => {
    if (open || startedRef.current) return;
    startedRef.current = true;
    if (reduced) {
      setOpen(true);
      return;
    }
    setUnlocking(true);
    idleTweensRef.current.forEach((t) => t.kill());

    const ctx = gsap.context(() => {
      const fpPaths = overlayRef.current?.querySelectorAll("[data-fp-path]");
      const logLines = overlayRef.current?.querySelectorAll("[data-vault-log]");
      const tl = gsap.timeline({ onComplete: () => setOpen(true) });
      if (hintRef.current) {
        tl.to(hintRef.current, { autoAlpha: 0, duration: 0.2, ease: "none" }, 0);
      }
      if (fpPaths && fpPaths.length) {
        tl.fromTo(
          fpPaths,
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, stagger: 0.08, duration: 0.5, ease: "power1.inOut", overwrite: "auto" },
          0.05
        );
      }
      if (scanRef.current) {
        tl.fromTo(
          scanRef.current,
          { y: -56 },
          { y: 56, duration: 0.6, ease: "power1.inOut", overwrite: "auto" },
          0.1
        );
      }
      if (logLines && logLines.length) {
        tl.fromTo(logLines, { opacity: 0 }, { opacity: 1, stagger: 0.2, duration: 0.22 }, 0.5);
      }
      if (overlayRef.current) {
        tl.to(overlayRef.current, { autoAlpha: 0, duration: 0.3, ease: "none" }, 1.5);
      }
      if (doorLRef.current) {
        tl.to(doorLRef.current, { rotateY: -108, duration: 0.8, ease: "power2.inOut" }, 1.55);
      }
      if (doorRRef.current) {
        tl.to(doorRRef.current, { rotateY: 108, duration: 0.8, ease: "power2.inOut" }, 1.55);
      }
    }, vaultRef);
    unlockCtxRef.current = ctx;
  };

  useEffect(() => {
    if (!open) return;
    if (reduced) {
      displayRef.current = balance;
      setDisplay(balance);
      return;
    }
    const from = displayRef.current;
    const controls = animate(from, balance, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        displayRef.current = v;
        setDisplay(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [balance, open, reduced]);

  useEffect(() => {
    if (!open || reduced || !hoverCapable) return;
    quickRefs.current = rowRefs.current
      .filter((el): el is HTMLDivElement => Boolean(el))
      .map((el) => ({
        x: gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" }),
      }));
    return () => {
      rowRefs.current.forEach((el) => el && gsap.killTweensOf(el));
    };
  }, [open, reduced, hoverCapable, tab, network]);

  const handleMagnet = (e: React.MouseEvent) => {
    if (!quickRefs.current.length || !panelRef.current) return;
    const panelRect = panelRef.current.getBoundingClientRect();
    const mx = e.clientX - panelRect.left;
    const my = e.clientY - panelRect.top;
    rowRefs.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left - panelRect.left + r.width / 2;
      const cy = r.top - panelRect.top + r.height / 2;
      const dx = mx - cx;
      const dy = my - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const f = Math.max(0, 1 - dist / 150);
      const q = quickRefs.current[i];
      if (!q) return;
      q.x(dx * f * 0.14);
      q.y(dy * f * 0.2);
    });
  };

  const resetMagnet = () => {
    quickRefs.current.forEach((q) => {
      q.x(0);
      q.y(0);
    });
  };

  const cycleNetwork = () => {
    if (busy) return;
    const idx = NETWORK_ORDER.indexOf(network);
    const next = NETWORK_ORDER[(idx + 1) % NETWORK_ORDER.length];
    setNetwork(next);
    setTokens([...NETWORKS[next].tokens]);
  };

  const amt = parseFloat(sendAmt);
  const sendValid =
    /^@[a-z0-9._-]{1,24}$/i.test(sendTo) && !Number.isNaN(amt) && amt > 0 && amt <= tokens[0].usd;

  const launchCoords = (mode: "send" | "deposit", label: string) => {
    const panel = panelRef.current;
    const from = mode === "send" ? rowRefs.current[0] : chipRef.current;
    const to = mode === "send" ? chipRef.current : rowRefs.current[0];
    if (!panel || !from || !to) return;
    const pr = panel.getBoundingClientRect();
    const fr = from.getBoundingClientRect();
    const tr = to.getBoundingClientRect();
    setPacket({
      x0: fr.left - pr.left + fr.width / 2,
      y0: fr.top - pr.top + fr.height / 2,
      x1: tr.left - pr.left + tr.width / 2,
      y1: tr.top - pr.top + tr.height / 2,
      label,
      mode,
    });
  };

  const confirmSend = () => {
    if (!sendValid || sendStep !== "form") return;
    setSendStep("signing");
    setSignLog(0);
    SIGN_LOG.forEach((_, i) => {
      later(() => setSignLog(i + 1), 450 * (i + 1));
    });
    later(() => {
      setSendStep("flying");
      launchCoords("send", `-${fmtUsd(amt)}`);
    }, 450 * SIGN_LOG.length + 250);
  };

  const applySend = () => {
    const value = amt;
    setTokens((prev) =>
      prev.map((t, i) => (i === 0 ? { ...t, usd: t.usd - value } : i === 1 ? { ...t, usd: t.usd + value } : t))
    );
    setBalance((b) => Math.max(0, b - value));
    setActivity((prev) => [
      {
        hash: `0x${Math.random().toString(16).slice(2, 6)}…${Math.random().toString(16).slice(2, 6)}`,
        label: `Sent · ${sendTo} · ${NETWORKS[network].net}`,
        amount: `-${fmtUsd(value)}`,
        time: "now",
      },
      ...prev,
    ]);
    setSendStep("idle");
    setSendTo("");
    setSendAmt("");
    setPacket(null);
  };

  const startDeposit = () => {
    if (depositing || sendStep !== "idle") return;
    setDepositing(true);
    later(() => {
      setDepositing(false);
      setSendStep("flying");
      launchCoords("deposit", "+$500.00");
    }, 1100);
  };

  const applyDeposit = () => {
    setTokens((prev) => prev.map((t, i) => (i === 0 ? { ...t, usd: t.usd + 500 } : t)));
    setBalance((b) => b + 500);
    setActivity((prev) => [
      {
        hash: `0x${Math.random().toString(16).slice(2, 6)}…${Math.random().toString(16).slice(2, 6)}`,
        label: `Received · Deposit · ${NETWORKS[network].net}`,
        amount: "+$500.00",
        time: "now",
      },
      ...prev,
    ]);
    setPacket(null);
    setSendStep("idle");
  };

  const tileClass =
    "flex flex-col items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-2 py-3.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.05] hover:text-white disabled:opacity-40 disabled:pointer-events-none";

  return (
    <section
      id="sonar-wallet"
      className="sonar-bg relative w-full border-t border-white/[0.06] py-24 md:py-36"
    >
      <div className="mx-auto grid w-full max-w-[1440px] items-center gap-14 px-6 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-16">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/40"
          >
            {"//"} Sonar Wallet
          </motion.p>

          <h2 className="mt-8 font-display text-[clamp(3rem,7.5vw,7rem)] font-black uppercase leading-[0.88] tracking-[-0.04em]">
            <MaskLine delay={0.05} reduced={reduced}>
              Sonar
            </MaskLine>
            <MaskLine delay={0.13} reduced={reduced} outlined>
              Wallet
            </MaskLine>
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em]"
          >
            <span className="text-white/50">With Native</span>
            <span className="text-white">Sonar ID</span>
            <span className="text-white/50">Integration</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
            className="mt-8 max-w-[58ch] text-sm leading-[1.85] text-white/55 sm:text-base"
          >
            SONAR Wallet introduces a new way to manage digital assets by leveraging{" "}
            <span className="text-white">SONAR IDs</span> for simplified and secure transactions.
            Instead of traditional wallet addresses, users can send and receive funds using a{" "}
            <span className="text-white">single, recognizable username</span>. Supporting{" "}
            <span className="text-white">cross-chain transfers</span>, SONAR Wallet enhances{" "}
            <span className="text-white">interoperability between different blockchain networks</span>{" "}
            while maintaining security and efficiency.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="mt-12"
          >
            <button
              type="button"
              className="inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.12em] text-black transition-transform duration-300 hover:scale-[1.03] active:scale-95"
            >
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-black"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
              Coming Soon
            </button>
          </motion.div>
        </div>

        <div ref={vaultRef} className="relative">
          <div
            ref={panelRef}
            onMouseMove={handleMagnet}
            onMouseLeave={resetMagnet}
            className="relative mx-auto w-full max-w-[460px] select-none"
            style={{ perspective: 1400 }}
          >
            <motion.div
              initial={false}
              animate={open ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.985 }}
              transition={{ duration: reduced ? 0.15 : 0.7, ease: EASE }}
              className="relative z-10 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0b0f] shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3.5 sm:px-5">
                <button
                  ref={chipRef}
                  type="button"
                  onClick={cycleNetwork}
                  disabled={busy}
                  className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 transition-colors duration-300 hover:border-white/25 disabled:opacity-50"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-white/10 font-mono text-[9px] font-bold text-white/80">
                    {network === "solana" ? "S" : "E"}
                  </span>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={network}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                      className="font-mono text-[11px] text-white/75"
                    >
                      {NETWORKS[network].chip}
                    </motion.span>
                  </AnimatePresence>
                  <ArrowUpRight className="h-3 w-3 text-white/30 transition-colors group-hover:text-white/70" />
                </button>
                <div className="flex items-center gap-3 text-white/30">
                  <Copy className="h-4 w-4 transition-colors hover:text-white/70" aria-hidden="true" />
                  <ExternalLink className="h-4 w-4 transition-colors hover:text-white/70" aria-hidden="true" />
                </div>
              </div>

              <div className="px-4 pb-5 pt-5 sm:px-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
                  Your balance
                </p>
                <div className="mt-1.5 flex flex-wrap items-baseline gap-3">
                  <p className="font-display text-[clamp(1.9rem,5vw,2.6rem)] font-bold tracking-tight text-white tabular-nums">
                    ${display.toLocaleString("en-US")}
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-2.5 py-1 font-mono text-[10px] text-white/70">
                    +12.44%
                  </span>
                </div>
                <svg viewBox="0 0 400 52" className="mt-3 h-12 w-full" aria-hidden="true">
                  <motion.path
                    d="M0 42 C 30 38, 55 44, 80 34 S 140 18, 175 26 S 240 40, 280 22 S 350 8, 400 16"
                    fill="none"
                    stroke="rgba(255,255,255,0.55)"
                    strokeWidth="1.5"
                    initial={reduced || !open ? { pathLength: open ? 1 : 0 } : { pathLength: 0 }}
                    animate={{ pathLength: open ? 1 : 0 }}
                    transition={{ duration: 1.8, ease: EASE, delay: 0.25 }}
                  />
                  <motion.path
                    d="M0 47 C 45 45, 80 48, 120 43 S 200 36, 250 39 S 340 30, 400 33"
                    fill="none"
                    stroke="rgba(255,255,255,0.14)"
                    strokeWidth="1.5"
                    initial={reduced || !open ? { pathLength: open ? 1 : 0 } : { pathLength: 0 }}
                    animate={{ pathLength: open ? 1 : 0 }}
                    transition={{ duration: 1.8, ease: EASE, delay: 0.5 }}
                  />
                </svg>
              </div>

              <div className="grid grid-cols-4 gap-2.5 px-4 sm:px-5">
                <button type="button" className={tileClass} onClick={cycleNetwork} disabled={busy}>
                  <Layers className="h-5 w-5" aria-hidden="true" />
                  Networks
                </button>
                <button
                  type="button"
                  className={tileClass}
                  onClick={() => setTab("nfts")}
                  disabled={busy}
                >
                  <Gem className="h-5 w-5" aria-hidden="true" />
                  NFT
                </button>
                <button
                  type="button"
                  className={tileClass}
                  onClick={() => setSendStep("form")}
                  disabled={busy}
                >
                  <SendIcon className="h-5 w-5" aria-hidden="true" />
                  Send
                </button>
                <button type="button" className={tileClass} onClick={startDeposit} disabled={busy}>
                  <Download className="h-5 w-5" aria-hidden="true" />
                  {depositing ? "Processing" : "Deposit"}
                </button>
              </div>

              <div className="mt-5 flex items-center justify-between border-y border-white/[0.06] px-4 sm:px-5">
                <div className="flex items-center gap-1">
                  {(["tokens", "nfts", "activity"] as Tab[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTab(t)}
                      disabled={busy}
                      className={`relative px-3 py-3 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 disabled:opacity-40 ${
                        tab === t ? "text-white" : "text-white/35 hover:text-white/65"
                      }`}
                    >
                      {t}
                      {tab === t && (
                        <motion.span
                          layoutId="wallet-tab-underline"
                          className="absolute inset-x-2 bottom-0 h-px bg-white/70"
                          transition={{ duration: 0.4, ease: EASE }}
                        />
                      )}
                    </button>
                  ))}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
                  {NETWORKS[network].net}
                </span>
              </div>

              <div className="relative min-h-[248px] px-4 py-4 sm:px-5">
                <AnimatePresence mode="wait" initial={false}>
                  {tab === "tokens" && (
                    <motion.div
                      key="tokens"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="space-y-2.5"
                    >
                      {tokens.map((token, i) => (
                        <div
                          key={`${network}-${token.sym}`}
                          ref={(el) => {
                            rowRefs.current[i] = el;
                          }}
                          className="will-change-transform"
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
                            className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-3"
                          >
                            <div className="flex items-center gap-3">
                              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 font-mono text-[9px] font-bold text-white/70">
                                {token.sym.slice(0, 4)}
                              </span>
                              <div>
                                <p className="text-sm font-medium text-white/90">{token.name}</p>
                                <p className="font-mono text-[10px] text-white/35">{token.sub}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-white tabular-nums">
                                {fmtUsd(token.usd)}
                              </p>
                              <p className="font-mono text-[10px] text-white/40 tabular-nums">
                                {token.change}
                              </p>
                            </div>
                          </motion.div>
                        </div>
                      ))}
                      <p className="pt-1 text-right font-mono text-[9px] uppercase tracking-[0.25em] text-white/20">
                        + 7 more assets
                      </p>
                    </motion.div>
                  )}

                  {tab === "nfts" && (
                    <motion.div
                      key="nfts"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="grid grid-cols-3 gap-2.5"
                    >
                      {NFTS.map((nft, i) => (
                        <motion.div
                          key={nft.name}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, ease: EASE, delay: i * 0.05 }}
                          className="group flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.05]"
                        >
                          <nft.Icon
                            className="h-6 w-6 text-white/50 transition-colors duration-300 group-hover:text-white"
                            aria-hidden="true"
                          />
                          <p className="px-1 text-center font-mono text-[8px] uppercase tracking-[0.12em] text-white/40">
                            {nft.name}
                          </p>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {tab === "activity" && (
                    <motion.div
                      key="activity"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="space-y-2.5"
                    >
                      {activity.map((item, i) => (
                        <motion.div
                          key={item.hash + item.amount + i}
                          layout
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, ease: EASE }}
                          className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-3"
                        >
                          <div>
                            <p className="text-sm text-white/85">{item.label}</p>
                            <p className="font-mono text-[10px] text-white/35">
                              {item.hash} · {item.time}
                            </p>
                          </div>
                          <p
                            className={`font-mono text-sm tabular-nums ${
                              item.amount.startsWith("+") ? "text-white" : "text-white/50"
                            }`}
                          >
                            {item.amount}
                          </p>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {sendStep === "form" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 z-20 flex flex-col justify-center gap-4 bg-[#0a0b0f]/95 px-5 backdrop-blur-sm"
                    >
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                        Send — {NETWORKS[network].net}
                      </p>
                      <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                          Recipient
                        </span>
                        <input
                          type="text"
                          value={sendTo}
                          onChange={(e) => setSendTo(e.target.value)}
                          placeholder="@maya.sol"
                          className="mt-1.5 w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 font-mono text-base text-white placeholder:text-white/25 focus:border-white/40 focus:outline-none"
                        />
                      </label>
                      <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                          Amount (USD) — max {fmtUsd(tokens[0].usd)}
                        </span>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={sendAmt}
                          onChange={(e) => setSendAmt(e.target.value.replace(/[^0-9.]/g, ""))}
                          placeholder="50.00"
                          className="mt-1.5 w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 font-mono text-base text-white placeholder:text-white/25 focus:border-white/40 focus:outline-none"
                        />
                      </label>

                      <AnimatePresence>
                        {sendStep === "signing" && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-1 font-mono text-[11px] text-white/50"
                          >
                            {SIGN_LOG.slice(0, signLog).map((line, i) => (
                              <p key={line} className={i === signLog - 1 ? "text-white" : ""}>
                                {">"} {line}
                              </p>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex gap-2.5">
                        <button
                          type="button"
                          onClick={confirmSend}
                          disabled={!sendValid || sendStep === "signing"}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.15em] text-black transition-all duration-300 hover:opacity-90 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                        >
                          {sendStep === "signing" ? (
                            "Signing…"
                          ) : (
                            <>
                              Confirm <Check className="h-3.5 w-3.5" aria-hidden="true" />
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSendStep("idle");
                            setSendTo("");
                            setSendAmt("");
                          }}
                          className="rounded-full border border-white/20 px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.15em] text-white/60 transition-colors duration-300 hover:border-white/50 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {!open && (
              <>
                <div
                  ref={doorLRef}
                  className="absolute inset-y-0 left-0 z-30 w-1/2 rounded-l-2xl border border-white/10 bg-[#0d0e12] will-change-transform"
                  style={{ transformOrigin: "left center" }}
                />
                <div
                  ref={doorRRef}
                  className="absolute inset-y-0 right-0 z-30 w-1/2 rounded-r-2xl border border-white/10 bg-[#0d0e12] will-change-transform"
                  style={{ transformOrigin: "right center" }}
                />
                <div
                  ref={overlayRef}
                  onClick={handleUnlock}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleUnlock();
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Tap to unlock the wallet"
                  className={`absolute inset-0 z-40 flex flex-col items-center justify-center gap-6 rounded-2xl outline-none ${
                    unlocking ? "pointer-events-none" : "cursor-pointer"
                  }`}
                >
                  <div className="relative h-[132px] w-[112px]" data-fp-group>
                    <svg viewBox="0 0 100 120" className="h-full w-full" aria-hidden="true">
                      {[
                        "M20 104 C 20 60, 30 30, 50 20 C 70 30, 80 60, 80 104",
                        "M30 104 C 30 64, 38 42, 50 35 C 62 42, 70 64, 70 104",
                        "M40 104 C 40 70, 45 52, 50 47 C 55 52, 60 70, 60 104",
                        "M50 104 L 50 80",
                      ].map((d) => (
                        <path
                          key={d}
                          data-fp-path
                          d={d}
                          fill="none"
                          stroke="rgba(255,255,255,0.45)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          pathLength={1}
                          style={{ strokeDasharray: 1, strokeDashoffset: 0 }}
                        />
                      ))}
                    </svg>
                    <div
                      ref={scanRef}
                      className="absolute left-1/2 top-1/2 h-[2px] w-[130%] -translate-x-1/2 -translate-y-1/2 bg-white/30"
                    />
                  </div>

                  <motion.p
                    ref={hintRef}
                    animate={{ opacity: [0.25, 0.9, 0.25] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/60"
                  >
                    Tap to unlock
                  </motion.p>

                  <div className="space-y-1.5 text-center font-mono text-[11px] text-white/45">
                    {[
                      "> initiating biometric scan",
                      "> identity verified",
                      "> access granted — @ericcott.90ab",
                    ].map((line) => (
                      <p key={line} data-vault-log className="opacity-0">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </>
            )}

            {packet && (
              <motion.div
                initial={{ x: packet.x0, y: packet.y0, opacity: 0, scale: 0.7 }}
                animate={{
                  x: [packet.x0, (packet.x0 + packet.x1) / 2, packet.x1],
                  y: [packet.y0, (packet.y0 + packet.y1) / 2 - 42, packet.y1],
                  opacity: [0, 1, 1, 0],
                  scale: [0.7, 1, 1, 0.8],
                }}
                transition={{ duration: 0.95, times: [0, 0.4, 0.8, 1], ease: "easeInOut" }}
                onAnimationComplete={() =>
                  packet.mode === "send" ? applySend() : applyDeposit()
                }
                className="pointer-events-none absolute left-0 top-0 z-50 will-change-transform"
              >
                <span
                  className={`inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border px-3.5 py-2 font-mono text-xs font-bold ${
                    packet.mode === "send"
                      ? "border-white/25 bg-[#16181e] text-white"
                      : "border-white bg-white text-black"
                  }`}
                >
                  {packet.mode === "send" ? (
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <ArrowDownLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  {packet.label}
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
