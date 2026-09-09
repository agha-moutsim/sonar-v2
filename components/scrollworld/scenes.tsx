"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  CLAY,
  clay,
  ClayRock,
  ClayTree,
  ClayHouse,
  ClayBridge,
  WaterRing,
  SonarRings,
  ShadowDisc,
  Floaty,
} from "./clay";
import {
  IdCard,
  AddressReceipt,
  ClaimForm,
  WalletCard,
  ComingSoonBoard,
  ClaimBillboard,
} from "./artifacts";

/* Six scenes of the journey, laid out left to right along +X.
   Each is a floating clay diorama. Camera dives into one, pulls up,
   glides to the next — scroll drives the whole flight. */

/* 1 — Surface. The greeting: a calm sea with a sonar buoy. */
export function SceneSurface({ animate = true }: { animate?: boolean }) {
  const mast = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!mast.current || !animate) return;
    mast.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.35;
  });
  return (
    <group>
      <WaterRing radius={8} />
      <WaterRing radius={10.5} opacity={0.16} />
      <ClayRock size={5.2} color={CLAY.sand} seed={1} />
      <mesh position={[0, 2.15, 0]} material={clay(CLAY.sand)}>
        <cylinderGeometry args={[3.4, 3.9, 0.6, 10]} />
      </mesh>
      {/* buoy */}
      <Floaty phase={1.2} amp={0.18} speed={0.8} animate={animate}>
        <group position={[1.6, 3.6, 0.8]}>
          <mesh material={clay(CLAY.terracotta)}>
            <capsuleGeometry args={[0.55, 0.5, 4, 10]} />
          </mesh>
          <mesh ref={mast} position={[0, 1.5, 0]} material={clay(CLAY.cream)}>
            <cylinderGeometry args={[0.06, 0.09, 2.2, 6]} />
          </mesh>
          <mesh position={[0, 2.7, 0]} material={clay(CLAY.sea)}>
            <icosahedronGeometry args={[0.3, 0]} />
          </mesh>
        </group>
      </Floaty>
      <SonarRings position={[1.6, 3.1, 0.8]} maxScale={5} speed={0.4} animate={animate} />
      <ClayTree position={[-2.2, 2.4, -0.8]} scale={1.15} />
      <ClayTree position={[-1.2, 2.45, 1.1]} scale={0.8} variant={1} />
      <ClayHouse position={[0.2, 2.45, -1.6]} rotation={[0, 0.5, 0]} scale={0.85} />
      <IdCard position={[-2.1, 5.9, 0.6]} />
      <ShadowDisc radius={9} y={-3.6} />
    </group>
  );
}

/* 2 — The tangle. Crypto without a name: chained chaos. */
export function SceneTangle({ animate = true }: { animate?: boolean }) {
  const tangle = useRef<THREE.Group>(null);
  const tubes = useMemo(() => {
    const curves: THREE.TubeGeometry[] = [];
    const paths: [number, number, number][][] = [
      [
        [-2.4, 4.6, 0.4],
        [0.4, 6.2, -1.2],
        [2.2, 4.4, 1.0],
        [0.2, 5.4, 2.2],
        [-2.4, 4.6, 0.4],
      ],
      [
        [1.8, 6.8, -0.6],
        [-0.8, 7.6, 1.4],
        [-2.6, 6.0, -0.4],
        [0.6, 5.2, -1.8],
        [1.8, 6.8, -0.6],
      ],
    ];
    for (const pts of paths) {
      const curve = new THREE.CatmullRomCurve3(
        pts.map((p) => new THREE.Vector3(...p))
      );
      curves.push(new THREE.TubeGeometry(curve, 48, 0.14, 6, true));
    }
    return curves;
  }, []);
  useFrame(({ clock }) => {
    if (!tangle.current || !animate) return;
    tangle.current.rotation.y = Math.sin(clock.elapsedTime * 0.25) * 0.12;
    tangle.current.position.y = Math.sin(clock.elapsedTime * 0.7) * 0.12;
  });
  return (
    <group>
      <WaterRing radius={7.5} />
      <ClayRock size={4.6} color={CLAY.stone} seed={2} flat={0.6} />
      <mesh position={[0, 2.0, 0]} material={clay(CLAY.stone)}>
        <cylinderGeometry args={[3.1, 3.5, 0.5, 9]} />
      </mesh>
      {/* half-sunk chain links on the ground */}
      {[
        [-2.0, 2.3, 1.2, 0.4],
        [-0.6, 2.2, 2.0, -0.7],
        [1.9, 2.3, 1.6, 0.2],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[Math.PI / 2, 0, r]} material={clay(CLAY.ink)}>
          <torusGeometry args={[0.55, 0.16, 6, 14]} />
        </mesh>
      ))}
      {/* the tangled mess, slowly twisting above the island */}
      <group ref={tangle} position={[0, 0.6, 0]}>
        {tubes.map((geo, i) => (
          <mesh key={i} geometry={geo} material={clay(i ? CLAY.terracotta : CLAY.ink)} />
        ))}
        {[
          [-2.4, 4.6, 0.4],
          [2.2, 4.4, 1.0],
          [1.8, 6.8, -0.6],
          [-2.6, 6.0, -0.4],
        ].map((p, i) => (
          <mesh key={i} position={p as [number, number, number]} rotation={[0.4, i, 0.2]} material={clay(CLAY.terracottaDark)}>
            <torusGeometry args={[0.5, 0.15, 6, 14]} />
          </mesh>
        ))}
        <mesh position={[0.2, 6.4, 1.6]} material={clay(CLAY.ink)}>
          <icosahedronGeometry args={[0.7, 0]} />
        </mesh>
      </group>
      <AddressReceipt position={[0.6, 3.8, 2.4]} rotation={[0, -0.18, -0.05]} />
      <ShadowDisc radius={8} y={-3.4} />
    </group>
  );
}

