'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ShockwaveProps {
  color: string;
  size: number;
  onComplete: () => void;
}

export default function Shockwave({ color, size, onComplete }: ShockwaveProps) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.scale.addScalar(delta * 18);
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity -= delta * 1.8;
    if (mat.opacity <= 0) onComplete();
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[size, size + 0.1, 64]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
