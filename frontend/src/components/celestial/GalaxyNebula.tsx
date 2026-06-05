'use client';

import { Sparkles } from '@react-three/drei';

export default function GalaxyNebula() {
  return (
    <group>
      {/* Distant Teal Nebula */}
      <Sparkles count={800} scale={60} size={8}  speed={0.2} opacity={0.15} color="#5eead4" position={[-30, 10, -40]} />
      {/* Warm Amber Nebula */}
      <Sparkles count={600} scale={45} size={10} speed={0.1} opacity={0.15} color="#fb923c" position={[30, -5, -20]} />
      {/* Deep Purple Core Dust */}
      <Sparkles count={500} scale={30} size={6}  speed={0.3} opacity={0.2}  color="#c084fc" position={[0, -10, -10]} />
    </group>
  );
}
