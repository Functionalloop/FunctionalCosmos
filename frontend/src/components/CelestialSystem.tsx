'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
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

  return <primitive ref={lineRef} object={orbitLine} />;
}

// --- Sun Component (Enhanced with pulsating multi-layer corona) ---
function Sun() {
  const coreRef = useRef<THREE.Mesh>(null);
  const corona1Ref = useRef<THREE.Mesh>(null);
  const corona2Ref = useRef<THREE.Mesh>(null);
  const corona3Ref = useRef<THREE.Mesh>(null);
  const flareRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.08;
      coreRef.current.rotation.x = Math.sin(time * 0.03) * 0.1;
    }
    if (corona1Ref.current) {
      corona1Ref.current.rotation.y = time * -0.06;
      corona1Ref.current.rotation.z = time * 0.03;
      const scale1 = 1 + Math.sin(time * 1.5) * 0.02;
      corona1Ref.current.scale.setScalar(scale1);
    }
    if (corona2Ref.current) {
      corona2Ref.current.rotation.y = time * 0.04;
      corona2Ref.current.rotation.x = time * -0.02;
      const scale2 = 1 + Math.sin(time * 2.0 + 1) * 0.03;
      corona2Ref.current.scale.setScalar(scale2);
    }
    if (corona3Ref.current) {
      const scale3 = 1 + Math.sin(time * 0.8) * 0.04;
      corona3Ref.current.scale.setScalar(scale3);
    }
    if (flareRef.current) {
      const flareScale = 1 + Math.sin(time * 3.0) * 0.08;
      flareRef.current.scale.setScalar(flareScale);
      (flareRef.current.material as THREE.MeshBasicMaterial).opacity = 0.06 + Math.sin(time * 2.5) * 0.03;
    }
  });

  return (
    <group>
      {/* Inner Core — Dense, bright, hot yellow-white */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial 
          color="#fb923c"
          emissive="#fed7aa"
          emissiveIntensity={2.5}
          roughness={0.2}
          toneMapped={false}
        />
      </mesh>
      
      {/* Corona Layer 1 — Tight, bright amber haze */}
      <mesh ref={corona1Ref}>
        <sphereGeometry args={[2.75, 64, 64]} />
        <meshBasicMaterial 
          color="#ea580c"
          transparent 
          opacity={0.5} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Corona Layer 2 — Mid glow, warm orange-yellow */}
      <mesh ref={corona2Ref}>
        <sphereGeometry args={[3.1, 48, 48]} />
        <meshBasicMaterial 
          color="#fb923c"
          transparent 
          opacity={0.22} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Corona Layer 3 — Outer atmosphere bloom, pale warm */}
      <mesh ref={corona3Ref}>
        <sphereGeometry args={[3.6, 32, 32]} />
        <meshBasicMaterial 
          color="#ffedd5"
          transparent 
          opacity={0.1} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Solar Flare — Large, faint, pulsing warm halo */}
      <mesh ref={flareRef}>
        <sphereGeometry args={[4.5, 24, 24]} />
        <meshBasicMaterial 
          color="#fff7ed"
          transparent 
          opacity={0.06} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
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
}

