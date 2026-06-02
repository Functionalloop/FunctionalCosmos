'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';

// ─── Shaders ────────────────────────────────────────────────
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    // View-space position for specular
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragmentShader = `
  uniform vec3 color1;
  uniform vec3 color2;
  uniform float time;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    // ── Pure smooth gradient pole-to-pole ───────────────────
    float t = smoothstep(0.0, 1.0, vUv.y);
    vec3 baseColor = mix(color1, color2, t);

    // ── Limb darkening — edges darker for strong 3D roundness ──
    float limb = max(dot(vViewDir, vNormal), 0.0);
    baseColor *= mix(0.25, 1.0, pow(limb, 0.5));

    // ── Fresnel rim glow ────────────────────────────────────
    float rim = 1.0 - limb;
    baseColor += color1 * pow(rim, 2.8) * 1.1;

    // ── Soft specular highlight ─────────────────────────────
    vec3 lightDir = normalize(vec3(-0.5, 0.9, 0.8));
    float spec = pow(max(dot(vNormal, normalize(lightDir + vViewDir)), 0.0), 32.0);
    baseColor += vec3(1.0, 0.96, 0.88) * spec * 0.4;

    gl_FragColor = vec4(baseColor, 1.0);
  }
`;

// ─── Color Stops per Section ─────────────────────────────────
// 6 sections → positions 0.0, 0.2, 0.4, 0.6, 0.8, 1.0
const STOPS = [
  { t: 0.0,  c1: new THREE.Color('#ea580c'), c2: new THREE.Color('#fed7aa') }, // Hero   – Fire
  { t: 0.2,  c1: new THREE.Color('#0d9488'), c2: new THREE.Color('#5eead4') }, // Projects – Teal
  { t: 0.4,  c1: new THREE.Color('#d97706'), c2: new THREE.Color('#fcd34d') }, // TechStack – Amber
  { t: 0.6,  c1: new THREE.Color('#0891b2'), c2: new THREE.Color('#a5f3fc') }, // Socials – Cyan
  { t: 0.8,  c1: new THREE.Color('#c2410c'), c2: new THREE.Color('#fdba74') }, // Academics – Orange
  { t: 1.0,  c1: new THREE.Color('#7c3aed'), c2: new THREE.Color('#d8b4fe') }, // Resume – Violet
];

// Per-section X positions: alternate right/left so sphere physically crosses screen
// Pushed further out so the big sphere sits firmly on each side edge
const SECTION_X = [3.5, -3.5, 3.5, -3.5, 3.5, -3.5];
const SPHERE_RADIUS = 3.6;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function getGradientColors(progress: number) {
  let lower = STOPS[0];
  let upper = STOPS[STOPS.length - 1];
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (progress >= STOPS[i].t && progress <= STOPS[i + 1].t) {
      lower = STOPS[i];
      upper = STOPS[i + 1];
      break;
    }
  }
  const range = upper.t - lower.t;
  const t = range === 0 ? 0 : (progress - lower.t) / range;
  const c1 = new THREE.Color().copy(lower.c1).lerp(upper.c1, t);
  const c2 = new THREE.Color().copy(lower.c2).lerp(upper.c2, t);
  return { c1, c2 };
}

function getTargetX(progress: number): number {
  // Map progress 0→1 across 6 sections
  const raw = progress * (SECTION_X.length - 1);
  const lo = Math.floor(raw);
  const hi = Math.min(lo + 1, SECTION_X.length - 1);
  const frac = raw - lo;
  // smooth step for snappier feel
  const smooth = frac * frac * (3 - 2 * frac);
  return lerp(SECTION_X[lo], SECTION_X[hi], smooth);
}

// ─── Animated Sphere ─────────────────────────────────────────
function AnimatedSphere({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useRef({
    color1: { value: new THREE.Color('#ea580c') },
    color2: { value: new THREE.Color('#fed7aa') },
    time:   { value: 0 },
  });

  // Current position — smoothly tracked each frame
  const currentX = useRef(SECTION_X[0]);

  useFrame((_, delta) => {
    const progress = scrollYProgress.get();

    if (meshRef.current) {
      // 1. Continuous self-spin (Y axis) → looks like a rotating planet
      meshRef.current.rotation.y += delta * 0.35;
      // 2. Slight tilt driven by scroll — adds drama
      meshRef.current.rotation.z = progress * Math.PI * 0.4;

      // 3. Horizontal traversal: ease towards target X per section
      const targetX = getTargetX(progress);
      currentX.current = lerp(currentX.current, targetX, delta * 2.0);
      meshRef.current.position.x = currentX.current;

      // 4. Gentle floating bob (Y)
      meshRef.current.position.y = Math.sin(Date.now() * 0.0007) * 0.18;
    }

    if (materialRef.current) {
      const { c1, c2 } = getGradientColors(progress);
      uniforms.current.color1.value.copy(c1);
      uniforms.current.color2.value.copy(c2);
      uniforms.current.time.value += delta;
    }
  });

  return (
    <Sphere ref={meshRef} args={[SPHERE_RADIUS, 128, 128]} position={[SECTION_X[0], 0, 0]}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
      />
    </Sphere>
  );
}

// ─── Starfield ───────────────────────────────────────────────
function Starfield({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y -= delta * 0.015;
      groupRef.current.rotation.x += delta * 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      <Stars radius={60} depth={60} count={3000} factor={4} saturation={0} fade speed={0.6} />
    </group>
  );
}

// ─── Rim Glow Halo (separate additive pass) ──────────────────
function SphereGlow({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef  = useRef<THREE.MeshBasicMaterial>(null);
  const currentX = useRef(SECTION_X[0]);

  useFrame((_, delta) => {
    const progress = scrollYProgress.get();
    const targetX = getTargetX(progress);
    currentX.current = lerp(currentX.current, targetX, delta * 2.0);
    if (meshRef.current) {
      meshRef.current.position.x = currentX.current;
      meshRef.current.position.y = Math.sin(Date.now() * 0.0007) * 0.18;
      meshRef.current.rotation.y += delta * 0.35;
    }
    if (matRef.current) {
      const { c1 } = getGradientColors(progress);
      matRef.current.color.copy(c1);
    }
  });

  return (
    <mesh ref={meshRef} position={[SECTION_X[0], 0, -0.3]}>
      <sphereGeometry args={[SPHERE_RADIUS + 0.5, 32, 32]} />
      <meshBasicMaterial ref={matRef} transparent opacity={0.1} color="#ea580c" side={THREE.BackSide} />
    </mesh>
  );
}

// ─── Main Export ─────────────────────────────────────────────
export default function ScrollCanvas3D({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: '#02080c' }}>
      {/* Camera pulled back to fit larger sphere; wider fov exposes more of the sides */}
      <Canvas camera={{ position: [0, 0, 9], fov: 55 }}>
        <ambientLight intensity={0.4} />
        {/* Directional light from top-left for specular feel */}
        <directionalLight position={[-3, 4, 5]} intensity={1.5} />
        <pointLight position={[5, 3, 3]} intensity={0.8} color="#fed7aa" />
        <Starfield scrollYProgress={scrollYProgress} />
        <SphereGlow scrollYProgress={scrollYProgress} />
        <AnimatedSphere scrollYProgress={scrollYProgress} />
      </Canvas>
      {/* Vignette to blend edges */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(2,8,12,0.85) 100%)' }} />
    </div>
  );
}
