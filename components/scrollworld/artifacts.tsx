"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import { CLAY } from "./clay";

/*
  Signature UI artifacts — one per scene, floating in the world.
  Stylized miniatures of the landing page's own interface: slabs, rows,
  mono labels, one signal accent. Readable at the camera's dwell distance.
*/

const PANEL = "#0d141b";
const PANEL_EDGE = "#1d2933";
const INK = "#edf2f4";
const INK_DIM = "#93a1ad";
const SIGNAL = "#74c7b8";

function Slab({
  size,
  position,
  rotation,
  color = PANEL,
  radius = 0.09,
}: {
  size: [number, number, number];
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  radius?: number;
}) {
  return (
    <RoundedBox
      args={size}
      radius={radius}
      smoothness={4}
      position={position}
      rotation={rotation}
    >
      <meshStandardMaterial color={color} roughness={0.55} metalness={0.08} />
    </RoundedBox>
  );
}

/** 1 — Surface: the floating SONAR ID card */
export function IdCard({
  position,
  rotation = [0, 0, 0],
  animate = true,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  animate?: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current || !animate) return;
    ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.35) * 0.14 - 0.12;
  });
  return (
    <group ref={ref} position={position} rotation={rotation}>
      <Slab size={[2.7, 1.75, 0.14]} position={[0, 0, 0]} />
      <Slab size={[2.56, 1.61, 0.03]} position={[0, 0, 0.075]} color={PANEL_EDGE} />
      <Text
        position={[-1.1, 0.52, 0.11]}
        fontSize={0.17}
        color={SIGNAL}
        anchorX="left"
        anchorY="middle"
        letterSpacing={0.14}
      >
        SONAR ID
      </Text>
      <Text
        position={[-1.1, 0.02, 0.11]}
        fontSize={0.34}
        color={INK}
        anchorX="left"
        anchorY="middle"
      >
        @yourname
      </Text>
      {/* chain dots */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-0.92 + i * 0.42, -0.52, 0.11]}>
          <sphereGeometry args={[0.075, 10, 10]} />
          <meshStandardMaterial color={i === 0 ? SIGNAL : INK_DIM} roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[0.55, -0.52, 0.11]}>
        <planeGeometry args={[1.15, 0.05]} />
        <meshStandardMaterial color={PANEL} roughness={0.9} />
      </mesh>
    </group>
  );
}

/** 2 — Tangle: an address receipt spilling 42-char strings */
export function AddressReceipt({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      <Slab size={[3.1, 1.0, 0.1]} position={[0, 0, 0]} color="#e9e4d8" radius={0.05} />
      <Text
        position={[-1.38, 0.22, 0.07]}
        fontSize={0.185}
        color={CLAY.ink}
        anchorX="left"
        anchorY="middle"
        letterSpacing={0.05}
      >
        0x7f9a4c…e21e
      </Text>
      <Text
        position={[-1.38, -0.1, 0.07]}
        fontSize={0.185}
        color="#5a6873"
        anchorX="left"
        anchorY="middle"
        letterSpacing={0.05}
      >
        bc1qx4t9…8wud
      </Text>
      <Text
        position={[-1.38, -0.36, 0.07]}
        fontSize={0.13}
        color="#9aa6ae"
        anchorX="left"
        anchorY="middle"
        letterSpacing={0.08}
      >
        …and ten more
      </Text>
      {/* torn trailing strips */}
      <Slab size={[2.2, 0.16, 0.06]} position={[0.2, -0.72, 0]} color="#ddd6c6" radius={0.03} />
      <Slab size={[1.3, 0.14, 0.06]} position={[0.75, -0.94, 0]} color="#cfc8b6" radius={0.03} />
    </group>
  );
}

/** 3 — Lighthouse: the claim form, cursor blinking */
export function ClaimForm({
  position,
  rotation = [0, 0, 0],
  animate = true,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  animate?: boolean;
}) {
  const cursor = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!cursor.current) return;
    const m = (cursor.current as THREE.Mesh).material as THREE.MeshBasicMaterial;
    m.opacity = animate ? (Math.sin(clock.elapsedTime * 3.4) > 0 ? 0.9 : 0.06) : 0.9;
  });
  return (
    <group position={position} rotation={rotation}>
      <Slab size={[2.5, 1.6, 0.14]} position={[0, 0, 0]} />
      <Text
        position={[-1.05, 0.5, 0.11]}
        fontSize={0.2}
        color={INK}
        anchorX="left"
        anchorY="middle"
      >
        Claim your ID
      </Text>
      {/* input field */}
      <Slab size={[2.1, 0.52, 0.06]} position={[0, 0.02, 0.09]} color="#080d12" radius={0.06} />
      <Text
        position={[-0.95, 0.02, 0.13]}
        fontSize={0.22}
        color={SIGNAL}
        anchorX="left"
        anchorY="middle"
      >
        @yourname
      </Text>
      <mesh ref={cursor} position={[0.28, 0.02, 0.13]}>
        <planeGeometry args={[0.05, 0.22]} />
        <meshBasicMaterial color={SIGNAL} transparent opacity={0.9} />
      </mesh>
      {/* button */}
      <Slab size={[1.05, 0.44, 0.07]} position={[-0.5, -0.55, 0.1]} color={SIGNAL} radius={0.07} />
      <Text
        position={[-0.5, -0.55, 0.15]}
        fontSize={0.18}
        color="#070b10"
        anchorX="center"
        anchorY="middle"
      >
        Claim
      </Text>
    </group>
  );
}

