"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { label: "Claim", href: "#sonar-id-claim" },
  { label: "Wallet", href: "#sonar-wallet" },
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Team", href: "#team" },
];

export default function TopNav() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        solid
          ? "border-b border-sonar-line bg-sonar-void/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-10">
        <a href="#home" className="flex items-center gap-2.5 text-sonar-ink">
          <span className="sonar-dot" aria-hidden="true" />
          <span className="text-[15px] font-bold tracking-[0.22em]">SONAR</span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] font-medium text-sonar-ink-dim transition-colors duration-200 hover:text-sonar-ink"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a href="#sonar-id-claim" className="btn-primary !px-5 !py-2 text-[13px]">
          Claim ID
        </a>
      </nav>
    </header>
  );
}
