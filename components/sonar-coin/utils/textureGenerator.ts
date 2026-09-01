import * as THREE from 'three';

/**
 * Procedural Texture Generator for Photorealistic SONAR Coin
 * Generates ultra-crisp Albedo, Normal, Roughness, Metalness, and Emissive Mask maps.
 */

export interface CoinTextures {
  frontAlbedo: THREE.CanvasTexture;
  frontNormal: THREE.CanvasTexture;
  frontRoughness: THREE.CanvasTexture;
  frontEmissiveMask: THREE.CanvasTexture;
  
  backAlbedo: THREE.CanvasTexture;
  backNormal: THREE.CanvasTexture;
  backRoughness: THREE.CanvasTexture;
  backEmissiveMask: THREE.CanvasTexture;

  edgeAlbedo: THREE.CanvasTexture;
  edgeNormal: THREE.CanvasTexture;
  edgeRoughness: THREE.CanvasTexture;
}

let cachedTextures: CoinTextures | null = null;

export function getCoinTextures(): CoinTextures {
  if (cachedTextures) return cachedTextures;

  const size = 2048;

  // 1. FRONT HEIGHT & ALBEDO CANVAS
  const frontCanvas = document.createElement('canvas');
  frontCanvas.width = size;
  frontCanvas.height = size;
  const ctx = frontCanvas.getContext('2d')!;

  const frontHeightCanvas = document.createElement('canvas');
  frontHeightCanvas.width = size;
  frontHeightCanvas.height = size;
  const hCtx = frontHeightCanvas.getContext('2d')!;

  const frontRoughCanvas = document.createElement('canvas');
  frontRoughCanvas.width = size;
  frontRoughCanvas.height = size;
  const rCtx = frontRoughCanvas.getContext('2d')!;

  const frontEmissiveCanvas = document.createElement('canvas');
  frontEmissiveCanvas.width = size;
  frontEmissiveCanvas.height = size;
  const eCtx = frontEmissiveCanvas.getContext('2d')!;

  // 2. BACK CANVASES
  const backCanvas = document.createElement('canvas');
  backCanvas.width = size;
  backCanvas.height = size;
  const bCtx = backCanvas.getContext('2d')!;

  const backHeightCanvas = document.createElement('canvas');
  backHeightCanvas.width = size;
  backHeightCanvas.height = size;
  const bhCtx = backHeightCanvas.getContext('2d')!;

  const backRoughCanvas = document.createElement('canvas');
  backRoughCanvas.width = size;
  backRoughCanvas.height = size;
  const brCtx = backRoughCanvas.getContext('2d')!;

  const backEmissiveCanvas = document.createElement('canvas');
  backEmissiveCanvas.width = size;
  backEmissiveCanvas.height = size;
  const beCtx = backEmissiveCanvas.getContext('2d')!;

  // Helper: Draw Brushed Metal Grain (Circular Lathe Turning)
  function drawCircularBrushedGrain(context: CanvasRenderingContext2D, baseLuma: number, variance: number) {
    const center = size / 2;
    context.fillStyle = `rgb(${baseLuma}, ${baseLuma}, ${baseLuma})`;
    context.fillRect(0, 0, size, size);

    context.lineWidth = 1;
    for (let r = 10; r < size * 0.72; r += 1.5) {
      const alpha = 0.04 + Math.random() * variance;
      const shade = Math.random() > 0.5 ? 255 : 0;
      context.strokeStyle = `rgba(${shade}, ${shade}, ${shade}, ${alpha})`;
      context.beginPath();
      context.arc(center, center, r, 0, Math.PI * 2);
      context.stroke();
    }

    // Micro-scratches & machining tangential passes
    for (let i = 0; i < 400; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * (size * 0.45);
      const x = center + Math.cos(angle) * dist;
      const y = center + Math.sin(angle) * dist;
      const len = 15 + Math.random() * 45;
      const tangent = angle + Math.PI / 2 + (Math.random() - 0.5) * 0.3;

      context.strokeStyle = `rgba(${Math.random() > 0.6 ? 240 : 20}, ${Math.random() > 0.6 ? 240 : 20}, ${Math.random() > 0.6 ? 240 : 20}, ${0.03 + Math.random() * 0.05})`;
      context.lineWidth = 0.75 + Math.random() * 0.8;
      context.beginPath();
      context.moveTo(x - Math.cos(tangent) * len, y - Math.sin(tangent) * len);
      context.lineTo(x + Math.cos(tangent) * len, y + Math.sin(tangent) * len);
      context.stroke();
    }
  }

  // Generate Base Metals
  drawCircularBrushedGrain(ctx, 28, 0.08);
  drawCircularBrushedGrain(bCtx, 28, 0.08);

  // Heightmaps default to neutral 128
  hCtx.fillStyle = '#808080';
  hCtx.fillRect(0, 0, size, size);
  bhCtx.fillStyle = '#808080';
  bhCtx.fillRect(0, 0, size, size);

  // Roughness default
  rCtx.fillStyle = '#484848'; // Satin low roughness
  rCtx.fillRect(0, 0, size, size);
  brCtx.fillStyle = '#484848';
  brCtx.fillRect(0, 0, size, size);

  // Emissive default black
  eCtx.fillStyle = '#000000';
  eCtx.fillRect(0, 0, size, size);
  beCtx.fillStyle = '#000000';
  beCtx.fillRect(0, 0, size, size);

  const center = size / 2;

  // ==========================================
  // --- FRONT FACE: THE SONAR PULSE EMITTER ---
  // ==========================================

  // 1. Outer stepped rim bevels
  const rimRadii = [size * 0.485, size * 0.47, size * 0.455, size * 0.44];
  rimRadii.forEach((r, idx) => {
    const isRaised = idx % 2 === 0;
    
    // Albedo
    ctx.strokeStyle = isRaised ? '#555565' : '#181922';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(center, center, r, 0, Math.PI * 2);
    ctx.stroke();

    // Height
    hCtx.strokeStyle = isRaised ? '#c0c0c0' : '#404040';
    hCtx.lineWidth = 4;
    hCtx.beginPath();
    hCtx.arc(center, center, r, 0, Math.PI * 2);
    hCtx.stroke();
  });

  // 2. Concentric Sonar Wave Rings (Machined Ripples with Wave Dynamics)
  const sonarRingRadii = [
    size * 0.08,  // Core pulse 1
    size * 0.14,  // Core pulse 2
    size * 0.20,  // Ring 3
    size * 0.26,  // Ring 4
    size * 0.32,  // Ring 5
    size * 0.38,  // Outer Ring 6
  ];

  sonarRingRadii.forEach((r, idx) => {
    // Albedo: Dark metallic groove with subtle reflective rim
    ctx.strokeStyle = '#0f1016';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(center, center, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#4e5065';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(center, center, r - 2, 0, Math.PI * 2);
    ctx.stroke();

    // Height: Deep groove (dark) surrounded by bright chamfered edge (light)
    hCtx.strokeStyle = '#222222';
    hCtx.lineWidth = 6;
    hCtx.beginPath();
    hCtx.arc(center, center, r, 0, Math.PI * 2);
    hCtx.stroke();

    hCtx.strokeStyle = '#b0b0b0';
    hCtx.lineWidth = 2;
    hCtx.beginPath();
    hCtx.arc(center, center, r + 3, 0, Math.PI * 2);
    hCtx.stroke();

    // Emissive mask for dynamic pulse
    eCtx.strokeStyle = '#ffffff';
    eCtx.lineWidth = 6;
    eCtx.beginPath();
    eCtx.arc(center, center, r, 0, Math.PI * 2);
    eCtx.stroke();

    // Roughness: Grooves have slightly different micro-specularity
    rCtx.strokeStyle = '#202020'; // shinier inside groove
    rCtx.lineWidth = 5;
    rCtx.beginPath();
    rCtx.arc(center, center, r, 0, Math.PI * 2);
    rCtx.stroke();
  });

  // 3. Radial Sonar Sweep Crosshairs & Azimuth Ticks
  const azimuthDivisions = 36;
  for (let i = 0; i < azimuthDivisions; i++) {
    const angle = (i / azimuthDivisions) * Math.PI * 2;
    const isMajor = i % 9 === 0; // Cardinal 0, 90, 180, 270
    const isSemi = i % 3 === 0;

    const innerR = isMajor ? size * 0.05 : (isSemi ? size * 0.28 : size * 0.35);
    const outerR = isMajor ? size * 0.44 : (isSemi ? size * 0.39 : size * 0.38);

    const x1 = center + Math.cos(angle) * innerR;
    const y1 = center + Math.sin(angle) * innerR;
    const x2 = center + Math.cos(angle) * outerR;
    const y2 = center + Math.sin(angle) * outerR;

    ctx.strokeStyle = isMajor ? '#404255' : 'rgba(70, 75, 95, 0.4)';
    ctx.lineWidth = isMajor ? 2.5 : 1.2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    hCtx.strokeStyle = isMajor ? '#353535' : '#555555';
    hCtx.lineWidth = isMajor ? 2.5 : 1.2;
    hCtx.beginPath();
    hCtx.moveTo(x1, y1);
    hCtx.lineTo(x2, y2);
    hCtx.stroke();

    if (isMajor) {
      eCtx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      eCtx.lineWidth = 2;
      eCtx.beginPath();
      eCtx.moveTo(x1, y1);
      eCtx.lineTo(x2, y2);
      eCtx.stroke();
    }
  }

  // 4. Central Sonar Emitter Diode / Core
  const coreRadius = size * 0.05;
  // Albedo
  const coreGrad = ctx.createRadialGradient(center, center, 2, center, center, coreRadius);
  coreGrad.addColorStop(0, '#7c3aed');
  coreGrad.addColorStop(0.5, '#4c1d95');
  coreGrad.addColorStop(1, '#0e1017');
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(center, center, coreRadius, 0, Math.PI * 2);
  ctx.fill();

  // Emissive
  const eCoreGrad = eCtx.createRadialGradient(center, center, 0, center, center, coreRadius);
  eCoreGrad.addColorStop(0, '#ffffff');
  eCoreGrad.addColorStop(0.7, '#c084fc');
  eCoreGrad.addColorStop(1, '#000000');
  eCtx.fillStyle = eCoreGrad;
  eCtx.beginPath();
  eCtx.arc(center, center, coreRadius, 0, Math.PI * 2);
  eCtx.fill();

  // Height (core dome)
  const hCoreGrad = hCtx.createRadialGradient(center, center, 0, center, center, coreRadius);
  hCoreGrad.addColorStop(0, '#ffffff');
  hCoreGrad.addColorStop(0.7, '#a0a0a0');
  hCoreGrad.addColorStop(1, '#303030');
  hCtx.fillStyle = hCoreGrad;
  hCtx.beginPath();
  hCtx.arc(center, center, coreRadius, 0, Math.PI * 2);
  hCtx.fill();

  // 5. Machined Typography: "SONAR" across upper arc - HIGH VISIBILITY & ENGRAVED RELIEF
  const arcRadiusUpper = size * 0.35;
  const brandText = "SONAR";
  // Bold high-contrast white albedo with crisp dark drop contour
  drawCurvedText(ctx, brandText, center, center, arcRadiusUpper, -Math.PI / 2.05, '900 72px Syne, sans-serif', '#ffffff', '#000000', 8, false, '#94a3b8', 2);
  // Deep crisp height displacement
  drawCurvedText(hCtx, brandText, center, center, arcRadiusUpper, -Math.PI / 2.05, '900 72px Syne, sans-serif', '#ffffff', '#111111', 6, false, '#ffffff', 4);
  // Polished specular mirror finish on letters
  drawCurvedText(rCtx, brandText, center, center, arcRadiusUpper, -Math.PI / 2.05, '900 72px Syne, sans-serif', '#181818', '#666666', 2);
  // Luminescent emissive highlight so the letters are always visible
  drawCurvedText(eCtx, brandText, center, center, arcRadiusUpper, -Math.PI / 2.05, '900 72px Syne, sans-serif', 'rgba(255, 255, 255, 0.85)', '#000000', 4);

  // 6. Lower Technical Markings: Coordinates, Frequency, Specs
  const arcRadiusLower = size * 0.415;
  const techText = "FREQ 44.1 kHz  //  RANGE 5000M  //  PROOF OF ECHO  //  SPEC 01";
  drawCurvedText(ctx, techText, center, center, arcRadiusLower, Math.PI / 2, 'bold 34px "JetBrains Mono", monospace', '#f1f5f9', '#050508', 3, true, '#cbd5e1', 1);
  drawCurvedText(hCtx, techText, center, center, arcRadiusLower, Math.PI / 2, 'bold 34px "JetBrains Mono", monospace', '#ffffff', '#202020', 3, true, '#ffffff', 2);
  drawCurvedText(eCtx, techText, center, center, arcRadiusLower, Math.PI / 2, 'bold 34px "JetBrains Mono", monospace', 'rgba(192, 132, 252, 0.4)', '#000000', 2, true);

  // ==========================================
  // --- BACK FACE: THE ECHO NETWORK NEXUS ---
  // ==========================================

  // 1. Back Outer Rim & Stepped Bevels
  rimRadii.forEach((r, idx) => {
    const isRaised = idx % 2 === 0;
    bCtx.strokeStyle = isRaised ? '#555565' : '#181922';
    bCtx.lineWidth = 3;
    bCtx.beginPath();
    bCtx.arc(center, center, r, 0, Math.PI * 2);
    bCtx.stroke();

    bhCtx.strokeStyle = isRaised ? '#c0c0c0' : '#404040';
    bhCtx.lineWidth = 4;
    bhCtx.beginPath();
    bhCtx.arc(center, center, r, 0, Math.PI * 2);
    bhCtx.stroke();
  });

  // 2. Central Geometric SONAR Logo (Hexagonal / Wave Matrix)
  const hexSize = size * 0.16;
  drawBackEmblem(bCtx, bhCtx, brCtx, beCtx, center, center, hexSize);

  // 3. Technical Concentric Radar Grid
  const backRingRadii = [size * 0.22, size * 0.28, size * 0.34];
  backRingRadii.forEach((r) => {
    bCtx.strokeStyle = 'rgba(78, 80, 101, 0.6)';
    bCtx.lineWidth = 3;
    bCtx.beginPath();
    bCtx.arc(center, center, r, 0, Math.PI * 2);
    bCtx.stroke();

    bhCtx.strokeStyle = '#404040';
    bhCtx.lineWidth = 3;
    bhCtx.beginPath();
    bhCtx.arc(center, center, r, 0, Math.PI * 2);
    bhCtx.stroke();

    beCtx.strokeStyle = '#ffffff';
    beCtx.lineWidth = 2.5;
    beCtx.beginPath();
    beCtx.arc(center, center, r, 0, Math.PI * 2);
    beCtx.stroke();
  });

  // Micro hash markings around 360 degrees
  for (let a = 0; a < 72; a++) {
    const angle = (a / 72) * Math.PI * 2;
    const len = a % 6 === 0 ? 18 : 8;
    const r1 = size * 0.355;
    const r2 = r1 + len;

    const x1 = center + Math.cos(angle) * r1;
    const y1 = center + Math.sin(angle) * r1;
    const x2 = center + Math.cos(angle) * r2;
    const y2 = center + Math.sin(angle) * r2;

    bCtx.strokeStyle = '#64748b';
    bCtx.lineWidth = 2;
    bCtx.beginPath();
    bCtx.moveTo(x1, y1);
    bCtx.lineTo(x2, y2);
    bCtx.stroke();

    bhCtx.strokeStyle = '#303030';
    bhCtx.lineWidth = 2;
    bhCtx.beginPath();
    bhCtx.moveTo(x1, y1);
    bhCtx.lineTo(x2, y2);
    bhCtx.stroke();
  }

  // 4. Back Perimeter Engraved Typography - HIGH VISIBILITY
  const backUpperText = "SONAR PROTOCOL • ZERO KNOWLEDGE ECHO";
  drawCurvedText(bCtx, backUpperText, center, center, arcRadiusUpper, -Math.PI / 2, 'bold 52px Syne, sans-serif', '#ffffff', '#000000', 4, false, '#94a3b8', 2);
  drawCurvedText(bhCtx, backUpperText, center, center, arcRadiusUpper, -Math.PI / 2, 'bold 52px Syne, sans-serif', '#ffffff', '#181818', 4, false, '#ffffff', 2);

  const backLowerText = "HARDWARE SECURE TOKEN • 2026 EDITION • 0x7E9A";
  drawCurvedText(bCtx, backLowerText, center, center, arcRadiusLower, Math.PI / 2, 'bold 36px "JetBrains Mono", monospace', '#f1f5f9', '#050508', 3, true, '#cbd5e1', 1);
  drawCurvedText(bhCtx, backLowerText, center, center, arcRadiusLower, Math.PI / 2, 'bold 36px "JetBrains Mono", monospace', '#ffffff', '#181818', 3, true, '#ffffff', 2);

  // ==========================================
  // --- EDGE TEXTURES (Milled Grooves / Reeded) ---
  // ==========================================
  const edgeWidth = 2048;
  const edgeHeight = 256;

  const edgeCanvas = document.createElement('canvas');
  edgeCanvas.width = edgeWidth;
  edgeCanvas.height = edgeHeight;
  const eEdgeCtx = edgeCanvas.getContext('2d')!;

  const edgeHeightCanvas = document.createElement('canvas');
  edgeHeightCanvas.width = edgeWidth;
  edgeHeightCanvas.height = edgeHeight;
  const ehCtx = edgeHeightCanvas.getContext('2d')!;

  const edgeRoughCanvas = document.createElement('canvas');
  edgeRoughCanvas.width = edgeWidth;
  edgeRoughCanvas.height = edgeHeight;
  const erCtx = edgeRoughCanvas.getContext('2d')!;

  // Base Edge Tone
  eEdgeCtx.fillStyle = '#22242d';
  eEdgeCtx.fillRect(0, 0, edgeWidth, edgeHeight);
  ehCtx.fillStyle = '#808080';
  ehCtx.fillRect(0, 0, edgeWidth, edgeHeight);
  erCtx.fillStyle = '#404040';
  erCtx.fillRect(0, 0, edgeWidth, edgeHeight);

  // Reeded Teeth + Sonar Signal Bars
  const numTeeth = 160;
  const toothWidth = edgeWidth / numTeeth;
  for (let i = 0; i < numTeeth; i++) {
    const x = i * toothWidth;
    // Varying height like a frequency waveform
    const waveFactor = 0.5 + 0.5 * Math.sin((i / numTeeth) * Math.PI * 12);
    const barTop = 20 + (1 - waveFactor) * 40;
    const barBottom = edgeHeight - 20 - (1 - waveFactor) * 40;

    // Albedo
    eEdgeCtx.fillStyle = i % 2 === 0 ? '#484b5c' : '#14151c';
    eEdgeCtx.fillRect(x, barTop, toothWidth * 0.65, barBottom - barTop);

    // Height (deep grooves and chamfered peaks)
    ehCtx.fillStyle = i % 2 === 0 ? '#e0e0e0' : '#282828';
    ehCtx.fillRect(x, barTop, toothWidth * 0.65, barBottom - barTop);

    // Roughness
    erCtx.fillStyle = i % 2 === 0 ? '#303030' : '#606060';
    erCtx.fillRect(x, barTop, toothWidth * 0.65, barBottom - barTop);
  }

  // Outer bevel lines on the edge rim
  [6, 12, edgeHeight - 12, edgeHeight - 6].forEach((y, i) => {
    const bright = i === 1 || i === 2;
    ehCtx.fillStyle = bright ? '#f0f0f0' : '#303030';
    ehCtx.fillRect(0, y, edgeWidth, 3);
    eEdgeCtx.fillStyle = bright ? '#60647a' : '#101118';
    eEdgeCtx.fillRect(0, y, edgeWidth, 3);
  });

  // ==========================================
  // --- GENERATE HIGH PRECISION NORMAL MAPS ---
  // ==========================================
  const frontNormalCanvas = generateNormalMapFromHeight(frontHeightCanvas);
  const backNormalCanvas = generateNormalMapFromHeight(backHeightCanvas);
  const edgeNormalCanvas = generateNormalMapFromHeight(edgeHeightCanvas);

  // Wrap in Three.js Canvas Textures
  function makeTexture(canvas: HTMLCanvasElement, sRGB: boolean = false): THREE.CanvasTexture {
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 16;
    if (sRGB) {
      tex.colorSpace = THREE.SRGBColorSpace;
    }
    return tex;
  }

  cachedTextures = {
    frontAlbedo: makeTexture(frontCanvas, true),
    frontNormal: makeTexture(frontNormalCanvas),
    frontRoughness: makeTexture(frontRoughCanvas),
    frontEmissiveMask: makeTexture(frontEmissiveCanvas),

    backAlbedo: makeTexture(backCanvas, true),
    backNormal: makeTexture(backNormalCanvas),
    backRoughness: makeTexture(backRoughCanvas),
    backEmissiveMask: makeTexture(backEmissiveCanvas),

    edgeAlbedo: makeTexture(edgeCanvas, true),
    edgeNormal: makeTexture(edgeNormalCanvas),
    edgeRoughness: makeTexture(edgeRoughCanvas),
  };

  return cachedTextures;
}

/**
 * Curved Text Renderer along an arc
 */
function drawCurvedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  font: string,
  fillColor: string,
  shadowColor: string,
  shadowBlur: number = 2,
  inward: boolean = false,
  strokeColor?: string,
  strokeWidth?: number
) {
  ctx.save();
  ctx.font = font;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  const chars = text.split('');
  const totalWidth = ctx.measureText(text).width;
  const angularSpan = totalWidth / radius;
  let currentAngle = startAngle - (inward ? -angularSpan / 2 : angularSpan / 2);

  chars.forEach((char) => {
    const charWidth = ctx.measureText(char).width;
    const charAngle = charWidth / radius;
    const midAngle = inward ? currentAngle - charAngle / 2 : currentAngle + charAngle / 2;

    ctx.save();
    const x = centerX + Math.cos(midAngle) * radius;
    const y = centerY + Math.sin(midAngle) * radius;
    ctx.translate(x, y);
    ctx.rotate(midAngle + (inward ? -Math.PI / 2 : Math.PI / 2));

    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = shadowBlur;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    if (strokeColor && strokeWidth) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.strokeText(char, 0, 0);
    }

    ctx.fillStyle = fillColor;
    ctx.fillText(char, 0, 0);

    ctx.restore();
    currentAngle += inward ? -charAngle : charAngle;
  });

  ctx.restore();
}

