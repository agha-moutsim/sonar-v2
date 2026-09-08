"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/*
  Clay kit — the shared "style preamble" of the world.
  Every scene is built ONLY from these materials and primitives so the
  whole film reads as one cohesive clay diorama world.
  Palette: warm sand/terracotta/sage family + one sea-glass accent + deep ink.
*/

export const CLAY = {
  sand: "#d8c9a8",
  sandDark: "#b9a883",
  sea: "#86c5b9",
  seaDeep: "#5aa396",
  terracotta: "#c98a6b",
  terracottaDark: "#a96f55",
  cream: "#f2ede4",
  ink: "#26323c",
  wood: "#b98f6b",
  leaf: "#9dbf8e",
  leafDark: "#7da06f",
  stone: "#9aa6ae",
  coin: "#d9b36a",
  coinDark: "#b8934e",
};

const matCache = new Map<string, THREE.MeshStandardMaterial>();

export function clay(color: string): THREE.MeshStandardMaterial {
  let m = matCache.get(color);
  if (!m) {
    m = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      flatShading: true,
      roughness: 0.95,
      metalness: 0.02,
    });
    matCache.set(color, m);
  }
  return m;
}

/** Soft radial contact shadow — cheap fake AO disc under every island */
export function useShadowTexture(): THREE.Texture {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 4, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(4,10,14,0.55)");
    g.addColorStop(0.6, "rgba(4,10,14,0.25)");
    g.addColorStop(1, "rgba(4,10,14,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

export function ShadowDisc({ radius = 6, y = -3.2 }: { radius?: number; y?: number }) {
  const tex = useShadowTexture();
  return (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[radius * 2, radius * 2]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  );
}

/** Organic clay rock — jittered, flattened dodecahedron */
export function ClayRock({
  size = 5,
  color = CLAY.sandDark,
  flat = 0.45,
  seed = 1,
  detail = 1,
}: {
  size?: number;
  color?: string;
  flat?: number;
  seed?: number;
  detail?: number;
}) {
  const geo = useMemo(() => {
    const base = new THREE.DodecahedronGeometry(size, detail);
    const pos = base.attributes.position;
    const v = new THREE.Vector3();
    // deterministic pseudo-noise from seed
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const n =
        Math.sin(v.x * 1.7 + seed * 12.9) * 0.5 +
        Math.sin(v.y * 2.3 + seed * 7.1) * 0.3 +
        Math.sin(v.z * 1.9 + seed * 3.7) * 0.2;
      v.multiplyScalar(1 + n * 0.09);
      pos.setXYZ(i, v.x, v.y * flat, v.z);
    }
    base.computeVertexNormals();
    return base;
  }, [size, flat, seed, detail]);
  return (
    <mesh geometry={geo} material={clay(color)} />
  );
}

/** Water ring around an island — thin flat torus, gently breathing */
export function WaterRing({
  radius = 7.5,
  y = -2.9,
  color = CLAY.sea,
  opacity = 0.35,
  breathe = true,
}: {
  radius?: number;
  y?: number;
  color?: string;
  opacity?: number;
  breathe?: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current || !breathe) return;
    const t = clock.elapsedTime;
    const s = 1 + Math.sin(t * 0.6) * 0.015;
    ref.current.scale.setScalar(s);
  });
  return (
    <mesh ref={ref} position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.16, 8, 48]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

/** Brand motif: expanding sonar ping rings */
export function SonarRings({
  position = [0, 0, 0],
  color = CLAY.sea,
  count = 3,
  maxScale = 4,
  speed = 0.5,
  animate = true,
}: {
  position?: [number, number, number];
  color?: string;
  count?: number;
  maxScale?: number;
  speed?: number;
  animate?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current || !animate) return;
    const t = clock.elapsedTime * speed;
    group.current.children.forEach((child, i) => {
      const phase = (t + i / count) % 1;
      const s = 0.4 + phase * maxScale;
      child.scale.setScalar(s);
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = 0.5 * (1 - phase);
    });
  });
  return (
    <group ref={group} position={position}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1, 0.045, 8, 40]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

export function ClayTree({
  position,
  scale = 1,
  variant = 0,
}: {
  position: [number, number, number];
  scale?: number;
  variant?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.35, 0]} material={clay(CLAY.wood)}>
        <cylinderGeometry args={[0.12, 0.18, 0.7, 6]} />
      </mesh>
      {variant === 0 ? (
        <mesh position={[0, 1.25, 0]} material={clay(CLAY.leaf)}>
          <coneGeometry args={[0.72, 1.5, 7]} />
        </mesh>
      ) : (
        <mesh position={[0, 1.15, 0]} material={clay(CLAY.leafDark)}>
          <icosahedronGeometry args={[0.72, 0]} />
        </mesh>
      )}
    </group>
  );
}

export function ClayHouse({
  position,
  rotation = [0, 0, 0],
  scale = 1,
  wall = CLAY.cream,
  roof = CLAY.terracotta,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  wall?: string;
  roof?: string;
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.55, 0]} material={clay(wall)}>
        <boxGeometry args={[1.3, 1.1, 1.15]} />
      </mesh>
      <mesh position={[0, 1.42, 0]} rotation={[0, Math.PI / 4, 0]} material={clay(roof)}>
        <coneGeometry args={[1.05, 0.75, 4]} />
      </mesh>
      <mesh position={[0.36, 0.45, 0.6]} material={clay(CLAY.ink)}>
        <boxGeometry args={[0.24, 0.42, 0.05]} />
      </mesh>
    </group>
  );
}

/** Half-torus arch used for bridges between islands */
export function ClayBridge({
  start,
  end,
  color = CLAY.wood,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
}) {
  const { geo, mid, rot } = useMemo(() => {
    const s = new THREE.Vector3(...start);
    const e = new THREE.Vector3(...end);
    const midPoint = s.clone().add(e).multiplyScalar(0.5);
    midPoint.y += Math.max(1.2, s.distanceTo(e) * 0.22);
    const curve = new THREE.CatmullRomCurve3([s, midPoint, e]);
    return {
      geo: new THREE.TubeGeometry(curve, 24, 0.14, 6, false),
      mid: midPoint,
      rot: [0, 0, 0] as [number, number, number],
    };
  }, [start, end]);
  return (
    <group>
      <mesh geometry={geo} material={clay(color)} />
      <group position={mid} rotation={rot} />
    </group>
  );
}

/** Gentle idle bob for a whole island */
export function Floaty({
  children,
  phase = 0,
  amp = 0.35,
  speed = 0.5,
  animate = true,
}: {
  children: React.ReactNode;
  phase?: number;
  amp?: number;
  speed?: number;
  animate?: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current || !animate) return;
    ref.current.position.y = Math.sin(clock.elapsedTime * speed + phase) * amp;
  });
  return <group ref={ref}>{children}</group>;
}
