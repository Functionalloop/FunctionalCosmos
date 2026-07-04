'use client';

/**
 * Satellite.tsx
 * ─────────────
 * ISS-style satellite loaded from /assets/satellite.glb.
 *
 * Realistic space appearance:
 *  - Strong directional "sunlight" from one side (harsh, no diffuse scatter in space)
 *  - Near-zero ambient (space is dark)
 *  - Material overrides keyed to exact material names from the GLB:
 *      shiny_panel / ecostress → dark blue photovoltaic cells
 *      foil_silver → gold mylar thermal insulation
 *      olive / base_metal → warm anodised aluminium
 *      white / ecostressWhite → bright white radiator panels
 *      plastic black / ISS_01_dark → matte black thermal protection
 *      ISS_*_dull / ISS_AO_* → brushed white aluminium modules
 *
 * Model raw size: ~75 units long → scale 0.038 ≈ 2.85 scene units
 */

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_PATH = '/assets/satellite.glb';
const ORBIT_RADIUS = 21;
const ORBIT_SPEED = 0.045;
const ORBIT_HEIGHT = 8;
const MODEL_SCALE = 0.053;

useGLTF.preload(MODEL_PATH);

// ── Exact material name → realistic override ───────────────────────────────
// Colors from NASA ISS photography references:
//   Body modules  : off-white aluminium  #d8dde0
//   Solar panels  : dark navy blue       #1a2744  with subtle gold backing
//   MLI foil      : gold mylar           #c8a84b  high metalness
//   Radiators     : bright white         #f0f4f6
//   Dark tiles    : matte black thermal  #111316
//   Olive/anodised: warm grey-green alu  #9a9a7a

interface MatOverride {
  color?: string;
  emissive?: string;
  emissiveIntensity?: number;
  metalness?: number;
  roughness?: number;
}

// Keyed by EXACT material name or substring match prefix
const MAT_RULES: Array<{ match: (name: string) => boolean; override: MatOverride }> = [
  // ── Solar panels — dark blue photovoltaic cells ──────────────────────────
  {
    match: (n) => n === 'shiny_panel',
    override: {
      color: '#16263f',
      emissive: '#1e3a5f',
      emissiveIntensity: 0.08,
      metalness: 0.15,
      roughness: 0.55,
    },
  },
  // Ecostress panels (same appearance) 
  {
    match: (n) => n.startsWith('ecostress') && !n.includes('white') && !n.includes('metal') && !n.includes('dexter'),
    override: {
      color: '#16263f',
      emissive: '#1e3a5f',
      emissiveIntensity: 0.06,
      metalness: 0.10,
      roughness: 0.60,
    },
  },
  // ── Multi-layer insulation foil — gold mylar ─────────────────────────────
  {
    match: (n) => n === 'foil_silver',
    override: {
      color: '#b8892e',
      emissive: '#5a3d08',
      emissiveIntensity: 0.12,
      metalness: 0.92,
      roughness: 0.20,
    },
  },
  // ── Olive / anodised aluminium structure ─────────────────────────────────
  {
    match: (n) => n === 'olive *',
    override: {
      color: '#8c8c70',
      metalness: 0.80,
      roughness: 0.45,
    },
  },
  {
    match: (n) => n === 'base_metal',
    override: {
      color: '#7a7a5c',
      metalness: 0.85,
      roughness: 0.55,
    },
  },
  // ── White radiator panels ─────────────────────────────────────────────────
  {
    match: (n) => n === 'white',
    override: {
      color: '#dde6ea',
      metalness: 0.0,
      roughness: 0.88,
    },
  },
  {
    match: (n) => n === 'ecostressWhite',
    override: {
      color: '#e8f0f4',
      metalness: 0.0,
      roughness: 0.82,
    },
  },
  // ── Matte black thermal protection tiles ─────────────────────────────────
  {
    match: (n) => n === 'plastic black',
    override: {
      color: '#141618',
      metalness: 0.0,
      roughness: 0.92,
    },
  },
  {
    match: (n) => n.endsWith('dark *'),
    override: {
      color: '#1c1e22',
      metalness: 0.0,
      roughness: 0.85,
    },
  },
  // ── ISS module body (white/grey aluminium) ───────────────────────────────
  // ISS_0X_dull, ISS_AO_*, ISS_03_shiny_n, ecostress_dexter, ecostress metal
  {
    match: (n) =>
      n.startsWith('iss') ||
      n.startsWith('ISS') ||
      n === 'ecostress_dexter' ||
      n === 'ecostress metal',
    override: {
      // Keep original texture; boost metalness for aluminium look
      metalness: 0.55,
      roughness: 0.48,
    },
  },
];

function applyOverride(mat: THREE.MeshStandardMaterial, ov: MatOverride) {
  if (ov.color != null) mat.color.set(ov.color);
  if (ov.emissive != null) mat.emissive.set(ov.emissive);
  if (ov.emissiveIntensity != null) mat.emissiveIntensity = ov.emissiveIntensity;
  if (ov.metalness != null) mat.metalness = ov.metalness;
  if (ov.roughness != null) mat.roughness = ov.roughness;
  mat.needsUpdate = true;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Satellite() {
  const groupRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH);

  // Clone so we don't mutate the cached scene
  const cloned = scene.clone(true);

  useEffect(() => {
    cloned.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;

      // Enable shadows on every mesh
      obj.castShadow = true;
      obj.receiveShadow = true;

      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((mat) => {
        if (!(mat instanceof THREE.MeshStandardMaterial)) return;
        const name = (mat.name || '').toLowerCase().trim();

        for (const rule of MAT_RULES) {
          if (rule.match(name) || rule.match(mat.name || '')) {
            applyOverride(mat, rule.override);
            break;   // first matching rule wins
          }
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.position.set(
        ORBIT_RADIUS * Math.cos(t * ORBIT_SPEED),
        ORBIT_HEIGHT,
        ORBIT_RADIUS * Math.sin(t * ORBIT_SPEED),
      );
      // Face direction of travel
      groupRef.current.rotation.y = -t * ORBIT_SPEED + Math.PI / 2;
    }

    // Very gentle long-period wobble
    if (modelRef.current) {
      modelRef.current.rotation.x = Math.sin(t * 0.22) * 0.04;
      modelRef.current.rotation.z = Math.cos(t * 0.17) * 0.03;
    }
  });

  return (
    <group ref={groupRef}>

      {/**
       * ── Lighting: simulates sun in space ────────────────────────────────
       * One hard directional "sun" from top-right + tiny fill to keep
       * the dark side from being completely black (earthshine simulation).
       */}
      {/* Primary sun — warm white, strong, hard shadows */}
      <directionalLight
        color="#fff8e7"
        intensity={4.5}
        position={[6, 5, -4]}
        castShadow
      />
      {/* Earthshine fill — very dim, blue-tinted, from below */}
      <directionalLight
        color="#4a7ab5"
        intensity={0.25}
        position={[-3, -4, 3]}
      />

      <group
        ref={modelRef}
        scale={[MODEL_SCALE, MODEL_SCALE, MODEL_SCALE]}
        position={[0, -3.5 * MODEL_SCALE, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <primitive object={cloned} />
      </group>
    </group>
  );
}
