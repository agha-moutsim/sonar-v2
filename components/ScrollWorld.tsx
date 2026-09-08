"use client";

import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { Scenes, SCENE_SPACING } from "./scrollworld/scenes";

/* ------------------------------------------------------------------ */
/* Journey copy                                                        */
/* ------------------------------------------------------------------ */

type JourneySection = {
  id: string;
  rail: string;
  eyebrow: string;
  title: string;
  body: string;
  tags: string[];
  cta?: { label: string; href: string; kind: "primary" | "ghost" }[];
  anchor?: string;
};

const JOURNEY: JourneySection[] = [
  {
    id: "surface",
    rail: "Surface",
    eyebrow: "Web3, without the knot",
    title: "One name for the whole ocean.",
    body: "SONAR replaces a different address on every chain with a single identity you actually own. This page is the map — scroll to fly it.",
    tags: ["SONAR ID", "Cross-chain wallet", "One claim"],
    cta: [
      { label: "Claim your name", href: "#sonar-id-claim", kind: "primary" },
      { label: "See the wallet", href: "#sonar-wallet", kind: "ghost" },
    ],
  },
  {
    id: "tangle",
    rail: "The tangle",
    eyebrow: "The problem",
    title: "Crypto lost its name.",
    body: "Every chain mints another address. Twelve wallets later, you are pasting 42-character strings into forms and hoping. The mess compounds.",
    tags: ["42-char strings", "One per chain", "Paste & pray"],
  },
  {
    id: "identity",
    rail: "Your ID",
    eyebrow: "SONAR ID",
    title: "One username. Every chain routes through it.",
    body: "Claim a single readable name and point funds, dapps and people at it. Underneath, SONAR resolves to the right address on the right chain.",
    tags: ["Readable", "Resolvable", "Yours"],
  },
  {
    id: "routes",
    rail: "The routes",
    eyebrow: "The wallet",
    title: "Bridges built in, not bolted on.",
    body: "The SONAR wallet treats chains like islands in one archipelago. Move assets along known routes without exporting keys or copy-pasting addresses.",
    tags: ["Native routes", "No seed juggling", "Live identity"],
  },
  {
    id: "hub",
    rail: "The hub",
    eyebrow: "Coming soon",
    title: "The Hub is under construction.",
    body: "A home base for your identity: the ID, the wallet, and every integration in one place. The crane never left.",
    tags: ["In build", "Early access"],
  },
  {
    id: "claim",
    rail: "Claim",
    eyebrow: "Start here",
    title: "Claim the name before someone else does.",
    body: "A SONAR ID takes about a minute. After that, every chain knows you by one name.",
    tags: ["~1 minute", "Free name check"],
    anchor: "journey-claim",
    cta: [
      { label: "Claim your name", href: "#sonar-id-claim", kind: "primary" },
      { label: "Explore the ecosystem", href: "#ecosystem", kind: "ghost" },
    ],
  },
];

/* scroll length of each band, in viewport heights */
const BAND_VH = [205, 175, 175, 175, 175, 205];

/* ------------------------------------------------------------------ */
/* Camera rig — keyframed fly-through, scroll-scrubbed                 */
/* ------------------------------------------------------------------ */

type Keyframe = { pos: THREE.Vector3; look: THREE.Vector3 };

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeInOutQuint = (t: number) =>
  t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;

function buildKeyframes(): Keyframe[] {
  const S = SCENE_SPACING;
  const kfs: Keyframe[] = [];
  const V = (x: number, y: number, z: number, lx: number, ly: number, lz: number) =>
    kfs.push({ pos: new THREE.Vector3(x, y, z), look: new THREE.Vector3(lx, ly, lz) });

  // 0 — scenic establishing view of scene 0 (the greeting frame)
  V(-7, 6.5, 21, 0, 2.2, 0);
  for (let i = 0; i < 6; i++) {
    const X = i * S;
    if (i < 5) {
      // dive into scene i
      V(X + 2.5, 3.4, 12, X, 1.8, 0);
      // dwell close, slight orbit
      V(X + 7, 3.0, 8.5, X, 1.5, 0);
      // pull up + glide toward next scene (= approach of i+1)
      V(X + 26, 15, 27, X + S, 2, 0);
    } else {
      // final scene: dive, dwell, then a close push-in on the coin
      V(X + 2.5, 3.4, 12, X, 2.2, 0);
      V(X + 6.5, 3.0, 8.5, X, 3.2, 0);
      V(X + 3.8, 3.6, 7.5, X, 4.6, 0);
    }
  }
  return kfs;
}

