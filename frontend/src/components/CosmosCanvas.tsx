'use client';

import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import CameraController from './CameraController';
import CelestialSystem from './CelestialSystem';
import { useStore } from '../store/useStore';

export default function CosmosCanvas() {
  const currentState = useStore((state) => state.currentState);
  const setViewState = useStore((state) => state.setViewState);
  const setPlanet = useStore((state) => state.setPlanet);

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
          } else if (currentState !== 0 && currentState !== 4) {
            setViewState(0);
            setPlanet(null);
          }
        }}
      >
        <color attach="background" args={["#0b0907"]} />
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
        <Stars
          radius={120}
          depth={50}
          count={4000}
          factor={4}
          saturation={0.5}
          fade
          speed={0.5}
        />

        {/* Secondary starfield — closer, smaller, cooler tint */}
        <Stars
          radius={60}
          depth={30}
          count={1500}
          factor={2}
          saturation={0.8}
          fade
          speed={0.3}
        />

        {/* Orbit Lines, Sun, Planets, Moons, and Cosmic Dust */}
        <CelestialSystem />

        {/* Cinematic camera flights */}
        <CameraController />

        {/* Always-on orbit controls — camera position released to user after fly-in */}
        <OrbitControls
          enabled={true}
          enablePan={currentState === 0 || currentState === 4}
          enableZoom={true}
          enableRotate={true}
          autoRotate={currentState === 0}
          autoRotateSpeed={0.5}


          maxDistance={currentState === 2 ? 16 : currentState === 3 ? 4.0 : 90}
          minDistance={currentState === 3 ? 1.1 : 2}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
