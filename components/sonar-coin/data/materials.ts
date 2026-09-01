import { MaterialFinish, MaterialProperties, LightingMood } from '../types';

export const MATERIAL_PRESETS: Record<MaterialFinish, MaterialProperties> = {
  gunmetal: {
    name: 'gunmetal',
    label: 'Dark Gunmetal',
    color: '#1a1b24',
    metalness: 0.95,
    roughness: 0.28,
    clearcoat: 0.35,
    clearcoatRoughness: 0.18,
    reflectivity: 0.9,
    accentColor: '#a855f7',
    description: 'Precision-machined darkened aerospace alloy with subtle satin sheen.',
  },
  titanium: {
    name: 'titanium',
    label: 'Blackened Titanium',
    color: '#10121a',
    metalness: 0.98,
    roughness: 0.22,
    clearcoat: 0.5,
    clearcoatRoughness: 0.12,
    reflectivity: 0.95,
    accentColor: '#c084fc',
    description: 'Ultra-dense blackened titanium with crisp specular edge definition.',
  },
  obsidian: {
    name: 'obsidian',
    label: 'Deep Obsidian',
    color: '#08090e',
    metalness: 0.88,
    roughness: 0.14,
    clearcoat: 0.85,
    clearcoatRoughness: 0.08,
    reflectivity: 0.98,
    accentColor: '#ec4899',
    description: 'Mirror-grade volcanic crystal finish with deep purple chromatic depth.',
  },
  chrome: {
    name: 'chrome',
    label: 'Cyber Chrome',
    color: '#282b3a',
    metalness: 1.0,
    roughness: 0.16,
    clearcoat: 0.6,
    clearcoatRoughness: 0.1,
    reflectivity: 1.0,
    accentColor: '#38bdf8',
    description: 'High-reflectance liquid chrome with crisp anisotropic highlight bands.',
  },
  carbon: {
    name: 'carbon',
    label: 'Stealth Carbon',
    color: '#121318',
    metalness: 0.75,
    roughness: 0.38,
    clearcoat: 0.2,
    clearcoatRoughness: 0.3,
    reflectivity: 0.7,
    accentColor: '#f43f5e',
    description: 'Matte forged carbon substrate with low optical reflectivity.',
  },
};

export interface LightingSetup {
  name: LightingMood;
  label: string;
  ambientColor: string;
  ambientIntensity: number;
  keyLightColor: string;
  keyLightIntensity: number;
  rimLightColor: string;
  rimLightIntensity: number;
  fillLightColor: string;
  fillLightIntensity: number;
  kickerColor: string;
  kickerIntensity: number;
}

export const LIGHTING_PRESETS: Record<LightingMood, LightingSetup> = {
  cyber_neon: {
    name: 'cyber_neon',
    label: 'Cyber Violet (Hero)',
    ambientColor: '#0b0c1c',
    ambientIntensity: 0.8,
    keyLightColor: '#ffffff',
    keyLightIntensity: 2.2,
    rimLightColor: '#a855f7',
    rimLightIntensity: 4.5,
    fillLightColor: '#ec4899',
    fillLightIntensity: 2.8,
    kickerColor: '#38bdf8',
    kickerIntensity: 2.0,
  },
  deep_studio: {
    name: 'deep_studio',
    label: 'Minimal Studio',
    ambientColor: '#06070c',
    ambientIntensity: 0.6,
    keyLightColor: '#f8fafc',
    keyLightIntensity: 2.8,
    rimLightColor: '#818cf8',
    rimLightIntensity: 3.0,
    fillLightColor: '#c084fc',
    fillLightIntensity: 1.5,
    kickerColor: '#ffffff',
    kickerIntensity: 1.2,
  },
  eclipse_violet: {
    name: 'eclipse_violet',
    label: 'Eclipse Violet',
    ambientColor: '#120726',
    ambientIntensity: 1.0,
    keyLightColor: '#e9d5ff',
    keyLightIntensity: 2.0,
    rimLightColor: '#d946ef',
    rimLightIntensity: 5.5,
    fillLightColor: '#7c3aed',
    fillLightIntensity: 3.5,
    kickerColor: '#f472b6',
    kickerIntensity: 3.0,
  },
  high_contrast: {
    name: 'high_contrast',
    label: 'High-Contrast Dark',
    ambientColor: '#030407',
    ambientIntensity: 0.4,
    keyLightColor: '#ffffff',
    keyLightIntensity: 3.5,
    rimLightColor: '#c084fc',
    rimLightIntensity: 4.0,
    fillLightColor: '#3b82f6',
    fillLightIntensity: 1.8,
    kickerColor: '#ec4899',
    kickerIntensity: 2.2,
  },
};