/** 4 — Routes: the wallet card with cross-chain rows */
export function WalletCard({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const rows: [string, string][] = [
    ["ETH", "1.284"],
    ["SOL", "214.6"],
    ["BTC", "0.0412"],
  ];
  return (
    <group position={position} rotation={rotation}>
      <Slab size={[2.6, 2.0, 0.14]} position={[0, 0, 0]} />
      <Text
        position={[-1.1, 0.68, 0.11]}
        fontSize={0.21}
        color={INK}
        anchorX="left"
        anchorY="middle"
      >
        sonar.eth
      </Text>
      <mesh position={[0, 0.42, 0.11]}>
        <planeGeometry args={[2.2, 0.02]} />
        <meshStandardMaterial color={PANEL_EDGE} roughness={0.9} />
      </mesh>
      {rows.map(([sym, bal], i) => {
        const y = 0.12 - i * 0.42;
        return (
          <group key={sym}>
            <mesh position={[-0.94, y, 0.11]}>
              <sphereGeometry args={[0.07, 10, 10]} />
              <meshStandardMaterial color={i === 0 ? SIGNAL : INK_DIM} roughness={0.6} />
            </mesh>
            <Text
              position={[-0.72, y, 0.11]}
              fontSize={0.19}
              color={INK}
              anchorX="left"
              anchorY="middle"
            >
              {sym}
            </Text>
            <Text
              position={[1.1, y, 0.11]}
              fontSize={0.19}
              color={INK_DIM}
              anchorX="right"
              anchorY="middle"
            >
              {bal}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

/** 5 — Hub: the construction board with a filling progress bar */
export function ComingSoonBoard({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const PROGRESS = 0.62;
  return (
    <group position={position} rotation={rotation}>
      {/* legs */}
      {[-0.9, 0.9].map((x) => (
        <mesh key={x} position={[x, -0.95, -0.05]} rotation={[0.12, 0, 0]}>
          <boxGeometry args={[0.12, 1.1, 0.12]} />
          <meshStandardMaterial color={CLAY.wood} roughness={0.95} flatShading />
        </mesh>
      ))}
      <Slab size={[2.9, 1.7, 0.12]} position={[0, 0, 0]} color="#e9e4d8" radius={0.06} />
      {/* hazard stripe top */}
      <mesh position={[0, 0.66, 0.08]}>
        <planeGeometry args={[2.7, 0.16]} />
        <meshStandardMaterial color={CLAY.terracotta} roughness={0.9} />
      </mesh>
      <Text
        position={[0, 0.28, 0.08]}
        fontSize={0.3}
        color={CLAY.ink}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
      >
        THE HUB
      </Text>
      <Text
        position={[0, -0.06, 0.08]}
        fontSize={0.17}
        color="#5a6873"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
      >
        COMING SOON
      </Text>
      {/* progress track + fill */}
      <mesh position={[0, -0.44, 0.08]}>
        <planeGeometry args={[2.3, 0.16]} />
        <meshStandardMaterial color="#c9c2b2" roughness={0.9} />
      </mesh>
      <mesh position={[-1.15 + (2.3 * PROGRESS) / 2, -0.44, 0.09]}>
        <planeGeometry args={[2.3 * PROGRESS, 0.16]} />
        <meshStandardMaterial color={SIGNAL} roughness={0.7} />
      </mesh>
    </group>
  );
}

/** 6 — Coin: the finale billboard beside the monument */
export function ClaimBillboard({
  position,
  rotation = [0, 0, 0],
  animate = true,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  animate?: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current || !animate) return;
    ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.3) * 0.1 + 0.35;
  });
  return (
    <group ref={ref} position={position} rotation={rotation}>
      <Slab size={[3.3, 1.9, 0.14]} position={[0, 0, 0]} />
      <Slab size={[3.16, 1.76, 0.03]} position={[0, 0, 0.075]} color={PANEL_EDGE} />
      <Text
        position={[0, 0.5, 0.11]}
        fontSize={0.2}
        color={INK_DIM}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
      >
        ONE NAME. EVERY CHAIN.
      </Text>
      <Text
        position={[0, -0.05, 0.11]}
        fontSize={0.44}
        color={SIGNAL}
        anchorX="center"
        anchorY="middle"
      >
        @yourname
      </Text>
      {/* button strip */}
      <Slab size={[1.5, 0.46, 0.07]} position={[0, -0.68, 0.1]} color={SIGNAL} radius={0.07} />
      <Text
        position={[0, -0.68, 0.15]}
        fontSize={0.18}
        color="#070b10"
        anchorX="center"
        anchorY="middle"
      >
        Claim it
      </Text>
    </group>
  );
}
