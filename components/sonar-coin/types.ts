export type MaterialFinish = 'gunmetal' | 'titanium' | 'obsidian' | 'chrome' | 'carbon';

export type LightingMood = 'cyber_neon' | 'deep_studio' | 'eclipse_violet' | 'high_contrast';

export type CameraPreset = 'hero' | 'front' | 'back' | 'edge' | 'macro';

export interface PulseEvent {
  id: number;
  startTime: number;
  strength: number;
  color: string;
}

export interface CoinTelemetry {
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  rpm: number;
  pulseActive: boolean;
  proximityDistance: number;
  frequency: number;
}

export interface MaterialProperties {
  name: string;
  label: string;
  color: string;
  metalness: number;
  roughness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  reflectivity: number;
  accentColor: string;
  description: string;
}
