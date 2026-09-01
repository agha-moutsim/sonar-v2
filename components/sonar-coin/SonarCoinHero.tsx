"use client";

import React from "react";
import { CoinCanvas } from "./CoinCanvas";
import { MATERIAL_PRESETS, LIGHTING_PRESETS } from "./data/materials";

export default function SonarCoinHero() {
  const materialProps = MATERIAL_PRESETS['gunmetal'];
  const lightingSetup = LIGHTING_PRESETS['cyber_neon'];

  return (
    <div className="relative w-full mx-auto" style={{ aspectRatio: "1/1", height: "auto" }}>
      <div className="absolute inset-0">
        <CoinCanvas
          materialProps={materialProps}
          lightingMood={lightingSetup.name}
          cameraPreset="hero"
          autoSpin={true}
          coinScale={0.95}
        />
      </div>
    </div>
  );
}
