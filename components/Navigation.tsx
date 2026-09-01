"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks } from "../data/content";

function scrollToId(id: string) {
  const target = document.querySelector(id);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="relative flex items-center justify-between px-6 py-5 sm:px-8">
      <span className="text-[15px] font-medium tracking-tight text-white">
        Nexora
      </span>

      {/* Desktop nav */}
      <div className="hidden items-center gap-7 md:flex">
        {navLinks.map((link) => (
          <button
            key={link.href}
            onClick={() => scrollToId(link.href)}
            className="text-[13px] text-white/55 transition-colors duration-200 hover:text-white/90"
          >
            {link.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="hidden rounded-full border border-white/15 bg-white/[0.03] px-4 py-[7px] text-[13px] text-white/85 transition-all duration-200 hover:border-white/30 hover:bg-white/[0.07] md:inline-block"
      >
        Sign in
      </button>

      {/* Mobile toggle */}
      <button
        type="button"
        aria-label="Toggle menu"
        onClick={() => setMobileOpen((v) => !v)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 md:hidden"
      >
        {mobileOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-4 right-4 top-[64px] z-30 flex flex-col gap-1 rounded-2xl border border-white/10 bg-[#0a0a0a] p-3 shadow-xl md:hidden"
          >
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => {
                  scrollToId(link.href);
                  setMobileOpen(false);
                }}
                className="rounded-lg px-3 py-2 text-left text-[13px] text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              className="mt-1 rounded-lg border border-white/15 px-3 py-2 text-left text-[13px] text-white/85"
            >
              Sign in
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
