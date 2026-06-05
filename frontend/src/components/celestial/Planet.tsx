'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { PlanetConfig } from '../../utils/celestialData';
import { audioManager } from '../../utils/audio';
import {
  PLANET_VERTEX_SHADER,
  PLANET_FRAGMENT_SHADERS,
  FRESNEL_VERTEX_SHADER,
  FRESNEL_FRAGMENT_SHADER,
} from '../../utils/shaders';
import OrbitLine from './OrbitLine';
import Moon from './Moon';
import Shockwave from './Shockwave';

// ── Material hooks ────────────────────────────────────────────────────────────

function usePlanetMaterial(type: string, color: string) {
  return useMemo(() => {
    const fragmentShader = PLANET_FRAGMENT_SHADERS[type];
    if (!fragmentShader) {
      return new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.5 });
    }
    return new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: PLANET_VERTEX_SHADER,
      fragmentShader,
      toneMapped: false,
    });
  }, [type, color]);
}

function useFresnelMaterial(color: string) {
  return useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      color:        { value: new THREE.Color(color) },
      time:         { value: 0 },
      hoverOpacity: { value: 0 },
    },
    vertexShader:   FRESNEL_VERTEX_SHADER,
    fragmentShader: FRESNEL_FRAGMENT_SHADER,
    transparent: true,
    blending:    THREE.AdditiveBlending,
    depthWrite:  false,
  }), [color]);
}

// ── Planet Component ──────────────────────────────────────────────────────────

interface PlanetProps {
  config: PlanetConfig;
}

