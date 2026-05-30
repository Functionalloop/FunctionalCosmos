'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, Float, Billboard, Text, Trail, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useStore, PlanetType } from '../store/useStore';
import { PLANETS_CONFIG, PlanetConfig } from '../utils/celestialData';
import { audioManager } from '../utils/audio';

// --- Orbit Path Ring Component (Dashed, animated) ---
function OrbitLine({ radius, color }: { radius: number; color: string }) {
  const lineRef = useRef<THREE.Line>(null);

  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 128; i++) {
      const theta = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(radius * Math.cos(theta), 0, radius * Math.sin(theta)));
    }
    return pts;
  }, [radius]);

  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  const orbitLine = useMemo(() => {
    const material = new THREE.LineDashedMaterial({
      color: new THREE.Color(color),
      opacity: 0.2,
      transparent: true,
      dashSize: 0.8,
      gapSize: 0.4,
    });
    const line = new THREE.Line(lineGeometry, material);
    line.computeLineDistances();
    return line;
  }, [lineGeometry, color]);

  useFrame((state, delta) => {
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.LineDashedMaterial;
      material.dashOffset -= delta * 0.4;
    }
  });

  return <primitive ref={lineRef} object={orbitLine} />;
}

// --- Particle Solar Wind System ---
function SolarWind() {
  const count = 400;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 8;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        const x = pos[i * 3];
        const y = pos[i * 3 + 1];
        const z = pos[i * 3 + 2];
        const r = Math.sqrt(x*x + y*y + z*z);
        
        const speed = delta * (1.5 + (i % 2));
        if (r > 16) {
          const newR = 4.5;
          const theta = Math.random() * 2 * Math.PI;
          const phi = Math.acos(2 * Math.random() - 1);
          pos[i * 3] = newR * Math.sin(phi) * Math.cos(theta);
          pos[i * 3 + 1] = newR * Math.sin(phi) * Math.sin(theta);
          pos[i * 3 + 2] = newR * Math.cos(phi);
        } else {
          pos[i * 3] = x + (x/r) * speed;
          pos[i * 3 + 1] = y + (y/r) * speed;
          pos[i * 3 + 2] = z + (z/r) * speed;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.rotation.y += delta * 0.1;
      pointsRef.current.rotation.z += delta * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.12} color="#fde68a" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

// --- Sun Component (Redesigned with procedural surface, prominences, and corona) ---
function Sun() {
  const coreRef = useRef<THREE.Mesh>(null);
  const chromoRef = useRef<THREE.Mesh>(null);
  const corona1Ref = useRef<THREE.Mesh>(null);
  const corona2Ref = useRef<THREE.Mesh>(null);
  const corona3Ref = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const prominence1Ref = useRef<THREE.Mesh>(null);
  const prominence2Ref = useRef<THREE.Mesh>(null);
  const prominence3Ref = useRef<THREE.Mesh>(null);

  // Procedural animated sun surface shader
  const sunMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        colorA: { value: new THREE.Color('#fff7c0') },
        colorB: { value: new THREE.Color('#fb923c') },
        colorC: { value: new THREE.Color('#ea580c') },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 colorA;
        uniform vec3 colorB;
        uniform vec3 colorC;
        varying vec2 vUv;
        varying vec3 vNormal;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i), hash(i + vec2(1,0)), f.x),
            mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
            f.y
          );
        }
        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          for(int i = 0; i < 5; i++) {
            v += a * noise(p);
            p *= 2.0;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec2 uv = vUv;
          float t = time * 0.12;
          float n = fbm(uv * 4.0 + vec2(t, t * 0.7));
          float n2 = fbm(uv * 8.0 - vec2(t * 1.3, t * 0.5));
          float n3 = fbm(uv * 2.0 + vec2(t * 0.4, -t * 0.9));
          float turbulence = n * 0.5 + n2 * 0.3 + n3 * 0.2;

          // Limb darkening
          float limb = dot(vNormal, vec3(0.0, 0.0, 1.0));
          limb = clamp(limb, 0.0, 1.0);
          float dark = pow(limb, 0.4);

          vec3 col = mix(colorC, colorB, turbulence);
          col = mix(col, colorA, turbulence * turbulence * dark);
          col *= (0.7 + 0.3 * dark);

          // Bright granule hotspots
          float spots = step(0.72, fbm(uv * 12.0 + vec2(t * 2.0, 0.0)));
          col += vec3(0.3, 0.15, 0.0) * spots * dark;

          gl_FragColor = vec4(col, 1.0);
        }
      `,
      toneMapped: false,
    });
  }, []);

  const flareTime = useRef(0);
  const isFlaring = useRef(false);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    sunMaterial.uniforms.time.value = time;
    
    const audioPulse = audioManager.getFrequencyData() * 0.25;

    if (Math.random() < 0.0005 && !isFlaring.current) {
      isFlaring.current = true;
      flareTime.current = time;
    }
    let flareScale = 1.0;
    if (isFlaring.current) {
      const elapsed = time - flareTime.current;
      if (elapsed < 4) {
        flareScale = 1.0 + Math.sin((elapsed / 4) * Math.PI) * 0.5;
      } else {
        isFlaring.current = false;
      }
    }

    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.06;
      coreRef.current.rotation.x = Math.sin(time * 0.025) * 0.08;
    }
    if (chromoRef.current) {
      chromoRef.current.rotation.y = time * -0.04;
      const s = 1 + Math.sin(time * 1.8) * 0.015 + audioPulse;
      chromoRef.current.scale.setScalar(s);
    }
    if (corona1Ref.current) {
      corona1Ref.current.rotation.z = time * 0.025;
      const s = 1 + Math.sin(time * 1.1) * 0.04 + audioPulse * 1.2;
      corona1Ref.current.scale.setScalar(s);
    }
    if (corona2Ref.current) {
      corona2Ref.current.rotation.z = time * -0.018;
      const s = 1 + Math.sin(time * 0.7 + 1.5) * 0.05 + audioPulse * 1.5;
      corona2Ref.current.scale.setScalar(s);
    }
    if (corona3Ref.current) {
      corona3Ref.current.rotation.z = time * 0.012;
      const s = 1 + Math.sin(time * 0.5 + 3.0) * 0.06 + audioPulse * 2.0;
      corona3Ref.current.scale.setScalar(s);
    }
    if (glowRef.current) {
      const s = 1 + Math.sin(time * 0.4) * 0.03 + audioPulse * 2.5;
      glowRef.current.scale.setScalar(s);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.05 + Math.sin(time * 0.9) * 0.02 + audioPulse * 0.1;
    }
    // Rotate prominences independently
    if (prominence1Ref.current) {
      prominence1Ref.current.rotation.z = time * 0.22;
      prominence1Ref.current.scale.setScalar(flareScale);
      (prominence1Ref.current.material as THREE.MeshBasicMaterial).color.set(isFlaring.current ? "#ffedd5" : "#f97316");
    }
    if (prominence2Ref.current) {
      prominence2Ref.current.rotation.z = time * -0.15 + 2.1;
    }
    if (prominence3Ref.current) {
      prominence3Ref.current.rotation.z = time * 0.18 + 4.2;
    }
  });

  return (
    <group>
      {/* Ambient point light from the sun */}
      <pointLight color="#ffedd5" intensity={3.5} distance={120} decay={1.8} />

      {/* Inner Core — Procedural animated surface */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[3.75, 128, 128]} />
        <primitive object={sunMaterial} attach="material" />
      </mesh>

      {/* Chromosphere — thin hot shell just outside core */}
      <mesh ref={chromoRef}>
        <sphereGeometry args={[3.9, 64, 64]} />
        <meshBasicMaterial
          color="#fde68a"
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Solar Prominences — spiky elongated ellipsoids orbiting the surface */}
      <mesh ref={prominence1Ref} position={[0, 0, 0]}>
        <sphereGeometry args={[4.3, 16, 8]} />
        <meshBasicMaterial
          color="#f97316"
          transparent
          opacity={0.13}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          wireframe={false}
        />
      </mesh>
      <mesh ref={prominence2Ref} position={[0, 0, 0]} rotation={[0.8, 0, 0]}>
        <sphereGeometry args={[4.55, 12, 6]} />
        <meshBasicMaterial
          color="#fb923c"
          transparent
          opacity={0.09}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={prominence3Ref} position={[0, 0, 0]} rotation={[0, 0.5, 1.2]}>
        <sphereGeometry args={[4.2, 10, 5]} />
        <meshBasicMaterial
          color="#fed7aa"
          transparent
          opacity={0.07}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Corona Ring 1 — tight, bright amber */}
      <mesh ref={corona1Ref}>
        <sphereGeometry args={[4.7, 48, 48]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Corona Ring 2 — mid warm orange */}
      <mesh ref={corona2Ref}>
        <sphereGeometry args={[5.6, 32, 32]} />
        <meshBasicMaterial
          color="#fb923c"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Corona Ring 3 — outer pale bloom */}
      <mesh ref={corona3Ref}>
        <sphereGeometry args={[6.8, 24, 24]} />
        <meshBasicMaterial
          color="#ffedd5"
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer vast halo — very faint, large breathing glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[9.5, 16, 16]} />
        <meshBasicMaterial
          color="#fff7ed"
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Particle Solar Wind Trail */}
      <SolarWind />
    </group>
  );
}

// --- Moon Component (Enhanced with glowing aura) ---
interface MoonProps {
  name: string;
  slug: string;
  orbitRadius: number;
  orbitSpeed: number;
  color: string;
  parentPos: [number, number, number];
  onSelect: () => void;
  isActive: boolean;
  planetSize: number;
}

function Moon({ name, slug, orbitRadius, orbitSpeed, color, parentPos, onSelect, isActive, planetSize }: MoonProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const angle = time * orbitSpeed;
      const lx = orbitRadius * Math.cos(angle);
      const lz = orbitRadius * Math.sin(angle);
      
      meshRef.current.position.set(lx, 0, lz);
      meshRef.current.rotation.y = time * 0.5;
    }
    if (glowRef.current) {
      const time = state.clock.getElapsedTime();
      const pulseScale = 1 + Math.sin(time * 3 + orbitRadius) * 0.15;
      glowRef.current.scale.setScalar(pulseScale);
    }
  });

  return (
    <group>
      <Trail
        width={isActive ? 1.5 : 0.8}
        color={new THREE.Color(color)}
        length={isActive ? 6 : 3}
        decay={1.5}
        local={false}
        stride={0}
        interval={1}
      >
        <mesh ref={meshRef} onClick={(e) => {
          e.stopPropagation();
          audioManager.playClick();
          onSelect();
        }}>
          <sphereGeometry args={[0.18 * Math.max(1, planetSize * 0.6), 24, 24]} />
          <meshStandardMaterial 
            color={isActive ? "#ffffff" : color} 
            emissive={isActive ? "#ffffff" : color} 
            emissiveIntensity={isActive ? 2.5 : 1.0}
            roughness={0.15}
            metalness={0.85}
          />
          
          {/* Glow Layer */}
          <mesh ref={glowRef}>
            <sphereGeometry args={[0.24 * Math.max(1, planetSize * 0.6), 24, 24]} />
            <meshBasicMaterial color={color} transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>

          {/* Moon Label */}
          <Html distanceFactor={6} position={[0, 0.4, 0]} center zIndexRange={[100, 0]}>
            <div 
              className="pointer-events-none select-none transition-all duration-300 flex flex-col items-center"
              style={{ opacity: isActive ? 1 : 0.85 }}
            >
              <span 
                className={`font-cormorant tracking-widest uppercase whitespace-nowrap ${
                  isActive ? 'text-[#f0fdfa] text-sm font-bold' : 'text-teal-50/70 text-xs'
                }`}
                style={{ textShadow: `0 0 10px ${color}, 0 2px 4px rgba(0,0,0,0.8)` }}
              >
                {name}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 animate-pulse" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
              )}
            </div>
          </Html>
        </mesh>
      </Trail>
    </group>
  );
}

// --- Per-planet shader materials ---
function usePlanetMaterial(type: string, color: string) {
  return useMemo(() => {
    // Shared helpers embedded in each shader
    const hashFn = `
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
      float noise(vec2 p) {
        vec2 i=floor(p); vec2 f=fract(p); f=f*f*(3.0-2.0*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
      }
      float fbm(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<4;i++){v+=a*noise(p);p*=2.0;a*=0.5;} return v; }
    `;

    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
    `;

    if (type === 'projects') {
      // Teal lava world — lava crack texture, teal (#2dd4bf) palette
      return new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader,
        fragmentShader: `
          ${hashFn}
          uniform float time;
          varying vec2 vUv; varying vec3 vNormal;
          void main() {
            float t = time * 0.1;
            float cracks = fbm(vUv * 8.0 + t);
            float lava = fbm(vUv * 3.0 - t * 0.4);
            float hot = step(0.6, cracks);
            float limb = pow(clamp(dot(vNormal,vec3(0,0,1)),0.0,1.0),0.4);
            vec3 rock = mix(vec3(0.12,0.32,0.30), vec3(0.25,0.52,0.48), lava);
            vec3 glow = mix(vec3(0.35,0.85,0.80), vec3(0.65,1.00,0.96), cracks);
            vec3 col = mix(rock, glow, hot * 0.8);
            col += vec3(0.1,0.50,0.46) * (1.0 - limb) * 0.45;
            col *= (0.75 + 0.25*limb);
            gl_FragColor = vec4(col, 1.0);
          }
        `,
        toneMapped: false,
      });
    }


    if (type === 'tech_stack') {
      // Amber lava world — glowing magma cracks (lighter golden-amber palette)
      return new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader,
        fragmentShader: `
          ${hashFn}
          uniform float time;
          varying vec2 vUv; varying vec3 vNormal;
          void main() {
            float t = time * 0.1;
            float cracks = fbm(vUv * 8.0 + t);
            float lava = fbm(vUv * 3.0 - t * 0.4);
            float hot = step(0.6, cracks);
            float limb = pow(clamp(dot(vNormal,vec3(0,0,1)),0.0,1.0),0.4);
            vec3 rock = mix(vec3(0.38,0.24,0.10), vec3(0.58,0.38,0.18), lava);
            vec3 glow = mix(vec3(0.95,0.60,0.15), vec3(1.0,0.92,0.40), cracks);
            vec3 col = mix(rock, glow, hot * 0.8);
            col += vec3(0.5,0.25,0.05) * (1.0 - limb) * 0.4; // rim glow
            col *= (0.75 + 0.25*limb);
            gl_FragColor = vec4(col, 1.0);
          }
        `,
        toneMapped: false,
      });
    }

    if (type === 'academics') {
      // Orange-red lava world — lava crack texture, orange (#ea580c) palette
      return new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader,
        fragmentShader: `
          ${hashFn}
          uniform float time;
          varying vec2 vUv; varying vec3 vNormal;
          void main() {
            float t = time * 0.1;
            float cracks = fbm(vUv * 8.0 + t);
            float lava = fbm(vUv * 3.0 - t * 0.4);
            float hot = step(0.6, cracks);
            float limb = pow(clamp(dot(vNormal,vec3(0,0,1)),0.0,1.0),0.4);
            vec3 rock = mix(vec3(0.42,0.20,0.10), vec3(0.62,0.32,0.16), lava);
            vec3 glow = mix(vec3(0.96,0.45,0.15), vec3(1.0,0.78,0.45), cracks);
            vec3 col = mix(rock, glow, hot * 0.8);
            col += vec3(0.55,0.22,0.05) * (1.0 - limb) * 0.45;
            col *= (0.75 + 0.25*limb);
            gl_FragColor = vec4(col, 1.0);
          }
        `,
        toneMapped: false,
      });
    }

    if (type === 'socials') {
      // Cyan lava world — (#67e8f9) electric cyan palette
      return new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader,
        fragmentShader: `
          ${hashFn}
          uniform float time;
          varying vec2 vUv; varying vec3 vNormal;
          void main() {
            float t = time * 0.1;
            float cracks = fbm(vUv * 8.0 + t);
            float lava = fbm(vUv * 3.0 - t * 0.4);
            float hot = step(0.6, cracks);
            float limb = pow(clamp(dot(vNormal,vec3(0,0,1)),0.0,1.0),0.4);
            vec3 rock = mix(vec3(0.18,0.32,0.48), vec3(0.32,0.52,0.72), lava);
            vec3 glow = mix(vec3(0.40,0.85,0.96), vec3(0.80,0.98,1.00), cracks);
            vec3 col = mix(rock, glow, hot * 0.8);
            col += vec3(0.15,0.48,0.72) * (1.0 - limb) * 0.45;
            col *= (0.75 + 0.25*limb);
            gl_FragColor = vec4(col, 1.0);
          }
        `,
        toneMapped: false,
      });
    }

    if (type === 'resume') {
      // Violet lava world — (#a78bfa) deep purple palette
      return new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader,
        fragmentShader: `
          ${hashFn}
          uniform float time;
          varying vec2 vUv; varying vec3 vNormal;
          void main() {
            float t = time * 0.1;
            float cracks = fbm(vUv * 8.0 + t);
            float lava = fbm(vUv * 3.0 - t * 0.4);
            float hot = step(0.6, cracks);
            float limb = pow(clamp(dot(vNormal,vec3(0,0,1)),0.0,1.0),0.4);
            vec3 rock = mix(vec3(0.28,0.20,0.42), vec3(0.46,0.32,0.65), lava);
            vec3 glow = mix(vec3(0.65,0.48,0.96), vec3(0.88,0.75,1.00), cracks);
            vec3 col = mix(rock, glow, hot * 0.8);
            col += vec3(0.45,0.20,0.75) * (1.0 - limb) * 0.45;
            col *= (0.75 + 0.25*limb);
            gl_FragColor = vec4(col, 1.0);
          }
        `,
        toneMapped: false,
      });
    }

    // Fallback
    return new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.5 });
  }, [type, color]);
}