function Rig({
  progressRef,
  reduced,
}: {
  progressRef: React.MutableRefObject<number>;
  reduced: boolean;
}) {
  const kfs = useMemo(buildKeyframes, []);
  const lookCurrent = useRef(new THREE.Vector3(0, 2.2, 0));
  const drift = useRef(0);

  useFrame(({ camera, size, clock }) => {
    const p = THREE.MathUtils.clamp(progressRef.current, 0, 1);
    // global p → keyframe u. Bands 0..4 span 2 KF-steps each, last spans 3.
    // band i covers u [3i, 3i+2]; the finale stretch is folded into band 5.
    const uMax = kfs.length - 1; // 18
    // map: 6 bands over uMax=18 → each band gets exactly 3 KF indices
    // (start inclusive, end exclusive → last band includes the finale index)
    const bandFloat = p * 6;
    const band = Math.min(5, Math.floor(bandFloat));
    const local = bandFloat - band;
    const uStart = band * 3;
    const u = Math.min(uMax, uStart + local * 3);

    const i = Math.min(kfs.length - 2, Math.floor(u));
    const t = u - i;
    const kind = i % 3; // 0: dive/descent, 1: settle, 2: pull-up
    const e = kind === 1 ? easeInOutQuint(t) : easeInOutCubic(t);

    const a = kfs[i];
    const b = kfs[i + 1];
    const pos = a.pos.clone().lerp(b.pos, e);
    const look = a.look.clone().lerp(b.look, e);

    // portrait framing: pull the camera back and up on narrow aspects
    const aspect = size.width / size.height;
    const f = THREE.MathUtils.clamp(1.55 / aspect, 1, 2.3);
    pos.sub(look).multiplyScalar(f).add(look);
    pos.y += (f - 1) * 2.2;

    // idle drift — a hand-held breath, never still
    if (!reduced) {
      drift.current = clock.elapsedTime;
      pos.x += Math.sin(drift.current * 0.4) * 0.18;
      pos.y += Math.sin(drift.current * 0.55 + 1.3) * 0.12;
    }

    camera.position.lerp(pos, 0.12);
    lookCurrent.current.lerp(look, 0.09);
    camera.lookAt(lookCurrent.current);
  });

  return null;
}

/* ------------------------------------------------------------------ */
/* World                                                               */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Overlay helpers                                                     */
/* ------------------------------------------------------------------ */

const fadeWindow = (t: number, a: number, b: number, c: number, d: number) => {
  if (t <= a || t >= d) return 0;
  if (t < b) return (t - a) / (b - a);
  if (t <= c) return 1;
  return 1 - (t - c) / (d - c);
};

/* ------------------------------------------------------------------ */
/* ScrollWorld                                                         */
/* ------------------------------------------------------------------ */