/* 3 — The ID. One lighthouse, one name, one beam over every chain. */
export function SceneLighthouse({ animate = true }: { animate?: boolean }) {
  const beam = useRef<THREE.Mesh>(null);
  const lamp = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!animate) return;
    if (beam.current) beam.current.rotation.y = clock.elapsedTime * 0.35;
    if (lamp.current) {
      const m = lamp.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 1.4 + Math.sin(clock.elapsedTime * 2.2) * 0.4;
    }
  });
  return (
    <group>
      <WaterRing radius={8.5} />
      <ClayRock size={5} color={CLAY.sandDark} seed={3} flat={0.7} />
      <mesh position={[0, 2.05, 0]} material={clay(CLAY.sand)}>
        <cylinderGeometry args={[3.5, 4.0, 0.55, 10]} />
      </mesh>
      {/* lighthouse */}
      <group position={[-0.6, 2.3, 0]}>
        <mesh position={[0, 2.0, 0]} material={clay(CLAY.cream)}>
          <cylinderGeometry args={[0.55, 0.85, 4.0, 9]} />
        </mesh>
        <mesh position={[0, 2.0, 0]} material={clay(CLAY.terracotta)}>
          <cylinderGeometry args={[0.87, 0.87, 0.55, 9]} />
        </mesh>
        <mesh position={[0, 4.25, 0]} material={clay(CLAY.ink)}>
          <cylinderGeometry args={[0.62, 0.55, 0.5, 9]} />
        </mesh>
        <mesh ref={lamp} position={[0, 4.25, 0]}>
          <icosahedronGeometry args={[0.34, 0]} />
          <meshStandardMaterial
            color="#fff3d6"
            emissive="#ffd98a"
            emissiveIntensity={1.5}
            flatShading
          />
        </mesh>
        <mesh position={[0, 4.85, 0]} material={clay(CLAY.terracotta)}>
          <coneGeometry args={[0.75, 0.7, 9]} />
        </mesh>
        {/* rotating beam */}
        <mesh ref={beam} position={[0, 4.25, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.8, 9, 12, 1, true]} />
          <meshBasicMaterial
            color="#ffe9b8"
            transparent
            opacity={0.13}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>
      <SonarRings position={[-0.6, 2.5, 0]} maxScale={6} speed={0.3} animate={animate} />
      {/* dock + rowboat */}
      <group position={[2.3, 2.1, 1.6]} rotation={[0, -0.5, 0]}>
        <mesh position={[0, 0.15, 0]} material={clay(CLAY.wood)}>
          <boxGeometry args={[2.4, 0.16, 0.9]} />
        </mesh>
        <mesh position={[0.4, 0.32, 1.1]} rotation={[0, 0.3, 0]} material={clay(CLAY.terracotta)}>
          <capsuleGeometry args={[0.28, 0.7, 4, 8]} />
        </mesh>
      </group>
      <ClayTree position={[2.6, 2.4, -1.4]} scale={1.0} variant={1} />
      <ClayHouse position={[1.9, 2.35, 0.1]} rotation={[0, -0.8, 0]} scale={0.75} wall={CLAY.cream} roof={CLAY.seaDeep} />
      <ClaimForm position={[3.1, 5.6, 1.6]} rotation={[0, -0.3, 0]} />
      <ShadowDisc radius={9} y={-3.6} />
    </group>
  );
}

