'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ASTEROID_COUNT = 1200;

export default function AsteroidBelt() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy  = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < ASTEROID_COUNT; i++) {
      // Belt sits strictly between TechStack (r=25) and Socials (r=35): 28.5–31.5
      const radius = 28.5 + Math.random() * 3.0;
      const theta  = Math.random() * Math.PI * 2;
      const y      = (Math.random() - 0.5) * 1.0; // Flat disk
      dummy.position.set(radius * Math.cos(theta), y, radius * Math.sin(theta));
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const scale = Math.random() * 0.10 + 0.03;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.015;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, ASTEROID_COUNT]}>
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
