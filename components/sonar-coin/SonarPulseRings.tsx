import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SonarPulseRingsProps {
  pulseProgressRef: React.RefObject<number>;
  pulseColorRef: React.RefObject<string>;
  isFront?: boolean;
}

export const SonarPulseRings: React.FC<SonarPulseRingsProps> = ({
  pulseProgressRef,
  pulseColorRef,
  isFront = true,
}) => {
  const meshRef = useRef<THREE.Group>(null);

  // 3 concentric wave ripples with staggered delays
  const rings = [
    { delay: 0, scaleMult: 1.0, width: 0.05 },
    { delay: 0.12, scaleMult: 0.88, width: 0.035 },
    { delay: 0.25, scaleMult: 0.74, width: 0.025 },
  ];

  useFrame(() => {
    if (!meshRef.current) return;
    const progress = pulseProgressRef.current ?? 0;
    // Hide if no pulse
    meshRef.current.visible = progress > 0 && progress < 1;
  });

  const zPos = isFront ? 0.184 : -0.184;

  return (
    <group ref={meshRef} position={[0, 0, zPos]} rotation={[0, isFront ? 0 : Math.PI, 0]}>
      {rings.map((ring, idx) => {
        const progress = pulseProgressRef.current ?? 0;
        const pColor = pulseColorRef.current ?? "#c084fc";
        const localProgress = Math.max(0, Math.min(1, (progress - ring.delay) / (1 - ring.delay)));
        // Radius expands from 0.2 to 2.45
        const currentRadius = 0.2 + localProgress * 2.25 * ring.scaleMult;
        // Alpha peaks at 0.25 and fades out towards 1.0
        const opacity = localProgress <= 0 || localProgress >= 1
          ? 0
          : Math.sin(localProgress * Math.PI) * 0.9;

        if (opacity <= 0.001) return null;

        return (
          <mesh key={idx} rotation={[0, 0, 0]}>
            <ringGeometry args={[Math.max(0.01, currentRadius - ring.width), currentRadius + ring.width, 96]} />
            <meshBasicMaterial
              color={pColor}
              transparent
              opacity={opacity}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
};
