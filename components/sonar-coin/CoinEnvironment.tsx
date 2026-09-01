import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Environment } from '@react-three/drei';

export const CoinEnvironment: React.FC<{ accentColor?: string }> = ({
  accentColor = '#a855f7',
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const hazeRef = useRef<THREE.Mesh>(null);

  // Floating Sonar Echo micro-particles
  const particleCount = 80;
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(accentColor);
    const c2 = new THREE.Color('#38bdf8');
    const c3 = new THREE.Color('#ffffff');

    for (let i = 0; i < particleCount; i++) {
      // Cylindrical / spherical spread around the coin
      const r = 3.5 + Math.random() * 6.5;
      const theta = Math.random() * Math.PI * 2;
      const z = (Math.random() - 0.5) * 8.0;

      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = Math.sin(theta) * r;
      pos[i * 3 + 2] = z;

      // Color variation
      const rand = Math.random();
      const chosen = rand > 0.6 ? c1 : rand > 0.2 ? c2 : c3;
      col[i * 3] = chosen.r;
      col[i * 3 + 1] = chosen.g;
      col[i * 3 + 2] = chosen.b;
    }

    return [pos, col];
  }, [accentColor]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.02;
      pointsRef.current.rotation.z = time * 0.01;
    }

    if (hazeRef.current) {
      hazeRef.current.position.z = -5.0 + Math.sin(time * 0.5) * 0.2;
    }
  });

  return (
    <>
      {/* High Dynamic Range Studio Environment for PBR reflections */}
      <Environment preset="city" environmentIntensity={0.65} />

      {/* Floating Sonar Detection Micro-Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          vertexColors
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  );
};