/**
 * Central Back Emblem: Geometric Sonar Wave Matrix
 */
function drawBackEmblem(
  ctx: CanvasRenderingContext2D,
  hCtx: CanvasRenderingContext2D,
  rCtx: CanvasRenderingContext2D,
  eCtx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rad: number
) {
  ctx.save();
  hCtx.save();
  eCtx.save();

  // Hexagon Outline
  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 8;
  hCtx.strokeStyle = '#ffffff';
  hCtx.lineWidth = 10;
  eCtx.strokeStyle = '#ffffff';
  eCtx.lineWidth = 6;

  ctx.beginPath();
  hCtx.beginPath();
  eCtx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const x = cx + Math.cos(a) * rad;
    const y = cy + Math.sin(a) * rad;
    if (i === 0) {
      ctx.moveTo(x, y);
      hCtx.moveTo(x, y);
      eCtx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      hCtx.lineTo(x, y);
      eCtx.lineTo(x, y);
    }
  }
  ctx.closePath();
  hCtx.closePath();
  eCtx.closePath();
  ctx.stroke();
  hCtx.stroke();
  eCtx.stroke();

  // Concentric Expanding Sonar Arcs inside hexagon
  [0.35, 0.6, 0.85].forEach((scale) => {
    ctx.strokeStyle = '#9333ea';
    ctx.lineWidth = 5;
    hCtx.strokeStyle = '#d0d0d0';
    hCtx.lineWidth = 6;
    eCtx.strokeStyle = '#a855f7';
    eCtx.lineWidth = 4;

    ctx.beginPath();
    hCtx.beginPath();
    eCtx.beginPath();
    ctx.arc(cx, cy, rad * scale, 0, Math.PI * 2);
    hCtx.arc(cx, cy, rad * scale, 0, Math.PI * 2);
    eCtx.arc(cx, cy, rad * scale, 0, Math.PI * 2);
    ctx.stroke();
    hCtx.stroke();
    eCtx.stroke();
  });

  // Central Pulse Core Node
  ctx.fillStyle = '#ec4899';
  ctx.beginPath();
  ctx.arc(cx, cy, rad * 0.18, 0, Math.PI * 2);
  ctx.fill();

  hCtx.fillStyle = '#ffffff';
  hCtx.beginPath();
  hCtx.arc(cx, cy, rad * 0.18, 0, Math.PI * 2);
  hCtx.fill();

  eCtx.fillStyle = '#ffffff';
  eCtx.beginPath();
  eCtx.arc(cx, cy, rad * 0.18, 0, Math.PI * 2);
  eCtx.fill();

  ctx.restore();
  hCtx.restore();
  eCtx.restore();
}

