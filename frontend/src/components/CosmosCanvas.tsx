'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useRef } from 'react';
import CameraController from './CameraController';
import CelestialSystem from './CelestialSystem';
import { useStore } from '../store/useStore';
import { PLANETS_CONFIG } from '../utils/celestialData';

function DynamicBackground() {
  const activePlanet = useStore((state) => state.activePlanet);
  const color = new THREE.Color(activePlanet ? PLANETS_CONFIG[activePlanet].color : '#0b0907');
  
  if (activePlanet) {
    color.multiplyScalar(0.04); // Tint heavily down
  }

  useFrame((state, delta) => {
    state.scene.background = state.scene.background || new THREE.Color('#0b0907');
    if (state.scene.background instanceof THREE.Color) {
      state.scene.background.lerp(color, delta * 1.5);
    }
  });
  return null;
}

function ShootingStar() {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.position.addScaledVector(ref.current.userData.velocity, delta);
      ref.current.userData.life -= delta;
      
      if (ref.current.userData.life <= 0) {
        // Respawn
        ref.current.position.set((Math.random() - 0.5) * 120, 30 + Math.random() * 40, (Math.random() - 0.5) * 120);
        ref.current.userData.velocity.set((Math.random() - 0.5) * 60, -30 - Math.random() * 40, (Math.random() - 0.5) * 60);
        ref.current.userData.life = 1 + Math.random() * 1.5;
        ref.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), ref.current.userData.velocity.clone().normalize());
      }
      
      const mat = ref.current.material as THREE.MeshBasicMaterial;
      const l = ref.current.userData.life;
      mat.opacity = Math.min(1, l * 3) * Math.min(1, (2.5 - l) * 3) * 0.8;
    }
  });

  return (
    <mesh ref={ref} userData={{ velocity: new THREE.Vector3(), life: 0 }}>
      <cylinderGeometry args={[0.04, 0.04, 8, 4]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

export default function CosmosCanvas() {
  const currentState   = useStore((state) => state.currentState);
  const setViewState   = useStore((state) => state.setViewState);
  const setPlanet      = useStore((state) => state.setPlanet);
  const activePlanet   = useStore((state) => state.activePlanet);
  // Fix: was useStore.getState() (not reactive!) — now properly subscribed
  const performanceMode = useStore((state) => state.performanceMode);

  const sz = activePlanet ? PLANETS_CONFIG[activePlanet].size : 1;

  return (
    <div className="w-full h-full absolute inset-0 z-0 bg-[#0b0907]">
      <div className="vignette-overlay" />
      <Canvas
        camera={{ position: [0, 14, 40], fov: 55 }}
        gl={{ antialias: true, alpha: false }}
        className="w-full h-full"
        onPointerMissed={() => {
          if (currentState === 0) {
            setViewState(4);
          } else if (currentState !== 4) {
            setViewState(0);
            setPlanet(null);
          }
        }}
      >
        <DynamicBackground />
        <ambientLight intensity={0.2} color="#ffedd5" />

        {/* The glowing center Sun light (Orange) */}
        <pointLight position={[0, 0, 0]} intensity={5.0} color="#ea580c" distance={90} decay={1.5} />

        {/* Secondary warm Sun glow for volumetric feel */}
        <pointLight position={[0, 2, 0]} intensity={1.5} color="#d4a017" distance={40} decay={2} />

        {/* Gentle directional light for details (Warm tinted) */}
        <directionalLight position={[10, 20, 10]} intensity={0.6} color="#ffedd5" />

        {/* Cool rim light from below for cinematic contrast */}
        <directionalLight position={[-8, -15, -5]} intensity={0.15} color="#67e8f9" />

        {/* Primary starfield — distant, faint, warm */}
        <Stars radius={120} depth={50} count={4000} factor={4} saturation={0.5} fade speed={0.5} />

        {/* Secondary starfield — closer, smaller, cooler tint */}
        <Stars radius={60} depth={30} count={1500} factor={2} saturation={0.8} fade speed={0.3} />

        {/* Tertiary starfield — dense galactic band */}
        <group rotation={[Math.PI / 6, Math.PI / 4, 0]}>
          <Stars radius={80} depth={20} count={3000} factor={1.2} saturation={0.9} fade speed={0.1} />
        </group>

        {/* Shooting Stars */}
        <ShootingStar />
        <ShootingStar />
        <ShootingStar />

        {/* Orbit Lines, Sun, Planets, Moons, and Cosmic Dust */}
        <CelestialSystem />

        {/* Cinematic camera flights */}
        <CameraController />

        {/* Always-on orbit controls */}
        <OrbitControls
          enabled={true}
          enablePan={currentState === 0 || currentState === 4}
          enableZoom={true}
          enableRotate={true}
          autoRotate={currentState === 0}
          autoRotateSpeed={0.5}
          maxDistance={currentState === 2 ? 16 * sz : currentState === 3 ? 4.0 * sz : 120}
          minDistance={currentState === 3 ? 1.1 * sz : 2.2 * sz}
          makeDefault
        />

        {performanceMode === 'high' && (
          <EffectComposer enableNormalPass={false} multisampling={4}>
            <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.9} intensity={1.5} mipmapBlur />
            <ChromaticAberration offset={new THREE.Vector2(0.0004, 0.0004)} />
            <Vignette eskil={false} offset={0.3} darkness={0.5} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