function useFresnelMaterial(color: string) {
  return useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(color) },
        time: { value: 0 },
        hoverOpacity: { value: 0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float time;
        uniform float hoverOpacity;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);
          float rim = 1.0 - max(dot(viewDir, normal), 0.0);
          rim = smoothstep(0.3, 1.0, rim);
          float pulse = 1.0 + sin(time * 1.5) * 0.15;
          gl_FragColor = vec4(color, rim * pulse * (0.5 + hoverOpacity));
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [color]);
}

function Shockwave({ color, onComplete, size }: { color: string, onComplete: () => void, size: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.scale.addScalar(delta * 18);
      const mat = ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity -= delta * 1.8;
      if (mat.opacity <= 0) onComplete();
    }
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[size, size + 0.1, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

// --- Planet Component (Fully redesigned with per-type shader materials) ---
interface PlanetProps {
  config: PlanetConfig;
}

function Planet({ config }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const atmosphere2Ref = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  
  const [isHovered, setIsHovered] = useState(false);
  const [shockwaves, setShockwaves] = useState<{ id: number }[]>([]);

  const activePlanet = useStore((state) => state.activePlanet);
  const activeMoon = useStore((state) => state.activeMoon);
  const currentState = useStore((state) => state.currentState);
  const setPlanet = useStore((state) => state.setPlanet);
  const selectMoon = useStore((state) => state.selectMoon);
  const setViewState = useStore((state) => state.setViewState);

  const projects = useStore((state) => state.projects);
  const techStack = useStore((state) => state.techStack);
  const academics = useStore((state) => state.academics);
  const socials = useStore((state) => state.socials);
  const resumeExperience = useStore((state) => state.resumeExperience);
  const resumeSkills = useStore((state) => state.resumeSkills);
  const resumeEducation = useStore((state) => state.resumeEducation);
  const resumeCertifications = useStore((state) => state.resumeCertifications);

  const isSelected = activePlanet === config.type;
  const planetMaterial = usePlanetMaterial(config.type, config.color);
  const fresnelMaterial = useFresnelMaterial(config.color);

  // Imperatively assign material to ensure shader is applied on all planets
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.material = planetMaterial;
      planetMaterial.needsUpdate = true;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.material = fresnelMaterial;
      fresnelMaterial.needsUpdate = true;
    }
  }, [planetMaterial, fresnelMaterial]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Update shader time uniform
    if ((planetMaterial as THREE.ShaderMaterial).uniforms?.time) {
      (planetMaterial as THREE.ShaderMaterial).uniforms.time.value = time;
    }

    if (meshRef.current) {
      const theta = time * config.speed;
      const px = config.radius * Math.cos(theta);
      const pz = config.radius * Math.sin(theta);
      meshRef.current.position.set(px, 0, pz);
      meshRef.current.rotation.y = time * 0.3;
    }
    if (atmosphereRef.current) {
      const mat = atmosphereRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms) {
        mat.uniforms.time.value = time;
        // Smoothly animate hover opacity
        mat.uniforms.hoverOpacity.value = THREE.MathUtils.lerp(mat.uniforms.hoverOpacity.value, isHovered ? 1.0 : 0.0, 0.1);
      }
    }
    if (atmosphereRef.current) {
      const pulse = 1 + Math.sin(time * 1.2) * 0.02;
      atmosphereRef.current.scale.setScalar(pulse);
    }
    if (atmosphere2Ref.current) {
      const pulse2 = 1 + Math.sin(time * 0.7 + 1.0) * 0.035;
      atmosphere2Ref.current.scale.setScalar(pulse2);
      (atmosphere2Ref.current.material as THREE.MeshBasicMaterial).opacity =
        (isSelected ? 0.12 : 0.04) + Math.sin(time * 0.9) * 0.02;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2.2 + Math.sin(time * 0.4) * 0.05;
      ringRef.current.rotation.z = time * 0.15;
    }
  });

  // Moon data
  const moonsData = useMemo(() => {
    const sz = config.size;
    if (config.type === 'projects') {
      return projects.map((p, index) => ({
        name: p.title, slug: p.slug,
        orbitRadius: sz + 0.6 + index * (0.35 * sz),
        orbitSpeed: (0.9 - index * 0.15) / Math.max(1, sz * 0.5),
      }));
    }
    if (config.type === 'tech_stack') {
      const categories = Array.from(new Set(techStack.map(t => t.category)));
      return categories.slice(0, 4).map((cat, index) => ({
        name: cat, slug: cat.toLowerCase(),
        orbitRadius: sz + 0.5 + index * (0.3 * sz),
        orbitSpeed: (0.8 - index * 0.12) / Math.max(1, sz * 0.5),
      }));
    }
    if (config.type === 'academics') {
      return academics.map((a, index) => ({
        name: a.degree.split(' ').slice(-2).join(' ') || a.institution.split(' ')[0],
        slug: `acad-${a.id}`,
        orbitRadius: sz + 0.4 + index * (0.4 * sz),
        orbitSpeed: (0.7 - index * 0.1) / Math.max(1, sz * 0.5),
      }));
    }
    if (config.type === 'socials') {
      return socials.slice(0, 4).map((s, index) => ({
        name: s.platform, slug: s.platform.toLowerCase(),
        orbitRadius: sz + 0.4 + index * (0.25 * sz),
        orbitSpeed: (1.1 - index * 0.15) / Math.max(1, sz * 0.5),
      }));
    }
    if (config.type === 'resume') {
      const sections = [
        { name: 'Experience', slug: 'resume-experience', available: resumeExperience.length > 0 },
        { name: 'Skills', slug: 'resume-skills', available: resumeSkills.length > 0 },
        { name: 'Education', slug: 'resume-education', available: resumeEducation.length > 0 },
        { name: 'Certifications', slug: 'resume-certifications', available: resumeCertifications.length > 0 },
      ];
      return sections.map((sec, index) => ({
        name: sec.name, slug: sec.slug,
        orbitRadius: sz + 0.5 + index * (0.32 * sz),
        orbitSpeed: (0.85 - index * 0.12) / Math.max(1, sz * 0.5),
      }));
    }
    return [];
  }, [config.type, projects, techStack, academics, socials, resumeExperience, resumeSkills, resumeEducation, resumeCertifications]);

  const handlePlanetClick = (e: any) => {
    e.stopPropagation();
    audioManager.playClick();
    setShockwaves(prev => [...prev, { id: Date.now() }]);
    if (!isSelected) {
      setPlanet(config.type);
    } else {
      if (currentState === 1) setViewState(2);
      else if (currentState === 2) setViewState(3);
      else setViewState(1);
    }
  };

  const currentPosTuple = (): [number, number, number] => {
    if (meshRef.current) {
      return [meshRef.current.position.x, meshRef.current.position.y, meshRef.current.position.z];
    }
    return [0, 0, 0];
  };

  return (
    <>
      <OrbitLine radius={config.radius} color={config.color} />

      <mesh 
        ref={meshRef} 
        onClick={handlePlanetClick} 
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        material={planetMaterial}
      >
        {/* Planet geometry */}
        <sphereGeometry args={[config.size, 96, 96]} />

        {shockwaves.map(wave => (
          <Shockwave 
            key={wave.id} 
            color={config.color} 
            size={config.size} 
            onComplete={() => setShockwaves(prev => prev.filter(w => w.id !== wave.id))} 
          />
        ))}

      {/* Inner atmosphere glow (Fresnel) */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[config.size * 1.05, 48, 48]} />
      </mesh>

      {/* Outer atmosphere haze */}
      <mesh ref={atmosphere2Ref}>
        <sphereGeometry args={[config.size * 1.18, 32, 32]} />
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={isSelected ? 0.12 : 0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

        {/* Selection Rings */}
        {isSelected && (
          <group ref={ringRef} rotation={[Math.PI / 2.2, 0, 0]}>
            <mesh>
              <ringGeometry args={[config.size * 1.25, config.size * 1.5, 80]} />
              <meshBasicMaterial color={config.color} transparent opacity={0.35}
                blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
            </mesh>
            <mesh>
              <ringGeometry args={[config.size * 1.55, config.size * 1.75, 80]} />
              <meshBasicMaterial color={config.color} transparent opacity={0.2}
                blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
            </mesh>
            <mesh>
              <ringGeometry args={[config.size * 1.8, config.size * 2.0, 80]} />
              <meshBasicMaterial color={config.color} transparent opacity={0.1}
                blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
            </mesh>
            <mesh>
              <torusGeometry args={[config.size * 1.5, 0.008, 8, 100]} />
              <meshBasicMaterial color="#f0fdfa" transparent opacity={0.6}
                blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
            <mesh>
              <torusGeometry args={[config.size * 2.0, 0.005, 8, 100]} />
              <meshBasicMaterial color={config.color} transparent opacity={0.3}
                blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
          </group>
        )}

        {/* Planet Label */}
        <Html distanceFactor={12} position={[0, config.size + 0.5, 0]} center zIndexRange={[100, 0]}>
          <div
            onClick={handlePlanetClick}
            className={`cursor-pointer select-none transition-all duration-500 flex flex-col items-center ${
              isSelected ? 'scale-110' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <span
              className={`font-cinzel tracking-[0.2em] uppercase whitespace-nowrap ${
                isSelected ? 'text-[#f0fdfa] font-bold' : 'text-teal-100/80'
              }`}
              style={{
                fontSize: `${Math.max(0.7, config.size * 0.8)}rem`,
                textShadow: `0 0 15px ${config.color}, 0 2px 8px rgba(0,0,0,0.9)`,
              }}
            >
              {config.name}
            </span>
            <div
              className={`transition-all duration-500 h-[1px] w-full mt-1 ${isSelected ? 'opacity-100' : 'opacity-0'}`}
              style={{ background: `linear-gradient(90deg, transparent, ${config.color}, transparent)` }}
            />
          </div>
        </Html>

        {/* Moons */}
        {isSelected && currentState >= 1 && moonsData.map((moon) => (
          <Moon
            key={moon.slug}
            name={moon.name}
            slug={moon.slug}
            orbitRadius={moon.orbitRadius}
            orbitSpeed={moon.orbitSpeed}
            color={config.color}
            parentPos={currentPosTuple()}
            onSelect={() => selectMoon(moon.slug)}
            isActive={activeMoon === moon.slug}
            planetSize={config.size}
          />
        ))}
      </mesh>
    </>
  );
}


// --- Galaxy Nebula (Glowing cosmic gas / galaxy types) ---
function GalaxyNebula() {
  return (
    <group>
      {/* Distant Teal Nebula */}
      <Sparkles 
        count={800} 
        scale={60} 
        size={8} 
        speed={0.2} 
        opacity={0.15} 
        color="#5eead4" 
        position={[-30, 10, -40]} 
      />
      {/* Warm Amber Nebula */}
      <Sparkles 
        count={600} 
        scale={45} 
        size={10} 
        speed={0.1} 
        opacity={0.15} 
        color="#fb923c" 
        position={[30, -5, -20]} 
      />
      {/* Deep Purple Core Dust */}
      <Sparkles 
        count={500} 
        scale={30} 
        size={6} 
        speed={0.3} 
        opacity={0.2} 
        color="#c084fc" 
        position={[0, -10, -10]} 
      />
    </group>
  );
}

// --- Asteroid Belt (Debris Field) ---
function AsteroidBelt() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 1200;
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  useEffect(() => {
    if (!meshRef.current) return;
    
    for (let i = 0; i < count; i++) {
      // Create a wide debris ring between radius 23 and 29 (between TechStack and Socials)
      const radius = 23 + Math.random() * 6; 
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 1.5;
      
      dummy.position.set(radius * Math.cos(theta), y, radius * Math.sin(theta));
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const scale = Math.random() * 0.12 + 0.03; // Tiny to medium debris
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy, count]);

  useFrame((state) => {
    if (meshRef.current) {
      // Slowly rotate the entire asteroid belt
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.015;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial 
        color="#a8a29e" 
        roughness={0.9} 
        metalness={0.2} 
        emissive="#333333" 
        emissiveIntensity={0.2} 
      />
    </instancedMesh>
  );
}

// --- Main Celestial System Component ---
export default function CelestialSystem() {
  return (
    <group>
      <Sun />
      <GalaxyNebula />
      <AsteroidBelt />
      
      <Planet config={PLANETS_CONFIG.projects} />
      <Planet config={PLANETS_CONFIG.tech_stack} />
      <Planet config={PLANETS_CONFIG.socials} />
      <Planet config={PLANETS_CONFIG.academics} />
      <Planet config={PLANETS_CONFIG.resume} />
    </group>
  );
}
