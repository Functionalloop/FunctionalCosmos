'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { audioManager } from '../../utils/audio';
import { SUN_VERTEX_SHADER, SUN_FRAGMENT_SHADER } from '../../utils/shaders';
import SolarWind from './SolarWind';

export default function Sun() {
  const coreRef       = useRef<THREE.Mesh>(null);
  const chromoRef     = useRef<THREE.Mesh>(null);
  const corona1Ref    = useRef<THREE.Mesh>(null);
  const corona2Ref    = useRef<THREE.Mesh>(null);
  const corona3Ref    = useRef<THREE.Mesh>(null);
  const glowRef       = useRef<THREE.Mesh>(null);
  const prominence1Ref = useRef<THREE.Mesh>(null);
  const prominence2Ref = useRef<THREE.Mesh>(null);
  const prominence3Ref = useRef<THREE.Mesh>(null);

  const flareTime  = useRef(0);
  const isFlaring  = useRef(false);

  const [hovered, setHovered] = useState(false);
  const setShowSunProfile  = useStore((s) => s.setShowSunProfile);
  const setIsCursorActive  = useStore((s) => s.setIsCursorActive);

  const sunMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time:   { value: 0 },
      colorA: { value: new THREE.Color('#fff7c0') },
      colorB: { value: new THREE.Color('#fb923c') },
      colorC: { value: new THREE.Color('#ea580c') },
    },
    vertexShader:   SUN_VERTEX_SHADER,
    fragmentShader: SUN_FRAGMENT_SHADER,
    toneMapped: false,
  }), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    sunMaterial.uniforms.time.value = time;

    const audioPulse = audioManager.getFrequencyData() * 0.25;

    // Random solar flare
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
      chromoRef.current.scale.setScalar(1 + Math.sin(time * 1.8) * 0.015 + audioPulse);
    }
    if (corona1Ref.current) {
      corona1Ref.current.rotation.z = time * 0.025;
      corona1Ref.current.scale.setScalar(1 + Math.sin(time * 1.1) * 0.04 + audioPulse * 1.2);
    }
    if (corona2Ref.current) {
      corona2Ref.current.rotation.z = time * -0.018;
      corona2Ref.current.scale.setScalar(1 + Math.sin(time * 0.7 + 1.5) * 0.05 + audioPulse * 1.5);
    }
    if (corona3Ref.current) {
      corona3Ref.current.rotation.z = time * 0.012;
      corona3Ref.current.scale.setScalar(1 + Math.sin(time * 0.5 + 3.0) * 0.06 + audioPulse * 2.0);
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(time * 0.4) * 0.03 + audioPulse * 2.5);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.05 + Math.sin(time * 0.9) * 0.02 + audioPulse * 0.1;
    }
    if (prominence1Ref.current) {
      prominence1Ref.current.rotation.z = time * 0.22;
      prominence1Ref.current.scale.setScalar(flareScale);
      (prominence1Ref.current.material as THREE.MeshBasicMaterial).color.set(
        isFlaring.current ? '#ffedd5' : '#f97316'
      );
    }
    if (prominence2Ref.current) prominence2Ref.current.rotation.z = time * -0.15 + 2.1;
    if (prominence3Ref.current) prominence3Ref.current.rotation.z = time * 0.18 + 4.2;
  });

  return (
    <group>
      <pointLight color="#ffedd5" intensity={3.5} distance={120} decay={1.8} />

      {/* Clickable core */}
      <mesh
        ref={coreRef}
        onClick={(e) => { e.stopPropagation(); audioManager.playClick(); setShowSunProfile(true); }}
        onPointerOver={() => { setHovered(true);  setIsCursorActive(true);  }}
        onPointerOut={() =>  { setHovered(false); setIsCursorActive(false); }}
      >
        <sphereGeometry args={[3.75, 128, 128]} />
        <primitive object={sunMaterial} attach="material" />
      </mesh>

      {/* Hover label */}
      {hovered && (
        <Html distanceFactor={12} position={[0, 5.5, 0]} center zIndexRange={[100, 0]}>
          <div style={{
            padding: '4px 12px',
            background: 'rgba(2,8,12,0.85)',
            border: '1px solid rgba(254,215,170,0.35)',
            borderRadius: '6px',
            color: '#fed7aa',
            fontSize: '11px',
            fontFamily: 'Cormorant Garamond, serif',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>
            ✦ About Me
          </div>
        </Html>
      )}

      {/* Chromosphere */}
      <mesh ref={chromoRef}>
        <sphereGeometry args={[3.9, 64, 64]} />
        <meshBasicMaterial color="#fde68a" transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Solar Prominences */}
      <mesh ref={prominence1Ref}>
        <sphereGeometry args={[4.3, 16, 8]} />
        <meshBasicMaterial color="#f97316" transparent opacity={0.13} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={prominence2Ref} rotation={[0.8, 0, 0]}>
        <sphereGeometry args={[4.55, 12, 6]} />
        <meshBasicMaterial color="#fb923c" transparent opacity={0.09} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={prominence3Ref} rotation={[0, 0.5, 1.2]}>
        <sphereGeometry args={[4.2, 10, 5]} />
        <meshBasicMaterial color="#fed7aa" transparent opacity={0.07} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Corona rings */}
      <mesh ref={corona1Ref}>
        <sphereGeometry args={[4.7, 48, 48]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={corona2Ref}>
        <sphereGeometry args={[5.6, 32, 32]} />
        <meshBasicMaterial color="#fb923c" transparent opacity={0.1}  blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={corona3Ref}>
        <sphereGeometry args={[6.8, 24, 24]} />
        <meshBasicMaterial color="#ffedd5" transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[8.5, 16, 16]} />
        <meshBasicMaterial color="#fff7ed" transparent opacity={0.05} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      <SolarWind />
    </group>
  );
}