export default function Planet({ config }: PlanetProps) {
  const meshRef        = useRef<THREE.Mesh>(null);
  const atmosphereRef  = useRef<THREE.Mesh>(null);
  const atmosphere2Ref = useRef<THREE.Mesh>(null);
  const ringRef        = useRef<THREE.Group>(null);
  const hoverCooldown  = useRef(false);

  const [isHovered,  setIsHovered]  = useState(false);
  const [shockwaves, setShockwaves] = useState<{ id: number }[]>([]);

  const activePlanet = useStore((s) => s.activePlanet);
  const activeMoon   = useStore((s) => s.activeMoon);
  const currentState = useStore((s) => s.currentState);
  const setPlanet    = useStore((s) => s.setPlanet);
  const selectMoon   = useStore((s) => s.selectMoon);
  const setViewState = useStore((s) => s.setViewState);
  const setIsCursorActive = useStore((s) => s.setIsCursorActive);

  // Data for moons
  const projects             = useStore((s) => s.projects);
  const techStack            = useStore((s) => s.techStack);
  const academics            = useStore((s) => s.academics);
  const socials              = useStore((s) => s.socials);
  const resumeExperience     = useStore((s) => s.resumeExperience);
  const resumeSkills         = useStore((s) => s.resumeSkills);
  const resumeEducation      = useStore((s) => s.resumeEducation);
  const resumeCertifications = useStore((s) => s.resumeCertifications);

  const isSelected     = activePlanet === config.type;
  const planetMaterial = usePlanetMaterial(config.type, config.color);
  const fresnelMaterial = useFresnelMaterial(config.color);

  // Register 3D audio on mount
  useEffect(() => { audioManager.createPlanetAudio(config.type); }, [config.type]);

  // Imperatively apply materials (needed for shader to take effect on all planets)
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

    // Update planet shader time
    if ((planetMaterial as THREE.ShaderMaterial).uniforms?.time) {
      (planetMaterial as THREE.ShaderMaterial).uniforms.time.value = time;
    }

    if (meshRef.current) {
      const theta = time * config.speed;
      const px = config.radius * Math.cos(theta);
      const pz = config.radius * Math.sin(theta);
      meshRef.current.position.set(px, 0, pz);
      meshRef.current.rotation.y = time * 0.3;
      audioManager.updatePlanetPosition(config.type, px, 0, pz);
    }

    if (atmosphereRef.current) {
      const mat = atmosphereRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms) {
        mat.uniforms.time.value = time;
        mat.uniforms.hoverOpacity.value = THREE.MathUtils.lerp(
          mat.uniforms.hoverOpacity.value, isHovered ? 1.0 : 0.0, 0.1
        );
      }
      atmosphereRef.current.scale.setScalar(1 + Math.sin(time * 1.2) * 0.02);
    }

    if (atmosphere2Ref.current) {
      atmosphere2Ref.current.scale.setScalar(1 + Math.sin(time * 0.7 + 1.0) * 0.035);
      (atmosphere2Ref.current.material as THREE.MeshBasicMaterial).opacity =
        (isSelected ? 0.12 : 0.04) + Math.sin(time * 0.9) * 0.02;
    }

    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2.2 + Math.sin(time * 0.4) * 0.05;
      ringRef.current.rotation.z = time * 0.15;
    }
  });

  // Moon orbit data derived from store data
  const moonsData = useMemo(() => {
    const sz = config.size;
    switch (config.type) {
      case 'projects':
        return projects.map((p, i) => ({
          name: p.title, slug: p.slug,
          orbitRadius: sz + 0.6 + i * (0.35 * sz),
          orbitSpeed:  (0.9 - i * 0.15) / Math.max(1, sz * 0.5),
        }));
      case 'tech_stack': {
        const cats = Array.from(new Set(techStack.map((t) => t.category)));
        return cats.slice(0, 4).map((cat, i) => ({
          name: cat, slug: cat.toLowerCase(),
          orbitRadius: sz + 0.5 + i * (0.3 * sz),
          orbitSpeed:  (0.8 - i * 0.12) / Math.max(1, sz * 0.5),
        }));
      }
      case 'academics':
        return academics.map((a, i) => ({
          name: a.degree.split(' ').slice(-2).join(' ') || a.institution.split(' ')[0],
          slug: `acad-${a.id}`,
          orbitRadius: sz + 0.4 + i * (0.4 * sz),
          orbitSpeed:  (0.7 - i * 0.1) / Math.max(1, sz * 0.5),
        }));
      case 'socials':
        return socials.slice(0, 4).map((s, i) => ({
          name: s.platform, slug: s.platform.toLowerCase(),
          orbitRadius: sz + 0.4 + i * (0.25 * sz),
          orbitSpeed:  (1.1 - i * 0.15) / Math.max(1, sz * 0.5),
        }));
      case 'resume': {
        const sections = [
          { name: 'Experience',     slug: 'resume-experience',     available: resumeExperience.length > 0 },
          { name: 'Skills',         slug: 'resume-skills',         available: resumeSkills.length > 0 },
          { name: 'Education',      slug: 'resume-education',      available: resumeEducation.length > 0 },
          { name: 'Certifications', slug: 'resume-certifications', available: resumeCertifications.length > 0 },
        ];
        return sections.map((sec, i) => ({
          name: sec.name, slug: sec.slug,
          orbitRadius: sz + 0.5 + i * (0.32 * sz),
          orbitSpeed:  (0.85 - i * 0.12) / Math.max(1, sz * 0.5),
        }));
      }
      default: return [];
    }
  }, [config.type, config.size, projects, techStack, academics, socials,
      resumeExperience, resumeSkills, resumeEducation, resumeCertifications]);

  const handlePlanetClick = (e: any) => {
    e.stopPropagation();
    audioManager.playClick();
    audioManager.playPlanetSelect(config.type);
    setShockwaves((prev) => [...prev, { id: Date.now() }]);
    if (!isSelected) {
      setPlanet(config.type);
      audioManager.focusPlanet(config.type);
    } else {
      if (currentState === 1) setViewState(2);
      else if (currentState === 2) setViewState(3);
      else setViewState(1);
    }
  };

  const currentPosTuple = (): [number, number, number] =>
    meshRef.current
      ? [meshRef.current.position.x, meshRef.current.position.y, meshRef.current.position.z]
      : [0, 0, 0];

  return (
    <>
      <OrbitLine radius={config.radius} color={config.color} />

      <mesh
        ref={meshRef}
        onClick={handlePlanetClick}
        onPointerOver={() => {
          if (!hoverCooldown.current) {
            audioManager.playHover();
            hoverCooldown.current = true;
            setTimeout(() => { hoverCooldown.current = false; }, 500);
          }
          setIsHovered(true);
          setIsCursorActive(true);
        }}
        onPointerOut={() => { setIsHovered(false); setIsCursorActive(false); }}
        material={planetMaterial}
      >
        <sphereGeometry args={[config.size, 96, 96]} />

        {/* Click shockwave */}
        {shockwaves.map((wave) => (
          <Shockwave
            key={wave.id}
            color={config.color}
            size={config.size}
            onComplete={() => setShockwaves((prev) => prev.filter((w) => w.id !== wave.id))}
          />
        ))}

        {/* Fresnel atmosphere */}
        <mesh ref={atmosphereRef}>
          <sphereGeometry args={[config.size * 1.05, 48, 48]} />
        </mesh>

        {/* Outer haze */}
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

        {/* Selection rings */}
        {isSelected && (
          <group ref={ringRef} rotation={[Math.PI / 2.2, 0, 0]}>
            {[
              { inner: 1.25, outer: 1.5,  opacity: 0.35 },
              { inner: 1.55, outer: 1.75, opacity: 0.2  },
              { inner: 1.8,  outer: 2.0,  opacity: 0.1  },
            ].map(({ inner, outer, opacity }, i) => (
              <mesh key={i}>
                <ringGeometry args={[config.size * inner, config.size * outer, 80]} />
                <meshBasicMaterial
                  color={config.color}
                  transparent
                  opacity={opacity}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                  side={THREE.DoubleSide}
                />
              </mesh>
            ))}
            <mesh>
              <torusGeometry args={[config.size * 1.5, 0.008, 8, 100]} />
              <meshBasicMaterial color="#f0fdfa" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
            <mesh>
              <torusGeometry args={[config.size * 2.0, 0.005, 8, 100]} />
              <meshBasicMaterial color={config.color} transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
          </group>
        )}

        {/* Planet label */}
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
