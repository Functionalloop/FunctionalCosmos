'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { audioManager } from '../../utils/audio';

export interface MoonProps {
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

export default function Moon({
  name, slug, orbitRadius, orbitSpeed, color, parentPos, onSelect, isActive, planetSize,
}: MoonProps) {
  const meshRef  = useRef<THREE.Mesh>(null);
  const glowRef  = useRef<THREE.Mesh>(null);
  const cooldown = useRef(false);

  const setIsCursorActive = useStore((s) => s.setIsCursorActive);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      const angle = time * orbitSpeed;
      meshRef.current.position.set(orbitRadius * Math.cos(angle), 0, orbitRadius * Math.sin(angle));
      meshRef.current.rotation.y = time * 0.5;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(time * 3 + orbitRadius) * 0.15);
    }
  });

  const moonRadius = 0.18 * Math.max(1, planetSize * 0.6);

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
        <mesh
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation();
            audioManager.playClick();
            onSelect();
          }}
          onPointerOver={() => {
            if (!cooldown.current) {
              audioManager.playHover();
              cooldown.current = true;
              setTimeout(() => { cooldown.current = false; }, 600);
            }
            setIsCursorActive(true);
          }}
          onPointerOut={() => setIsCursorActive(false)}
        >
          <sphereGeometry args={[moonRadius, 24, 24]} />
          <meshStandardMaterial
            color={isActive ? '#ffffff' : color}
            emissive={isActive ? '#ffffff' : color}
            emissiveIntensity={isActive ? 2.5 : 1.0}
            roughness={0.15}
            metalness={0.85}
          />

          {/* Glow layer */}
          <mesh ref={glowRef}>
            <sphereGeometry args={[moonRadius * 1.33, 24, 24]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.2}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>

          {/* Label */}
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
                <div
                  className="w-1.5 h-1.5 rounded-full mt-1.5 animate-pulse"
                  style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
                />
              )}
            </div>
          </Html>
        </mesh>
      </Trail>
    </group>
  );
}
