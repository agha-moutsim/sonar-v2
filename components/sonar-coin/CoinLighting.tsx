import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { LightingSetup } from "./data/materials";

interface CoinLightingProps {
  lighting: LightingSetup;
  mousePosRef: React.RefObject<{ x: number; y: number }>;
}

export const CoinLighting: React.FC<CoinLightingProps> = ({ lighting, mousePosRef }) => {
  const pointerLightRef = useRef<THREE.PointLight>(null);
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRef = useRef<THREE.DirectionalLight>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const mousePos = mousePosRef.current ?? { x: 0, y: 0 };

    // 1. Subtle moving pointer glint light
    if (pointerLightRef.current) {
      pointerLightRef.current.position.x = mousePos.x * 4.5;
      pointerLightRef.current.position.y = mousePos.y * 4.5;
      pointerLightRef.current.position.z = 4.2;
    }

    // 2. Slow breathing movement for key and rim highlights
    if (keyLightRef.current) {
      keyLightRef.current.position.x = 4.0 + Math.sin(time * 0.3) * 0.8;
      keyLightRef.current.position.y = 5.0 + Math.cos(time * 0.25) * 0.5;
    }

    if (rimLightRef.current) {
      rimLightRef.current.position.x = -4.5 + Math.cos(time * 0.2) * 0.6;
      rimLightRef.current.position.y = 3.5 + Math.sin(time * 0.3) * 0.6;
    }
  });

  return (
    <>
      {/* Deep Ambient Base */}
      <ambientLight color={lighting.ambientColor} intensity={lighting.ambientIntensity} />

      {/* 1. Main Key Softbox Light (Cool White Studio Light) */}
      <directionalLight
        ref={keyLightRef}
        position={[4, 5, 5]}
        color={lighting.keyLightColor}
        intensity={lighting.keyLightIntensity}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0001}
      />

      {/* 2. Rim Light (Back-Left Neon Violet / Purple) */}
      <directionalLight
        ref={rimLightRef}
        position={[-5, 3, -4]}
        color={lighting.rimLightColor}
        intensity={lighting.rimLightIntensity}
      />

      {/* 3. Fill Light (Bottom-Right Magenta) */}
      <directionalLight
        position={[3, -4, 2]}
        color={lighting.fillLightColor}
        intensity={lighting.fillLightIntensity}
      />

      {/* 4. Kicker Top-Back Grazing Light for Bevel Reflections */}
      <directionalLight
        position={[0, 6, -3]}
        color={lighting.kickerColor}
        intensity={lighting.kickerIntensity}
      />

      {/* 5. Dynamic Interactive Pointer Glint Light */}
      <pointLight
        ref={pointerLightRef}
        position={[0, 0, 4]}
        color="#c084fc"
        intensity={1.6}
        distance={10}
        decay={2}
      />

      {/* 6. Soft Back Glow Point */}
      <pointLight
        position={[0, 0, -3.5]}
        color="#7c3aed"
        intensity={2.0}
        distance={8}
        decay={2}
      />
    </>
  );
};
