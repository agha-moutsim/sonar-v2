"use client";

import { useEffect, useRef, useState } from "react";
import { IdCard, CreditCard, Wallet } from "lucide-react";
import { ParticlesSwarm } from "../lib/particles-swarm";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";
import "./landing-hero.css";

const MENU_LINKS = [
  { label: "Digital IDs", href: "#sonar-ids" },
  { label: "Crypto Payments", href: "#sonar-wallet" },
  { label: "Web3 Wallets", href: "#sonar-hub" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Docs", href: "#ecosystem" },
  { label: "Team", href: "#team" },
];

export default function LandingHero() {
  const sharkRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const container = sharkRef.current;
    if (!container) return;

    const COUNT = window.matchMedia("(max-width: 720px)").matches ? 9000 : 20000;
    const isMobile = window.matchMedia("(max-width: 720px)").matches;
    const swarm = new ParticlesSwarm(container, isMobile ? 9000 : 20000);
    if (reduced) swarm.snapToFormation();

    return () => {
      swarm.dispose();
    };
  }, [reduced]);

  return (
    <div className="landing-hero">
      <nav className="navbar">
        <a className="nav-logo" href="#">
          <img src="/logo-sonar.png" alt="SONAR" className="nav-logo-img" />
        </a>

        <ul className="nav-links">
          <li className="nav-item has-dropdown">
            <a href="#" className="nav-link">
              Products
              <svg className="chev" width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M1 3l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </a>
            <div className="dropdown">
              <a href="#" className="dd-item">
                <span className="dd-icon">
                  <IdCard size={13} />
                </span>
                <span>Digital IDs</span>
              </a>
              <a href="#" className="dd-item">
                <span className="dd-icon">
                  <CreditCard size={13} />
                </span>
                <span>Crypto Payments</span>
              </a>
              <a href="#" className="dd-item">
                <span className="dd-icon">
                  <Wallet size={13} />
                </span>
                <span>Web3 Wallets</span>
              </a>
            </div>
          </li>
          <li className="nav-item">
            <a href="#roadmap" className="nav-link">
              Roadmap
            </a>
          </li>
          <li className="nav-item">
            <a href="#ecosystem" className="nav-link">
              Docs
            </a>
          </li>
          <li className="nav-item">
            <a href="#team" className="nav-link">
              Team
            </a>
          </li>
        </ul>

        <a href="#" className="animated-btn">
          <span className="ab-text">Your ID Dashboard</span>
          <span className="ab-border"></span>
        </a>

        <button
          type="button"
          className={`nav-burger ${menuOpen ? "open" : ""}`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="burger-line"></span>
          <span className="burger-line"></span>
        </button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <ul className="mm-links">
          {MENU_LINKS.map((link, i) => (
            <li
              key={link.label}
              style={{ transitionDelay: menuOpen ? `${0.08 + i * 0.055}s` : "0s" }}
            >
              <a href={link.href} onClick={() => setMenuOpen(false)}>
                <span className="mm-index">/ {String(i + 1).padStart(2, "0")}</span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#" className="mm-cta" onClick={() => setMenuOpen(false)}>
          Your ID Dashboard
        </a>
      </div>

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-center">
            <h1 className="ghost-title">GATEWAY TO WEB3</h1>
            <p className="subheadline">
              Building solutions to make Web3 accessible
              <br />
              and secure for everyone
            </p>
          </div>

          <div id="shark3d" ref={sharkRef}></div>

          <div className="mission">
            <h3>Our Mission</h3>
            <p>
              At <b>SONAR</b>, we&apos;re passionate innovators making <b>Web3</b> more
              accessible, secure, and effortless. With expertise across finance, <b>AI</b>,{" "}
              <b>blockchain</b>, engineering, and marketing, we build intuitive tools that
              simplify <b>digital identities</b>, <b>assets</b>, and <b>transactions</b> for
              everyone.
            </p>
          </div>

          <div className="map-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/world-card.png" alt="Self styled profile - world map card" />
          </div>
        </div>
      </section>
    </div>
  );
}