/* 4 — The routes. An archipelago bridged into one network. */
export function SceneRoutes({ animate = true }: { animate?: boolean }) {
  return (
    <group>
      {/* central island */}
      <WaterRing radius={7} />
      <ClayRock size={4.4} color={CLAY.sand} seed={4} />
      <mesh position={[0, 1.9, 0]} material={clay(CLAY.sand)}>
        <cylinderGeometry args={[3.0, 3.4, 0.5, 9]} />
      </mesh>
      <ClayHouse position={[-1.1, 2.2, -0.5]} rotation={[0, 0.4, 0]} scale={0.9} wall={CLAY.cream} roof={CLAY.seaDeep} />
      <ClayHouse position={[1.2, 2.2, 0.6]} rotation={[0, -0.5, 0]} scale={0.7} wall={CLAY.sand} roof={CLAY.terracotta} />
      <ClayTree position={[0.2, 2.25, -1.5]} scale={1.05} />
      {/* satellite islands */}
      <group position={[-8.5, 0.6, -3]}>
        <ClayRock size={2.2} color={CLAY.sandDark} seed={5} detail={0} />
        <ClayTree position={[0, 0.9, 0]} scale={0.9} variant={1} />
      </group>
      <group position={[7.5, 1.2, -4]}>
        <ClayRock size={2.6} color={CLAY.sandDark} seed={6} detail={0} />
        <ClayHouse position={[0, 0.75, 0]} scale={0.6} wall={CLAY.cream} roof={CLAY.terracotta} />
      </group>
      <group position={[5.5, -0.4, 3.5]}>
        <ClayRock size={1.9} color={CLAY.stone} seed={7} detail={0} flat={0.7} />
      </group>
      {/* bridges = routes between them */}
      <ClayBridge start={[-2.6, 1.9, -1.4]} end={[-6.8, 1.4, -2.6]} />
      <ClayBridge start={[2.4, 1.9, -1.6]} end={[5.6, 1.5, -3.2]} />
      <ClayBridge start={[2.2, 1.8, 1.4]} end={[4.6, 0.2, 3.0]} color={CLAY.seaDeep} />
      {/* little ship in transit */}
      <Floaty phase={2.1} amp={0.14} speed={0.9} animate={animate}>
        <group position={[3.4, 0.1, 1.4]} rotation={[0, 0.6, 0]}>
          <mesh material={clay(CLAY.wood)}>
            <boxGeometry args={[1.1, 0.32, 0.5]} />
          </mesh>
          <mesh position={[0.1, 0.5, 0]} material={clay(CLAY.cream)}>
            <coneGeometry args={[0.3, 0.6, 4]} />
          </mesh>
        </group>
      </Floaty>
      <SonarRings position={[0, 2.2, 0]} maxScale={4.5} speed={0.35} animate={animate} />
      <WalletCard position={[-3.6, 5.6, 2.6]} rotation={[0, 0.32, 0]} />
      <ShadowDisc radius={8.5} y={-3.8} />
    </group>
  );
}

/* 5 — The Hub. Under construction: a clay city with a crane. */
export function SceneHub({ animate = true }: { animate?: boolean }) {
  const hook = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!hook.current || !animate) return;
    hook.current.position.x = Math.sin(clock.elapsedTime * 0.4) * 0.9;
  });
  const buildings: { p: [number, number, number]; h: number; w: number; c: string }[] = [
    { p: [-2.0, 0, -1.0], h: 2.6, w: 1.4, c: CLAY.cream },
    { p: [-0.4, 0, 0.8], h: 3.6, w: 1.5, c: CLAY.sand },
    { p: [1.4, 0, -1.2], h: 2.0, w: 1.2, c: CLAY.sea },
    { p: [2.2, 0, 1.2], h: 1.4, w: 1.0, c: CLAY.terracotta },
  ];
  return (
    <group>
      <WaterRing radius={8} />
      <ClayRock size={5.4} color={CLAY.stone} seed={8} />
      <mesh position={[0, 2.2, 0]} material={clay(CLAY.sandDark)}>
        <cylinderGeometry args={[3.7, 4.2, 0.55, 10]} />
      </mesh>
      {buildings.map((b, i) => (
        <group key={i} position={[b.p[0], 2.45, b.p[2]]}>
          <mesh position={[0, b.h / 2, 0]} material={clay(b.c)}>
            <boxGeometry args={[b.w, b.h, b.w]} />
          </mesh>
          {i % 2 === 0 && (
            <mesh position={[0, b.h + 0.18, 0]} material={clay(CLAY.ink)}>
              <boxGeometry args={[b.w * 0.5, 0.36, b.w * 0.5]} />
            </mesh>
          )}
          {/* window slits */}
          {Array.from({ length: Math.floor(b.h / 0.9) }).map((_, f) => (
            <mesh key={f} position={[b.w / 2 + 0.01, 0.6 + f * 0.9, 0]} material={clay(CLAY.ink)}>
              <boxGeometry args={[0.02, 0.3, 0.34]} />
            </mesh>
          ))}
        </group>
      ))}
      {/* crane, mid-build */}
      <group position={[-3.2, 2.45, 1.6]} rotation={[0, 0.7, 0]}>
        <mesh position={[0, 2.4, 0]} material={clay(CLAY.terracotta)}>
          <boxGeometry args={[0.4, 4.8, 0.4]} />
        </mesh>
        <mesh position={[1.4, 4.6, 0]} material={clay(CLAY.terracottaDark)}>
          <boxGeometry args={[3.6, 0.3, 0.3]} />
        </mesh>
        <group ref={hook} position={[2.6, 0, 0]}>
          <mesh position={[0, 3.4, 0]} material={clay(CLAY.ink)}>
            <cylinderGeometry args={[0.02, 0.02, 2.2, 4]} />
          </mesh>
          <mesh position={[0, 2.2, 0]} material={clay(CLAY.seaDeep)}>
            <boxGeometry args={[0.55, 0.5, 0.55]} />
          </mesh>
        </group>
      </group>
      <ClayTree position={[3.4, 2.3, -0.2]} scale={0.9} />
      <ComingSoonBoard position={[3.6, 4.0, 2.2]} rotation={[0, -0.45, 0]} />
      <SonarRings position={[0, 3.2, 0]} maxScale={5} speed={0.3} animate={animate} />
      <ShadowDisc radius={9} y={-3.6} />
    </group>
  );
}

