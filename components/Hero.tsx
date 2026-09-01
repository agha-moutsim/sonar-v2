"use client";

import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import SonarCoinHero from "./sonar-coin/SonarCoinHero";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const menuItemVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.04 + i * 0.03,
      duration: 0.25,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
  exit: (i: number) => ({
    opacity: 0,
    x: 40,
    transition: {
      delay: (3 - i) * 0.015,
      duration: 0.15,
    },
  }),
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const mobileTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: "easeOut" as const };

  const panelVariants = {
    hidden: { x: "100%" },
    visible: { x: 0, transition: mobileTransition },
    exit: { x: "100%", transition: { duration: shouldReduceMotion ? 0 : 0.2, ease: "easeIn" as const } },
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navItems = ["Products", "Roadmap", "Docs", "Team"];

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* === NAVBAR === */}
      <motion.nav
        className="relative z-[60] flex items-center justify-between w-full pl-4 pr-6 md:pl-6 md:pr-10 pt-6 md:pt-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
      >
        <div className={`flex items-center transition-opacity duration-150 ${menuOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          <Image
            src="/images/sonar-logo-new.png"
            alt="SONAR"
            width={120}
            height={36}
            className="h-7 md:h-9 w-auto"
            style={{ width: "auto", height: "auto" }}
            priority
          />
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-sonar-ink-dim">
          {navItems.map((item) => (
            <motion.a
              key={item}
              href="#"
              className="relative hover:text-sonar-ink transition-colors duration-200"
              whileHover={{ y: -1 }}
            >
              {item}
            </motion.a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <motion.a
            href="#"
            className="hidden md:flex items-center px-5 md:px-7 py-2.5 md:py-3 rounded-full text-xs md:text-sm font-semibold text-sonar-ink border border-sonar-line/60 hover:border-sonar-magenta/50 hover:bg-sonar-magenta/10 transition-all duration-200"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            YOUR ID DASHBOARD
          </motion.a>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <motion.span
                className="block w-full h-[2px] bg-sonar-ink origin-left"
                animate={{
                  rotate: menuOpen ? 45 : 0,
                  y: menuOpen ? -1 : 0,
                }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.span
                className="block w-full h-[2px] bg-sonar-ink"
                animate={{
                  opacity: menuOpen ? 0 : 1,
                  x: menuOpen ? 10 : 0,
                }}
                transition={{ duration: 0.12 }}
              />
              <motion.span
                className="block w-full h-[2px] bg-sonar-ink origin-left"
                animate={{
                  rotate: menuOpen ? -45 : 0,
                  y: menuOpen ? 1 : 0,
                  width: menuOpen ? "100%" : "70%",
                }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </button>
        </div>
      </motion.nav>

      {/* === MOBILE MENU === */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/70 z-[55] md:hidden"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setMenuOpen(false)}
            />

            {/* Side Panel */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-[380px] z-[55] md:hidden will-change-transform"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="h-full w-full bg-sonar-panel border-l border-sonar-line/20 flex flex-col relative overflow-hidden">
                {/* Nav Links */}
                <nav className="relative z-10 flex flex-col gap-5 px-8 pt-20 shrink-0">
                  {navItems.map((item, i) => (
                    <motion.a
                      key={item}
                      href="#"
                      className="text-2xl font-[family-name:var(--font-space-grotesk)] font-semibold text-sonar-ink hover:text-sonar-magenta transition-colors duration-200"
                      custom={i}
                      variants={menuItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item}
                    </motion.a>
                  ))}
                </nav>

                {/* Spacer */}
                <div className="flex-1 min-h-[40px] max-h-[160px]" />

                {/* CTA Button */}
                <div className="relative z-10 px-8 pb-5 shrink-0">
                  <a
                    href="#"
                    className="inline-flex items-center px-8 py-4 rounded-full text-base font-semibold text-sonar-ink border border-sonar-line/60 hover:border-sonar-magenta/50 hover:bg-sonar-magenta/10 transition-all duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    YOUR ID DASHBOARD
                  </a>
                </div>

                {/* Footer */}
                <p className="relative z-10 px-8 pb-8 pt-2 shrink-0 font-[family-name:var(--font-space-mono)] text-[11px] text-sonar-ink-faint tracking-wide">
                  SONAR — Your Gateway to Web3
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* === HERO CONTENT === */}

      {/* Desktop: 4-Corner Layout */}
      <div className="relative flex-1 w-full px-4 md:px-10 py-4 md:py-6 hidden md:block">
        {/* Top-Left: OWN. */}
        <motion.div
          className="absolute top-4 left-4 z-10 md:left-[7rem] md:top-[5rem]"
          custom={0.2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <h1 className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase leading-[0.85] tracking-[-0.04em] text-white text-[clamp(56px,12vw,180px)]">
            OWN.
          </h1>
        </motion.div>

        {/* Top-Right: YOUR. */}
        <motion.div
          className="absolute top-4 right-4 z-10 text-right md:top-[5rem] md:right-[5rem]"
          custom={0.35}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <h1 className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase leading-[0.85] tracking-[-0.04em] text-white/80 text-[clamp(56px,12vw,180px)]">
            YOUR.
          </h1>
        </motion.div>

        {/* Bottom-Left: WEB3. */}
        <motion.div
          className="absolute bottom-4 left-4 z-10 md:left-[5rem] md:bottom-[8rem]"
          custom={0.5}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <h1 className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase leading-[0.85] tracking-[-0.04em] text-[#38bdf8] text-[clamp(56px,12vw,180px)]">
            WEB3.
          </h1>
        </motion.div>

        {/* Bottom-Right: DOMAIN. */}
        <motion.div
          className="absolute bottom-4 right-4 z-10 text-right md:bottom-[5rem] md:right-10"
          custom={0.65}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <h1 className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase leading-[0.85] tracking-[-0.04em] gradient-text text-[clamp(56px,12vw,180px)]">
            DOMAIN.
          </h1>
        </motion.div>

        {/* Center: 3D Coin */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Focused radial glow behind coin */}
          <div
            className="absolute w-[500px] h-[500px] md:w-[900px] md:h-[900px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(123,63,228,0.15) 0%, rgba(255,46,147,0.06) 40%, transparent 70%)',
            }}
          />
          <div className="relative w-[82vw] h-[82vw] max-w-[650px] max-h-[650px] md:max-w-[880px] md:max-h-[880px] pointer-events-auto">
            <SonarCoinHero />
          </div>
        </motion.div>

        {/* Subtle tagline below coin (desktop only) */}
        <motion.div
          className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-2"
          custom={0.9}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <p className="text-sm text-sonar-ink-dim tracking-wide">
            One name. Every chain.
          </p>
          <div className="flex items-center gap-1.5">
            {['Ethereum', 'Polygon', 'Base', 'Arbitrum'].map((chain) => (
              <span
                key={chain}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium text-sonar-ink-dim bg-white/5 border border-sonar-line/20"
              >
                {chain}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Mobile: Stacked Layout */}
      <div className="md:hidden flex flex-col items-center justify-center text-center flex-1 w-full px-6 pt-4 pb-6">
        <motion.span
          className="font-[family-name:var(--font-space-grotesk)] font-semibold text-[clamp(18px,5vw,26px)] leading-[1] tracking-[-0.02em] text-white/70"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          YOUR
        </motion.span>

        <motion.span
          className="font-[family-name:var(--font-space-grotesk)] font-bold text-[clamp(40px,13vw,64px)] leading-[1.05] tracking-[-0.03em] gradient-text"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          WEB3 DOMAIN
        </motion.span>

        <motion.div
          className="w-full max-w-[280px] relative mt-4 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <div
            className="absolute inset-0 -m-6 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 60%)',
            }}
          />
          <div className="relative w-full">
            <SonarCoinHero />
          </div>
        </motion.div>

        <motion.p
          className="text-sm text-sonar-ink-dim max-w-[280px] leading-relaxed mb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          Replacing complex blockchain addresses with simple, secure usernames.
        </motion.p>

        <motion.a
          href="#"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-sonar-void bg-gradient-to-r from-sonar-magenta to-[#B24CF0]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          Purchase a Username
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.a>

        <motion.div
          className="flex items-center gap-1.5 mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          {['ETH', 'MATIC', 'BASE', 'ARB'].map((chain) => (
            <span
              key={chain}
              className="px-1.5 py-0.5 rounded text-[9px] font-medium text-sonar-ink-dim bg-white/5 border border-sonar-line/20"
            >
              {chain}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to top, #0A0714, transparent)",
        }}
      />
    </section>
  );
}
