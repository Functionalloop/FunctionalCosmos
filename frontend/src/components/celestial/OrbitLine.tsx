'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OrbitLineProps {
  radius: number;
  color: string;
}

export default function OrbitLine({ radius, color }: OrbitLineProps) {
  const lineRef = useRef<THREE.Line>(null);

  const orbitLine = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const theta = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(radius * Math.cos(theta), 0, radius * Math.sin(theta)));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(pts);
    const material = new THREE.LineDashedMaterial({
      color: new THREE.Color(color),
      opacity: 0.2,
      transparent: true,
      dashSize: 0.8,
      gapSize: 0.4,
    });
    const line = new THREE.Line(geometry, material);
    line.computeLineDistances();
    return line;
  }, [radius, color]);

  useFrame((_, delta) => {
    if (lineRef.current) {
      (lineRef.current.material as any).dashOffset -= delta * 0.4;
    }
  });

  return <primitive ref={lineRef} object={orbitLine} />;
}
