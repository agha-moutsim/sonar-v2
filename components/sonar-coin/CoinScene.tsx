"use client";

import React, { useRef, useCallback, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SonarCoin } from "./SonarCoin";
import { CoinLighting } from "./CoinLighting";
import { CoinEnvironment } from "./CoinEnvironment";
import { MaterialProperties, LightingMood, CameraPreset } from "./types";
import { LIGHTING_PRESETS } from "./data/materials";

interface CoinSceneProps {
  materialProps: MaterialProperties;
  lightingMood: LightingMood;
  cameraPreset: CameraPreset;
  autoSpin: boolean;
  coinScale?: number;
  triggerPulseExternal?: number;
  triggerFlipExternal?: number;
}

export const CoinScene: React.FC<CoinSceneProps> = ({
  materialProps,
  lightingMood,
  cameraPreset,
  autoSpin,
  coinScale = 0.95,
  triggerPulseExternal,
  triggerFlipExternal,
}) => {
  const { camera, size } = useThree();
  const coinAnchorRef = useRef<THREE.Group>(null);
  const coinMeshRef = useRef<THREE.Group>(null);

  // Interaction State
  const isDraggingRef = useRef(false);
  const previousPointerRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0, y: 0, z: 0 });
  const targetTiltRef = useRef({ x: 0, y: 0 });

  // Use refs instead of state for frame-by-frame values (prevents React re-renders)
  const pulseProgressRef = useRef(0);
  const pulseActiveRef = useRef(false);
  const pulseStartTimeRef = useRef(0);
  const pulseColorRef = useRef(materialProps.accentColor);
  const proximityIntensityRef = useRef(0);
  const mousePosRef = useRef({ x: 0, y: 0 });

  // Coin Flip State
  const isFlippingRef = useRef(false);
  const flipStartTimeRef = useRef(0);
  const flipDuration = 1.6;

  // Trigger Sonar Pulse
  const emitPulse = useCallback((intensity = 1.0) => {
    pulseActiveRef.current = true;
    pulseStartTimeRef.current = performance.now();
    pulseColorRef.current = materialProps.accentColor;
  }, [materialProps.accentColor]);

  // Flip Coin Animation Trigger
  const flipCoin = useCallback(() => {
    if (isFlippingRef.current) return;
    isFlippingRef.current = true;
    flipStartTimeRef.current = performance.now();
    emitPulse(0.7);
  }, [emitPulse]);

  // Respond to external pulse trigger prop changes
  useEffect(() => {
    if (triggerPulseExternal && triggerPulseExternal > 0) {
      emitPulse(1.0);
    }
  }, [triggerPulseExternal, emitPulse]);

  // Respond to external flip trigger prop changes
  useEffect(() => {
    if (triggerFlipExternal && triggerFlipExternal > 0) {
      flipCoin();
    }
  }, [triggerFlipExternal, flipCoin]);

  // Handle Preset Camera Changes
  useEffect(() => {
    switch (cameraPreset) {
      case "front":
        rotationRef.current = { x: 0, y: 0, z: 0 };
        velocityRef.current = { x: 0, y: 0 };
        break;
      case "back":
        rotationRef.current = { x: 0, y: Math.PI, z: 0 };
        velocityRef.current = { x: 0, y: 0 };
        break;
      case "edge":
        rotationRef.current = { x: 0, y: Math.PI / 2, z: 0 };
        velocityRef.current = { x: 0, y: 0 };
        break;
      case "macro":
        rotationRef.current = { x: 0.35, y: 0.65, z: 0.1 };
        velocityRef.current = { x: 0, y: 0 };
        break;
      case "hero":
      default:
        rotationRef.current = { x: 0, y: 0, z: 0 };
        velocityRef.current = { x: 0, y: 0 };
        break;
    }
  }, [cameraPreset]);

  // Pointer / Touch Handlers on Window
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest(".no-drag") || target.closest("input")) {
        return;
      }
      isDraggingRef.current = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      previousPointerRef.current = { x: clientX, y: clientY };
      velocityRef.current = { x: 0, y: 0 };
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const nx = (clientX / window.innerWidth) * 2 - 1;
      const ny = -(clientY / window.innerHeight) * 2 + 1;
      mousePosRef.current = { x: nx, y: ny };

      const distFromCenter = Math.sqrt(nx * nx + ny * ny);
      const prox = Math.max(0, 1 - distFromCenter * 1.3);
      proximityIntensityRef.current = prox;

      if (!isDraggingRef.current) {
        targetTiltRef.current = {
          x: ny * 0.22,
          y: nx * 0.35,
        };
      }

      if (isDraggingRef.current) {
        const deltaX = clientX - previousPointerRef.current.x;
        const deltaY = clientY - previousPointerRef.current.y;
        const sensitivity = 0.0065;
        const vx = deltaY * sensitivity;
        const vy = deltaX * sensitivity;
        rotationRef.current.y += vy;
        rotationRef.current.x += vx;
        rotationRef.current.x = Math.max(-Math.PI * 0.45, Math.min(Math.PI * 0.45, rotationRef.current.x));
        velocityRef.current = { x: vx, y: vy };
        previousPointerRef.current = { x: clientX, y: clientY };
      }
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchstart", handlePointerDown, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("touchend", handlePointerUp);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, []);

  // Main Render & Physics Loop
  useFrame((state, delta) => {
    const now = performance.now();
    const time = state.clock.getElapsedTime();

    // 1. Sonar Pulse Progression (using ref, no setState)
    if (pulseActiveRef.current) {
      const elapsedSec = (now - pulseStartTimeRef.current) / 1000;
      const pulseDuration = 1.8;
      const progress = elapsedSec / pulseDuration;
      if (progress >= 1) {
        pulseActiveRef.current = false;
        pulseProgressRef.current = 0;
      } else {
        pulseProgressRef.current = progress;
      }
    }

    // 2. Coin Flip Animation
    let flipYOffset = 0;
    let flipExtraRotationX = 0;
    if (isFlippingRef.current) {
      const elapsedFlip = (now - flipStartTimeRef.current) / 1000;
      const t = elapsedFlip / flipDuration;
      if (t >= 1) {
        isFlippingRef.current = false;
      } else {
        const peakHeight = 2.4;
        flipYOffset = 4 * peakHeight * t * (1 - t);
        flipExtraRotationX = Math.PI * 4 * Math.sin(t * (Math.PI / 2));
      }
    }

    // 3. Rotational Inertia & Deceleration
    if (!isDraggingRef.current && !isFlippingRef.current) {
      rotationRef.current.y += velocityRef.current.y;
      rotationRef.current.x += velocityRef.current.x;
      velocityRef.current.x *= 0.94;
      velocityRef.current.y *= 0.94;

      if (autoSpin && Math.abs(velocityRef.current.y) < 0.001) {
        rotationRef.current.y = Math.sin(time * 0.6) * 0.15;
      }

      if (Math.abs(velocityRef.current.x) < 0.0005 && Math.abs(velocityRef.current.y) < 0.0005) {
        rotationRef.current.x = THREE.MathUtils.lerp(
          rotationRef.current.x,
          targetTiltRef.current.x,
          0.04
        );
      }
    }

    // 4. Subtle Floating Bob
    const hoverBobY = Math.sin(time * 1.5) * 0.08 + flipYOffset;
    const hoverBobZ = Math.cos(time * 1.2) * 0.04;

    if (coinAnchorRef.current) {
      coinAnchorRef.current.position.y = hoverBobY;
      coinAnchorRef.current.position.z = hoverBobZ;
      coinAnchorRef.current.rotation.x = rotationRef.current.x + flipExtraRotationX;
      coinAnchorRef.current.rotation.y = rotationRef.current.y;
      coinAnchorRef.current.rotation.z = rotationRef.current.z + Math.sin(time * 1.0) * 0.02;
    }

    // 5. Camera stays fully fixed — no movement, coin size never changes
    camera.lookAt(0, 0, 0);
  });

  const lighting = LIGHTING_PRESETS[lightingMood];

  return (
    <>
      <CoinLighting lighting={lighting} mousePosRef={mousePosRef} />
      <CoinEnvironment accentColor={materialProps.accentColor} />

      <group ref={coinAnchorRef} position={[0, 0, 0]}>
        <group ref={coinMeshRef} scale={[coinScale, coinScale, coinScale]}>
          <SonarCoin
            materialProps={materialProps}
            pulseProgressRef={pulseProgressRef}
            pulseColorRef={pulseColorRef}
            proximityIntensityRef={proximityIntensityRef}
            onClick={() => emitPulse(1.0)}
            onPointerOver={() => { proximityIntensityRef.current = 0.8; }}
            onPointerOut={() => { proximityIntensityRef.current = 0; }}
          />
        </group>
      </group>
    </>
  );
};
