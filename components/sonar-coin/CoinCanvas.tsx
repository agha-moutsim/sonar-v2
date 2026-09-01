import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { CoinScene } from "./CoinScene";
import { MaterialProperties, LightingMood, CameraPreset } from "./types";

interface CoinCanvasProps {
  materialProps: MaterialProperties;
  lightingMood: LightingMood;
  cameraPreset: CameraPreset;
  autoSpin: boolean;
  coinScale?: number;
  triggerPulseExternal?: number;
  triggerFlipExternal?: number;
}

export const CoinCanvas: React.FC<CoinCanvasProps> = ({
  materialProps,
  lightingMood,
  cameraPreset,
  autoSpin,
  coinScale,
  triggerPulseExternal,
  triggerFlipExternal,
}) => {
  return (
    <div className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
        }}
        camera={{
          fov: 42,
          near: 0.1,
          far: 50,
          position: [0, 0, 7.0],
        }}
      >
        <Suspense fallback={null}>
          <CoinScene
            materialProps={materialProps}
            lightingMood={lightingMood}
            cameraPreset={cameraPreset}
            autoSpin={autoSpin}
            coinScale={coinScale}
            triggerPulseExternal={triggerPulseExternal}
            triggerFlipExternal={triggerFlipExternal}
          />

          {/* Simplified Post-Processing: Only subtle Bloom */}
          <EffectComposer multisampling={0}>
            <Bloom
              luminanceThreshold={0.6}
              luminanceSmoothing={0.3}
              intensity={0.8}
              mipmapBlur
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
};
