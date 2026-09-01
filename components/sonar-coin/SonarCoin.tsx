import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getCoinTextures, CoinTextures } from "./utils/textureGenerator";
import { MaterialProperties } from "./types";
import { SonarPulseRings } from "./SonarPulseRings";

interface SonarCoinProps {
  materialProps: MaterialProperties;
  pulseProgressRef: React.RefObject<number>;
  pulseColorRef: React.RefObject<string>;
  proximityIntensityRef: React.RefObject<number>;
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

export const SonarCoin: React.FC<SonarCoinProps> = ({
  materialProps,
  pulseProgressRef,
  pulseColorRef,
  proximityIntensityRef,
  onClick,
  onPointerOver,
  onPointerOut,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const frontMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const backMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const rimMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const edgeMatRef = useRef<THREE.MeshPhysicalMaterial>(null);

  // Generate or get cached procedural textures
  const textures: CoinTextures = useMemo(() => getCoinTextures(), []);

  // Base coin dimensions (in Three.js world units)
  const coinRadius = 2.4;
  const coinThickness = 0.36;
  const halfThickness = coinThickness / 2;

  // Number of physical teeth on the outer reeded rim
  const numTeeth = 96;
  const teethGeometry = useMemo(() => {
    const baseBox = new THREE.BoxGeometry(0.04, coinThickness * 0.9, 0.08);
    return baseBox;
  }, [coinThickness]);

  // Pre-calculate transforms for the 3D reeded teeth
  const teethTransforms = useMemo(() => {
    const matrixArray: THREE.Matrix4[] = [];
    const dummy = new THREE.Object3D();

    for (let i = 0; i < numTeeth; i++) {
      const angle = (i / numTeeth) * Math.PI * 2;
      const x = Math.cos(angle) * (coinRadius - 0.02);
      const y = Math.sin(angle) * (coinRadius - 0.02);

      dummy.position.set(x, y, 0);
      dummy.rotation.set(0, 0, angle + Math.PI / 2);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      matrixArray.push(dummy.matrix.clone());
    }
    return matrixArray;
  }, [numTeeth, coinRadius]);

  // Apply teeth matrices to instanced mesh once mounted
  const instancedTeethRef = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    if (!instancedTeethRef.current) return;
    teethTransforms.forEach((mat, i) => {
      instancedTeethRef.current!.setMatrixAt(i, mat);
    });
    instancedTeethRef.current.instanceMatrix.needsUpdate = true;
  }, [teethTransforms]);