function Moon({ name, slug, orbitRadius, orbitSpeed, color, parentPos, onSelect, isActive }: MoonProps) {
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
    <mesh ref={meshRef} onClick={(e) => {
      e.stopPropagation();
      audioManager.playClick();
      onSelect();
    }}>
      {/* Moon Surface */}
      <sphereGeometry args={[0.18, 24, 24]} />
      <meshStandardMaterial 
        color={isActive ? "#ffffff" : color} 
        emissive={isActive ? "#ffffff" : color} 
        emissiveIntensity={isActive ? 2.5 : 1.0}
        roughness={0.15}
        metalness={0.85}
      />
      
      {/* Soft Aura Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.28, 12, 12]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={isActive ? 0.5 : 0.2} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
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
  );
}

// --- Planet Component (Enhanced with atmosphere, rings, unique traits) ---
interface PlanetProps {
  config: PlanetConfig;
}

function Planet({ config }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);

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

  // Animate planet position and rotation
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      const theta = time * config.speed;
      const px = config.radius * Math.cos(theta);
      const pz = config.radius * Math.sin(theta);
      meshRef.current.position.set(px, 0, pz);
      meshRef.current.rotation.y = time * 0.3;
    }
    // Animate atmosphere pulse
    if (atmosphereRef.current) {
      const pulse = 1 + Math.sin(time * 1.2) * 0.02;
      atmosphereRef.current.scale.setScalar(pulse);
    }
    // Animate selection ring rotation
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2.2 + Math.sin(time * 0.4) * 0.05;
      ringRef.current.rotation.z = time * 0.15;
    }
  });

  // Moon data
  const moonsData = useMemo(() => {
    if (config.type === 'projects') {
      return projects.map((p, index) => ({
        name: p.title,
        slug: p.slug,
        orbitRadius: 1.2 + index * 0.35,
        orbitSpeed: 0.9 - index * 0.15,
      }));
    }
    if (config.type === 'tech_stack') {
      const categories = Array.from(new Set(techStack.map(t => t.category)));
      return categories.slice(0, 4).map((cat, index) => ({
        name: cat,
        slug: cat.toLowerCase(),
        orbitRadius: 1.1 + index * 0.3,
        orbitSpeed: 0.8 - index * 0.12,
      }));
    }
    if (config.type === 'academics') {
      return academics.map((a, index) => ({
        name: a.degree.split(' ').slice(-2).join(' ') || a.institution.split(' ')[0],
        slug: `acad-${a.id}`,
        orbitRadius: 1.0 + index * 0.4,
        orbitSpeed: 0.7 - index * 0.1,
      }));
    }
    if (config.type === 'socials') {
      return socials.slice(0, 4).map((s, index) => ({
        name: s.platform,
        slug: s.platform.toLowerCase(),
        orbitRadius: 0.9 + index * 0.25,
        orbitSpeed: 1.1 - index * 0.15,
      }));
    }
    if (config.type === 'resume') {
      // Build moon slugs from live data — each section becomes a moon
      const sections = [
        { name: 'Experience', slug: 'resume-experience', available: resumeExperience.length > 0 },
        { name: 'Skills', slug: 'resume-skills', available: resumeSkills.length > 0 },
        { name: 'Education', slug: 'resume-education', available: resumeEducation.length > 0 },
        { name: 'Certifications', slug: 'resume-certifications', available: resumeCertifications.length > 0 },
      ];
      return sections.map((sec, index) => ({
        name: sec.name,
        slug: sec.slug,
        orbitRadius: 1.0 + index * 0.32,
        orbitSpeed: 0.85 - index * 0.12,
      }));
    }
    return [];
  }, [config.type, projects, techStack, academics, socials, resumeExperience, resumeSkills, resumeEducation, resumeCertifications]);

  const handlePlanetClick = (e: any) => {
    e.stopPropagation();
    audioManager.playClick();
    if (!isSelected) {
      setPlanet(config.type);
    } else {
      if (currentState === 1) {
        setViewState(2);
      } else if (currentState === 2) {
        setViewState(3);
      } else {
        setViewState(1);
      }
    }
  };

  const currentPosTuple = (): [number, number, number] => {
    if (meshRef.current) {
      return [meshRef.current.position.x, meshRef.current.position.y, meshRef.current.position.z];
    }
    return [0, 0, 0];
  };

  // Each planet type gets unique material traits
  const getMaterialProps = () => {
    switch (config.type) {
      case 'projects':
        return { roughness: 0.15, metalness: 0.95 }; // Polished metallic
      case 'tech_stack':
        return { roughness: 0.25, metalness: 0.7 }; // Warm golden alloy
      case 'socials':
        return { roughness: 0.6, metalness: 0.3 }; // Softer, icy surface
      case 'academics':
        return { roughness: 0.35, metalness: 0.5 }; // Rocky, warm
      case 'resume':
        return { roughness: 0.1, metalness: 0.9 }; // Crystal-smooth, gem-like
      default:
        return { roughness: 0.3, metalness: 0.5 };
    }
  };

  const matProps = getMaterialProps();

  return (
    <>
      {/* Orbit path */}
      <OrbitLine radius={config.radius} color={config.color} />

      {/* Planet Body */}
      <mesh ref={meshRef} onClick={handlePlanetClick}>
        <sphereGeometry args={[config.size, 48, 48]} />
        <meshStandardMaterial
          color={config.color}
          roughness={matProps.roughness}
          metalness={matProps.metalness}
          emissive={config.color}
          emissiveIntensity={isSelected ? 0.7 : 0.2}
        />
        
        {/* Atmospheric Halo (Always visible, subtle) */}
        <mesh ref={atmosphereRef}>
          <sphereGeometry args={[config.size * 1.12, 32, 32]} />
          <meshBasicMaterial 
            color={config.color} 
            transparent 
            opacity={isSelected ? 0.18 : 0.08} 
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Saturn-Style Selection Rings (Multi-band disc with gradient) */}
        {isSelected && (
          <group ref={ringRef} rotation={[Math.PI / 2.2, 0, 0]}>
            {/* Inner bright band */}
            <mesh>
              <ringGeometry args={[config.size * 1.25, config.size * 1.5, 80]} />
              <meshBasicMaterial 
                color={config.color} 
                transparent 
                opacity={0.35}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Middle band — slightly dimmer */}
            <mesh>
              <ringGeometry args={[config.size * 1.55, config.size * 1.75, 80]} />
              <meshBasicMaterial 
                color={config.color} 
                transparent 
                opacity={0.2}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Outer faint band */}
            <mesh>
              <ringGeometry args={[config.size * 1.8, config.size * 2.0, 80]} />
              <meshBasicMaterial 
                color={config.color} 
                transparent 
                opacity={0.1}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Thin bright accent line */}
            <mesh>
              <torusGeometry args={[config.size * 1.5, 0.008, 8, 100]} />
              <meshBasicMaterial 
                color="#f0fdfa" 
                transparent 
                opacity={0.6}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
            {/* Outer glow edge line */}
            <mesh>
              <torusGeometry args={[config.size * 2.0, 0.005, 8, 100]} />
              <meshBasicMaterial 
                color={config.color} 
                transparent 
                opacity={0.3}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
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
                isSelected ? 'text-[#f0fdfa] text-lg font-bold' : 'text-teal-100/80 text-base'
              }`}
              style={{ textShadow: `0 0 15px ${config.color}, 0 2px 8px rgba(0,0,0,0.9)` }}
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
        {isSelected && (currentState >= 1) && moonsData.map((moon) => (
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
          />
        ))}
      </mesh>
    </>
  );
}

// --- Dust Particles (Ambient cosmic dust floating in the scene) ---
function CosmicDust() {
  const ref = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    const count = 300;
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100;
      sz[i] = Math.random() * 0.5 + 0.1;
    }
    return { positions: pos, sizes: sz };
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.005;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        {/* @ts-ignore */}
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#99f6e4"
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// --- Main Celestial System Component ---
export default function CelestialSystem() {
  return (
    <group>
      <Sun />
      <CosmicDust />
      
      <Planet config={PLANETS_CONFIG.projects} />
      <Planet config={PLANETS_CONFIG.tech_stack} />
      <Planet config={PLANETS_CONFIG.socials} />
      <Planet config={PLANETS_CONFIG.academics} />
      <Planet config={PLANETS_CONFIG.resume} />
    </group>
  );
}
