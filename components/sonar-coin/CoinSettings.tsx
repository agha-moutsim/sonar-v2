"use client";

import React, { useState, useEffect } from "react";
import {
  Settings2,
  X,
  RotateCcw,
  Sparkles,
  Zap,
  Play,
  Pause,
  Sun,
  Camera,
  Check,
  Radio,
  Sliders,
  Maximize2,
} from "lucide-react";
import { MaterialFinish, LightingMood, CameraPreset } from "./types";
import { MATERIAL_PRESETS, LIGHTING_PRESETS } from "./data/materials";

interface CoinSettingsProps {
  currentFinish: MaterialFinish;
  onFinishChange: (finish: MaterialFinish) => void;
  currentLighting: LightingMood;
  onLightingChange: (lighting: LightingMood) => void;
  currentPreset: CameraPreset;
  onPresetChange: (preset: CameraPreset) => void;
  coinScale?: number;
  onScaleChange?: (scale: number) => void;
  autoSpin: boolean;
  onToggleAutoSpin: () => void;
  onTriggerPulse: () => void;
  onTriggerFlip: () => void;
}

export const CoinSettings: React.FC<CoinSettingsProps> = ({
  currentFinish,
  onFinishChange,
  currentLighting,
  onLightingChange,
  currentPreset,
  onPresetChange,
  coinScale = 0.95,
  onScaleChange,
  autoSpin,
  onToggleAutoSpin,
  onTriggerPulse,
  onTriggerFlip,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'finish' | 'lighting' | 'views' | 'fx'>('finish');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSettingsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Floating Toggle Button (Scoped to Hero Section) */}
      <button
        onClick={() => setIsSettingsOpen((prev) => !prev)}
        className={`absolute top-4 right-4 sm:top-6 sm:right-6 z-30 flex items-center gap-2 px-3.5 py-2 rounded-full backdrop-blur-sm border transition-all duration-200 shadow-2xl ${
          isSettingsOpen
            ? 'bg-sonar-magenta text-white border-sonar-magenta shadow-[0_0_20px_rgba(255,46,147,0.4)]'
            : 'bg-[#0e0a1a]/85 border-white/15 text-white/80 hover:text-white hover:border-sonar-magenta/50 hover:bg-black/90'
        }`}
        title="Toggle Coin Settings"
        aria-label="Toggle Coin Settings"
      >
        <Settings2 className="w-4 h-4" />
        <span className="text-xs font-semibold tracking-wide hidden sm:inline">
          {isSettingsOpen ? 'Close Settings' : 'Coin Settings'}
        </span>
      </button>

      {/* Floating Side Panel — Absolute in Hero, Scrolls Naturally with Hero Section */}
      {isSettingsOpen && (
        <aside
          className="no-drag absolute top-16 sm:top-20 right-4 sm:right-6 z-30 w-[calc(100%-2rem)] sm:w-[340px] max-h-[calc(100%-5.5rem)] md:max-h-[580px] overflow-y-auto rounded-2xl bg-[#0e0a1a]/95 border border-white/15 shadow-[0_16px_48px_rgba(0,0,0,0.7),0_0_24px_rgba(255,46,147,0.15)] backdrop-blur-sm text-sonar-ink p-4 space-y-3.5 animate-in slide-in-from-right-4 fade-in duration-200 select-none custom-scrollbar"
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-sonar-magenta/20 border border-sonar-magenta/30 text-sonar-magenta">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold tracking-wider uppercase text-white">
                  Coin Studio
                </h2>
                <p className="text-[10px] text-sonar-ink-dim">Live 3D Customization</p>
              </div>
            </div>
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="p-1.5 rounded-full bg-white/5 border border-white/10 text-sonar-ink-dim hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close Settings"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-black/60 border border-white/5">
            {([
              { id: 'finish' as const, label: 'COLORS', icon: Sparkles },
              { id: 'lighting' as const, label: 'LIGHT', icon: Sun },
              { id: 'views' as const, label: 'VIEWS', icon: Camera },
              { id: 'fx' as const, label: 'FX/SIZE', icon: Zap },
            ]).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-[10px] font-semibold tracking-wide transition-all gap-0.5 ${
                  activeTab === tab.id
                    ? 'bg-sonar-magenta text-white shadow-[0_0_12px_rgba(255,46,147,0.4)]'
                    : 'text-sonar-ink-dim hover:text-sonar-ink hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* TAB 1: FINISHES */}
          {activeTab === 'finish' && (
            <div className="space-y-2 animate-in fade-in duration-200">
              <label className="text-[10px] font-mono uppercase tracking-wider text-sonar-ink-dim block">
                Metallic Finish
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(MATERIAL_PRESETS) as MaterialFinish[]).map((finishKey) => {
                  const preset = MATERIAL_PRESETS[finishKey];
                  const isSelected = currentFinish === finishKey;
                  return (
                    <button
                      key={finishKey}
                      onClick={() => onFinishChange(finishKey)}
                      className={`flex items-center gap-2 p-2 rounded-xl border transition-all text-left ${
                        isSelected
                          ? 'bg-sonar-magenta/20 border-sonar-magenta text-white shadow-[0_0_15px_rgba(255,46,147,0.25)]'
                          : 'bg-white/5 border-white/10 text-sonar-ink-dim hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full flex-shrink-0 border border-white/20 flex items-center justify-center shadow-inner"
                        style={{ background: `linear-gradient(135deg, ${preset.color} 0%, #111 100%)` }}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-bold truncate text-white">{preset.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: LIGHTING */}
          {activeTab === 'lighting' && (
            <div className="space-y-2 animate-in fade-in duration-200">
              <label className="text-[10px] font-mono uppercase tracking-wider text-sonar-ink-dim block">
                Studio Lighting
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(LIGHTING_PRESETS) as LightingMood[]).map((lightKey) => {
                  const preset = LIGHTING_PRESETS[lightKey];
                  const isSelected = currentLighting === lightKey;
                  return (
                    <button
                      key={lightKey}
                      onClick={() => onLightingChange(lightKey)}
                      className={`flex items-center gap-2 p-2 rounded-xl border transition-all text-left ${
                        isSelected
                          ? 'bg-sonar-magenta/20 border-sonar-magenta text-white shadow-[0_0_15px_rgba(255,46,147,0.25)]'
                          : 'bg-white/5 border-white/10 text-sonar-ink-dim hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full flex-shrink-0 border border-white/20 flex items-center justify-center shadow-inner"
                        style={{ background: `linear-gradient(135deg, ${preset.rimLightColor} 0%, #111 100%)` }}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-bold truncate text-white">{preset.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: VIEWS */}
          {activeTab === 'views' && (
            <div className="space-y-2 animate-in fade-in duration-200">
              <label className="text-[10px] font-mono uppercase tracking-wider text-sonar-ink-dim block">
                Camera Angle
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'hero' as CameraPreset, name: 'Hero', desc: 'Front 3/4' },
                    { id: 'front' as CameraPreset, name: 'Front', desc: 'Face on' },
                    { id: 'back' as CameraPreset, name: 'Back', desc: 'Reverse' },
                    { id: 'edge' as CameraPreset, name: 'Edge', desc: 'Side edge' },
                    { id: 'macro' as CameraPreset, name: 'Macro', desc: 'Close-up' },
                  ]
                ).map((view) => {
                  const isSelected = currentPreset === view.id;
                  return (
                    <button
                      key={view.id}
                      onClick={() => onPresetChange(view.id)}
                      className={`flex flex-col p-2 rounded-xl border transition-all text-left ${
                        isSelected
                          ? 'bg-sonar-magenta/20 border-sonar-magenta text-white shadow-[0_0_15px_rgba(255,46,147,0.25)]'
                          : 'bg-white/5 border-white/10 text-sonar-ink-dim hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-[11px] font-bold text-white">{view.name}</span>
                      <span className="text-[9px] text-sonar-ink-dim">{view.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: FX & COIN SIZE */}
          {activeTab === 'fx' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              {/* Coin Size Control */}
              <div className="space-y-1.5 p-2.5 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-sonar-magenta" />
                    <span className="text-[11px] font-bold text-white">Coin Size</span>
                  </div>
                  <span className="text-[10px] font-mono text-sonar-ink-dim">
                    {Math.round((coinScale / 0.95) * 100)}%
                  </span>
                </div>

                {/* Quick Presets */}
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {[
                    { label: 'Medium', value: 0.70 },
                    { label: 'Very Large', value: 0.95 },
                    { label: 'Giant', value: 1.15 },
                  ].map((sz) => (
                    <button
                      key={sz.label}
                      onClick={() => onScaleChange?.(sz.value)}
                      className={`py-1 px-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                        Math.abs(coinScale - sz.value) < 0.05
                          ? 'bg-sonar-magenta text-white shadow-[0_0_10px_rgba(255,46,147,0.4)]'
                          : 'bg-white/5 text-sonar-ink-dim hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>

                {/* Smooth Size Slider */}
                {onScaleChange && (
                  <div className="pt-1.5">
                    <input
                      type="range"
                      min="0.50"
                      max="1.25"
                      step="0.02"
                      value={coinScale}
                      onChange={(e) => onScaleChange(parseFloat(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ff2e93]"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons: Flip + Pulse */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onTriggerFlip}
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white/5 border border-white/10 text-sonar-ink-dim hover:bg-sonar-magenta/15 hover:border-sonar-magenta/40 hover:text-white transition-all group"
                >
                  <RotateCcw className="w-4 h-4 text-sonar-magenta group-hover:rotate-180 transition-transform duration-500" />
                  <span className="text-[10px] font-bold">FLIP COIN</span>
                </button>

                <button
                  onClick={onTriggerPulse}
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white/5 border border-white/10 text-sonar-ink-dim hover:bg-sonar-violet/15 hover:border-sonar-violet/40 hover:text-white transition-all group"
                >
                  <Radio className="w-4 h-4 text-sonar-violet group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold">PULSE</span>
                </button>
              </div>

              {/* Auto-Spin Sway Toggle */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-white/5 text-sonar-magenta">
                    {autoSpin ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                  </div>
                  <span className="text-[11px] font-bold text-white">Auto Sway</span>
                </div>
                <button
                  onClick={onToggleAutoSpin}
                  className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold transition-all ${
                    autoSpin
                      ? 'bg-sonar-magenta text-white shadow-[0_0_8px_rgba(255,46,147,0.4)]'
                      : 'bg-white/10 text-sonar-ink-dim hover:text-white'
                  }`}
                >
                  {autoSpin ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <button
              onClick={() => {
                onPresetChange('hero');
                onFinishChange('gunmetal');
                onLightingChange('cyber_neon');
                onScaleChange?.(0.95);
              }}
              className="flex items-center gap-1 text-[10px] text-sonar-ink-dim hover:text-white transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>

            <button
              onClick={() => setIsSettingsOpen(false)}
              className="px-3 py-1 rounded-lg bg-sonar-magenta hover:bg-sonar-magenta/80 text-white text-[11px] font-semibold transition-all shadow-[0_0_10px_rgba(255,46,147,0.3)]"
            >
              Done
            </button>
          </div>
        </aside>
      )}
    </>
  );
};