  // Frame loop: update emissive pulse & proximity breathing (no setState)
  useFrame(() => {
    const progress = pulseProgressRef.current ?? 0;
    const prox = proximityIntensityRef.current ?? 0;
    const pColor = pulseColorRef.current ?? "#c084fc";

    // 1. Dynamic Pulse Calculation (Outward propagating ripple)
    let emissiveStrength = 0;
    if (progress > 0 && progress < 1) {
      emissiveStrength = Math.sin(progress * Math.PI) * 4.2;
    }

    // Apply to Front Face Material
    if (frontMatRef.current) {
      frontMatRef.current.emissive.set(pColor);
      frontMatRef.current.emissiveIntensity = 0.15 + emissiveStrength + prox * 0.4;
    }

    // Apply to Back Face Material
    if (backMatRef.current) {
      backMatRef.current.emissive.set(pColor);
      backMatRef.current.emissiveIntensity = 0.1 + emissiveStrength * 0.8 + prox * 0.2;
    }
  });

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onPointerOver?.();
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onPointerOut?.();
      }}
    >
      {/* 1. FRONT FACE DISC (+Z) */}
      <mesh position={[0, 0, halfThickness]} rotation={[0, 0, 0]} receiveShadow castShadow>
        <circleGeometry args={[coinRadius - 0.05, 96]} />
        <meshPhysicalMaterial
          ref={frontMatRef}
          color={materialProps.color}
          metalness={materialProps.metalness}
          roughness={materialProps.roughness}
          clearcoat={materialProps.clearcoat}
          clearcoatRoughness={materialProps.clearcoatRoughness}
          reflectivity={materialProps.reflectivity}
          map={textures.frontAlbedo}
          normalMap={textures.frontNormal}
          normalScale={new THREE.Vector2(1.2, 1.2)}
          roughnessMap={textures.frontRoughness}
          emissiveMap={textures.frontEmissiveMask}
          emissive={"#c084fc"}
          emissiveIntensity={0.2}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* 2. BACK FACE DISC (-Z) */}
      <mesh position={[0, 0, -halfThickness]} rotation={[0, Math.PI, 0]} receiveShadow castShadow>
        <circleGeometry args={[coinRadius - 0.05, 96]} />
        <meshPhysicalMaterial
          ref={backMatRef}
          color={materialProps.color}
          metalness={materialProps.metalness}
          roughness={materialProps.roughness}
          clearcoat={materialProps.clearcoat}
          clearcoatRoughness={materialProps.clearcoatRoughness}
          reflectivity={materialProps.reflectivity}
          map={textures.backAlbedo}
          normalMap={textures.backNormal}
          normalScale={new THREE.Vector2(1.2, 1.2)}
          roughnessMap={textures.backRoughness}
          emissiveMap={textures.backEmissiveMask}
          emissive={"#c084fc"}
          emissiveIntensity={0.15}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* 3. MAIN COIN CYLINDRICAL CORE & EDGE RIM */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[coinRadius, coinRadius, coinThickness, 96, 1, true]} />
        <meshPhysicalMaterial
          ref={edgeMatRef}
          color={materialProps.color}
          metalness={materialProps.metalness}
          roughness={materialProps.roughness * 0.9}
          clearcoat={materialProps.clearcoat}
          clearcoatRoughness={materialProps.clearcoatRoughness}
          map={textures.edgeAlbedo}
          normalMap={textures.edgeNormal}
          normalScale={new THREE.Vector2(1.6, 1.6)}
          roughnessMap={textures.edgeRoughness}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* 4. MODELED 3D REEDED TEETH (High Specular Edge Milling) */}
      <instancedMesh
        ref={instancedTeethRef}
        args={[teethGeometry, undefined, numTeeth]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color={materialProps.color}
          metalness={0.98}
          roughness={0.25}
          clearcoat={0.4}
        />
      </instancedMesh>

      {/* 5. FRONT BEVELED RIM COLLAR (Outer Chamfered Ring) */}
      <mesh position={[0, 0, halfThickness - 0.02]} rotation={[0, 0, 0]} castShadow>
        <torusGeometry args={[coinRadius - 0.08, 0.09, 16, 96]} />
        <meshPhysicalMaterial
          ref={rimMatRef}
          color={materialProps.color}
          metalness={materialProps.metalness}
          roughness={0.2}
          clearcoat={materialProps.clearcoat}
        />
      </mesh>

      {/* 6. BACK BEVELED RIM COLLAR */}
      <mesh position={[0, 0, -halfThickness + 0.02]} rotation={[0, 0, 0]} castShadow>
        <torusGeometry args={[coinRadius - 0.08, 0.09, 16, 96]} />
        <meshPhysicalMaterial
          color={materialProps.color}
          metalness={materialProps.metalness}
          roughness={0.2}
          clearcoat={materialProps.clearcoat}
        />
      </mesh>

      {/* 7. DYNAMIC 3D SONAR SHOCKWAVE PULSE RINGS (Front & Back) */}
      <SonarPulseRings pulseProgressRef={pulseProgressRef} pulseColorRef={pulseColorRef} isFront={true} />
      <SonarPulseRings pulseProgressRef={pulseProgressRef} pulseColorRef={pulseColorRef} isFront={false} />
    </group>
  );
};