/**
 * Sobel Filter based Normal Map Generator
 */
function generateNormalMapFromHeight(heightCanvas: HTMLCanvasElement): HTMLCanvasElement {
  const w = heightCanvas.width;
  const h = heightCanvas.height;
  const hCtx = heightCanvas.getContext('2d')!;
  const imgData = hCtx.getImageData(0, 0, w, h);
  const src = imgData.data;

  const normalCanvas = document.createElement('canvas');
  normalCanvas.width = w;
  normalCanvas.height = h;
  const nCtx = normalCanvas.getContext('2d')!;
  const outImgData = nCtx.createImageData(w, h);
  const out = outImgData.data;

  const strength = 3.5;

  const getLuma = (x: number, y: number): number => {
    const px = ((y + h) % h) * w + ((x + w) % w);
    return src[px * 4]; // Red channel
  };

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // Sobel kernel 3x3
      const tl = getLuma(x - 1, y - 1);
      const t  = getLuma(x,     y - 1);
      const tr = getLuma(x + 1, y - 1);
      const l  = getLuma(x - 1, y);
      const r  = getLuma(x + 1, y);
      const bl = getLuma(x - 1, y + 1);
      const b  = getLuma(x,     y + 1);
      const br = getLuma(x + 1, y + 1);

      const dx = (tr + 2 * r + br) - (tl + 2 * l + bl);
      const dy = (bl + 2 * b + br) - (tl + 2 * t + tr);

      let nx = -dx * strength / 255.0;
      let ny = -dy * strength / 255.0;
      let nz = 1.0;

      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      nx /= len;
      ny /= len;
      nz /= len;

      const idx = (y * w + x) * 4;
      out[idx]     = Math.floor(((nx + 1) / 2) * 255);
      out[idx + 1] = Math.floor(((ny + 1) / 2) * 255);
      out[idx + 2] = Math.floor(((nz + 1) / 2) * 255);
      out[idx + 3] = 255;
    }
  }

  nCtx.putImageData(outImgData, 0, 0);
  return normalCanvas;
}