export default function ScrollWorld() {
  const reduced = usePrefersReducedMotion();
  const progressRef = useRef(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const bands = useRef<{ top: number; height: number }[]>([]);

  const measure = () => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const wrapTop = wrap.getBoundingClientRect().top + window.scrollY;
    bands.current = sectionRefs.current.map((el) => {
      if (!el) return { top: 0, height: 1 };
      const top = el.getBoundingClientRect().top + window.scrollY - wrapTop;
      return { top, height: el.offsetHeight };
    });
  };

  useEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* single rAF: smooth scroll → progress + drive copy opacity/transform + rail */
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const wrap = wrapRef.current;
      if (wrap && bands.current.length === JOURNEY.length) {
        const vh = window.innerHeight;
        const wrapTop = bands.current[0].top;
        const totalScroll = wrap.offsetHeight - vh;
        const y = window.scrollY - wrapTop;
        const target = THREE.MathUtils.clamp(totalScroll > 0 ? y / totalScroll : 0, 0, 1);
        // critically-damped-ish smoothing
        progressRef.current += (target - progressRef.current) * Math.min(1, dt * 6.5);

        // copy visibility per band
        const scrollAbs = progressRef.current * totalScroll;
        for (let i = 0; i < JOURNEY.length; i++) {
          const b = bands.current[i];
          const t = THREE.MathUtils.clamp((scrollAbs - b.top) / b.height, 0, 1);
          let v: number;
          if (i === 0) v = 1 - Math.max(0, (t - 0.8) / 0.16);
          else if (i === JOURNEY.length - 1) v = fadeWindow(t, 0.1, 0.3, 2, 3) || (t > 0.3 ? 1 : 0);
          else v = fadeWindow(t, 0.1, 0.28, 0.72, 0.9);
          const el = copyRefs.current[i];
          if (el) {
            el.style.opacity = String(v);
            el.style.transform = `translateY(${(1 - v) * 26}px)`;
            el.style.visibility = v <= 0.001 ? "hidden" : "visible";
          }
          const isAct = t > 0.35 && t < 1 || (i === JOURNEY.length - 1 && t > 0.3);
          if (isAct) {
            for (let j = 0; j < railRefs.current.length; j++) {
              const btn = railRefs.current[j];
              if (btn) btn.dataset.active = j === i ? "true" : "false";
            }
          }
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToBand = (i: number) => {
    const b = bands.current[i];
    if (!b) return;
    window.scrollTo({ top: b.top + b.height * 0.42, behavior: "smooth" });
  };

  return (
    <div ref={wrapRef} id="home" className="relative" aria-label="SONAR journey">
      {/* fixed WebGL layer */}
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <Canvas
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
          camera={{ fov: 40, near: 0.1, far: 420, position: [-7, 6.5, 21] }}
          frameloop="always"
        >
          <SceneRoot progressRef={progressRef} reduced={reduced} />
        </Canvas>
      </div>

      {/* scrim so copy always reads over the 3D */}
      <div
        className="pointer-events-none fixed inset-0 z-[5]"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, rgba(7,11,16,0.82) 0%, rgba(7,11,16,0.42) 38%, rgba(7,11,16,0) 62%)",
        }}
      />

      <TopRail
        railRefs={railRefs}
        onJump={scrollToBand}
      />

      {/* copy bands */}
      <div className="relative z-10">
        {JOURNEY.map((s, i) => (
          <section
            key={s.id}
            id={s.anchor}
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
            className="relative"
            style={{ height: `${BAND_VH[i]}vh` }}
          >
            <div className="sticky top-0 flex h-dvh items-center">
              <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
                <div
                  ref={(el) => {
                    copyRefs.current[i] = el;
                  }}
                  className="max-w-xl will-change-transform"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <p className="eyebrow mb-4">{s.eyebrow}</p>
                  <h2
                    className={
                      i === 0 ? "display-1 text-sonar-ink" : "display-2 text-sonar-ink"
                    }
                  >
                    {s.title}
                  </h2>
                  <p className="prose-sonar mt-5 text-[15px] md:text-base">{s.body}</p>
                  {s.tags.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {s.tags.map((tg) => (
                        <span key={tg} className="tag">
                          {tg}
                        </span>
                      ))}
                    </div>
                  )}
                  {s.cta && (
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      {s.cta.map((c) =>
                        c.kind === "primary" ? (
                          <a key={c.label} href={c.href} className="btn-primary">
                            {c.label}
                          </a>
                        ) : (
                          <a key={c.label} href={c.href} className="btn-ghost">
                            {c.label}
                          </a>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
              {i === 0 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sonar-ink-faint">
                  <div className="flex flex-col items-center gap-2">
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase">
                      Scroll to fly
                    </span>
                    <svg
                      width="14"
                      height="22"
                      viewBox="0 0 14 22"
                      fill="none"
                      className="animate-bounce"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 1v18M2 14l5 6 5-6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

/* SceneRoot keeps Rig inside Canvas with a proper ref */
function SceneRoot({
  progressRef,
  reduced,
}: {
  progressRef: React.MutableRefObject<number>;
  reduced: boolean;
}) {
  return (
    <>
      <color attach="background" args={["#070b10"]} />
      <fog attach="fog" args={["#070b10", 55, 200]} />
      <hemisphereLight args={["#f2ede4", "#16222c", 0.9]} />
      <directionalLight position={[42, 62, 30]} intensity={1.2} color="#fff1dd" />
      <directionalLight position={[-32, 22, -24]} intensity={0.28} color="#86c5b9" />
      <Scenes animate={!reduced} />
      {!reduced && (
        <Sparkles
          count={130}
          scale={[300, 46, 110]}
          position={[SCENE_SPACING * 2.5, 8, 0]}
          size={1.7}
          speed={0.22}
          opacity={0.4}
          color="#9adfd2"
        />
      )}
      <Rig progressRef={progressRef} reduced={reduced} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Route rail                                                          */
/* ------------------------------------------------------------------ */

function TopRail({
  railRefs,
  onJump,
}: {
  railRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  onJump: (i: number) => void;
}) {
  return (
    <nav
      aria-label="Journey route"
      className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3.5 lg:flex"
    >
      {JOURNEY.map((s, i) => (
        <button
          key={s.id}
          ref={(el) => {
            railRefs.current[i] = el;
          }}
          onClick={() => onJump(i)}
          data-active="false"
          className="group flex items-center gap-2.5 outline-offset-4"
          aria-label={`Go to ${s.rail}`}
        >
          <span className="font-mono text-[10px] tracking-[0.14em] text-sonar-ink-dim opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-[&[data-active=true]]:opacity-100">
            {s.rail.toUpperCase()}
          </span>
          <span
            className="block h-[3px] w-4 rounded-full bg-sonar-ink-faint/50 transition-all duration-300 group-[&[data-active=true]]:w-8 group-[&[data-active=true]]:bg-sonar-signal"
          />
        </button>
      ))}
    </nav>
  );
}