/* 6 — The coin. The monument at the end of the journey: your name, minted. */
export function SceneCoin({ animate = true }: { animate?: boolean }) {
  const coin = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!coin.current || !animate) return;
    coin.current.rotation.y = Math.sin(clock.elapsedTime * 0.3) * 0.4;
  });
  return (
    <group>
      <WaterRing radius={8.5} />
      <ClayRock size={5.6} color={CLAY.sandDark} seed={9} />
      {/* stepping stones leading in */}
      {[
        [-3.4, -2.6, 3.4],
        [-2.2, -2.4, 4.6],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} material={clay(CLAY.stone)}>
          <cylinderGeometry args={[0.7, 0.5, 0.4, 7]} />
        </mesh>
      ))}
      <mesh position={[0, 2.35, 0]} material={clay(CLAY.sand)}>
        <cylinderGeometry args={[3.9, 4.4, 0.6, 10]} />
      </mesh>
      {/* plinth */}
      <mesh position={[0, 3.1, 0]} material={clay(CLAY.stone)}>
        <cylinderGeometry args={[1.7, 2.0, 0.9, 9]} />
      </mesh>
      {/* the coin, standing upright */}
      <group ref={coin} position={[0, 5.3, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} material={clay(CLAY.coin)}>
          <cylinderGeometry args={[2.0, 2.0, 0.45, 20]} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]}>
          <torusGeometry args={[2.0, 0.1, 8, 28]} />
          <meshStandardMaterial color={CLAY.coinDark} flatShading roughness={0.9} />
        </mesh>
        {/* sonar "S" mark: three bars */}
        <mesh position={[0, 0.35, 0.24]} material={clay(CLAY.coinDark)}>
          <boxGeometry args={[0.9, 0.22, 0.06]} />
        </mesh>
        <mesh position={[0, 0, 0.24]} material={clay(CLAY.coinDark)}>
          <boxGeometry args={[0.9, 0.22, 0.06]} />
        </mesh>
        <mesh position={[0, -0.35, 0.24]} material={clay(CLAY.coinDark)}>
          <boxGeometry args={[0.9, 0.22, 0.06]} />
        </mesh>
      </group>
      <SonarRings position={[0, 4.4, 0]} maxScale={6.5} speed={0.4} animate={animate} />
      <ClayTree position={[-2.6, 2.6, -1.6]} scale={1.1} />
      <ClayTree position={[2.4, 2.55, 1.4]} scale={0.85} variant={1} />
      <ClayHouse position={[2.6, 2.55, -1.2]} rotation={[0, -0.6, 0]} scale={0.8} wall={CLAY.cream} roof={CLAY.terracotta} />
      <ClaimBillboard position={[-4.4, 5.2, 2.0]} />
      <ShadowDisc radius={9.5} y={-3.8} />
    </group>
  );
}

export const SCENE_SPACING = 56;

export function Scenes({ animate = true }: { animate?: boolean }) {
  const scenes = [SceneSurface, SceneTangle, SceneLighthouse, SceneRoutes, SceneHub, SceneCoin];
  return (
    <group>
      {scenes.map((Scene, i) => (
        <group key={i} position={[i * SCENE_SPACING, 0, 0]}>
          <Scene animate={animate} />
        </group>
      ))}
    </group>
  );
}
