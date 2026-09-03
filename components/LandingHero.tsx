"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { IdCard, CreditCard, Wallet } from "lucide-react";
import { SHARK_POS, SHARK_COL } from "../lib/shark-data";
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

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.TetrahedronGeometry(0.25);
    const material = new THREE.MeshBasicMaterial();
    const mesh = new THREE.InstancedMesh(geometry, material, COUNT);
    group.add(mesh);

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    const targets: THREE.Vector3[] = [];
    const current: THREE.Vector3[] = [];

    for (let i = 0; i < COUNT; i++) {
      current.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 16
        )
      );
      const idx = i * 3;
      targets.push(new THREE.Vector3(SHARK_POS[idx], SHARK_POS[idx + 1], SHARK_POS[idx + 2]));
      color.setRGB(SHARK_COL[idx] / 255, SHARK_COL[idx + 1] / 255, SHARK_COL[idx + 2] / 255);
      mesh.setColorAt(i, color);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    // Bounding box of the visible shark (data uses y < -100 as "hidden" markers)
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;
    for (let i = 0; i < COUNT; i++) {
      if (SHARK_POS[i * 3 + 1] < -100) continue;
      const x = SHARK_POS[i * 3];
      const y = SHARK_POS[i * 3 + 1];
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const rotX = 0.08;
    const halfW = (maxX - minX) / 2;
    const halfH = halfW * Math.sin(rotX) + ((maxY - minY) / 2) * Math.cos(rotX);
    const vFov = (camera.fov * Math.PI) / 180;
    // Y-rotation swings the shark's sides toward/away from the camera; the
    // near side gets magnified, so the camera distance must add that depth.
    const zSwing = halfW * Math.sin(0.35);

    const el = container;
    function resize() {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
      const pad = window.matchMedia("(max-width: 720px)").matches ? 1.1 : 1.4;
      const dist =
        Math.max(halfH / Math.tan(vFov / 2), halfW / Math.tan(hFov / 2)) * pad +
        zSwing;
      camera.position.set(cx, cy, dist);
      camera.lookAt(cx, cy, 0);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }
    window.addEventListener("resize", resize);
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    function applyInstances() {
      for (let i = 0; i < COUNT; i++) {
        dummy.position.copy(current[i]);
        const c = SHARK_COL[i * 3] + SHARK_COL[i * 3 + 1] + SHARK_COL[i * 3 + 2];
        const s = targets[i].y < -100 || c === 0 ? 0 : 1;
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }

    let raf = 0;
    const clock = new THREE.Clock();
    function animate() {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      for (let i = 0; i < COUNT; i++) {
        current[i].lerp(targets[i], 0.08);
      }
      applyInstances();

      group.rotation.y = Math.sin(t * 0.25) * 0.35;
      group.rotation.x = Math.sin(t * 0.18) * 0.08;

      renderer.render(scene, camera);
    }

    if (reduced) {
      for (let i = 0; i < COUNT; i++) current[i].copy(targets[i]);
      applyInstances();
      group.rotation.y = 0.2;
      renderer.render(scene, camera);
    } else {
      animate();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      ro.disconnect();
      mesh.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
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
