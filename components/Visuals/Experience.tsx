// components/Visuals/Experience.tsx
"use client"
import { Canvas } from "@react-three/fiber"
import { Stars, OrbitControls, Float } from "@react-three/drei"
import { useEffect, useState } from "react"

function ComingSoonOverlay() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {/* Vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 65% 55% at 50% 50%, transparent 25%, rgba(2,8,12,0.65) 100%)",
          }}
        />

        {/* Glow halo — teal */}
        <div
          style={{
            position: "absolute",
            width: "540px",
            height: "270px",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(20,184,166,0.12) 0%, transparent 70%)",
            filter: "blur(55px)",
            animation: "halo 4.5s ease-in-out infinite",
          }}
        />

        {/* Eyebrow */}
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 200,
            fontSize: "0.66rem",
            letterSpacing: "0.55em",
            textTransform: "uppercase",
            color: "rgba(94,234,212,0.5)",
            marginBottom: "1.5rem",
            opacity: mounted ? 1 : 0,
            transition: "opacity 1.8s ease 0.3s",
          }}
        >
          something is Orbiting
        </span>

        {/* Main title */}
        <h1
          style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontWeight: 400,
            fontSize: "clamp(2rem, 5.5vw, 5rem)",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            margin: 0,
            lineHeight: 1,
            background:
              "linear-gradient(145deg, #f0fdfa 5%, #5eead4 35%, #0d9488 65%, #d4a017 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            opacity: mounted ? 1 : 0,
            filter: mounted ? "blur(0px)" : "blur(10px)",
            transition: "opacity 2s ease 0.6s, filter 2s ease 0.6s",
          }}
        >
          Coming Soon
        </h1>

        {/* Ornamental divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            margin: "1.8rem 0 1.5rem",
            opacity: mounted ? 1 : 0,
            transition: "opacity 1.6s ease 1.1s",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(20,184,166,0.45))",
            }}
          />
          <div
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "rgba(94,234,212,0.7)",
              boxShadow: "0 0 10px rgba(94,234,212,0.9), 0 0 20px rgba(20,184,166,0.4)",
              animation: "dot-pulse 2.8s ease-in-out infinite",
            }}
          />
          <div
            style={{
              width: "56px",
              height: "1px",
              background: "linear-gradient(90deg, rgba(20,184,166,0.45), transparent)",
            }}
          />
        </div>

        {/* Name tag */}
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: "0.75rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "rgba(153,246,228,0.32)",
            margin: 0,
            opacity: mounted ? 1 : 0,
            transition: "opacity 1.6s ease 1.4s",
          }}
        >
           Functionalloop
        </p>

        <style>{`
          @keyframes halo {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50%       { opacity: 1;   transform: scale(1.07); }
          }
          @keyframes dot-pulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50%       { opacity: 1;   transform: scale(1.6); }
          }
        `}</style>
      </div>
    </>
  )
}

export default function Experience() {
  return (
    <div style={{ position: "relative", height: "100vh", width: "100%", background: "#02080c" }}>
      <Canvas camera={{ position: [0, 20, 50], fov: 45 }}>
        <color attach="background" args={["#02080c"]} />

        {/* Stars tinted slightly teal */}
        <Stars radius={120} depth={60} count={5000} factor={4} saturation={0.1} fade speed={0.6} />

        {/* Sphere pushed bottom-right, further back */}
        <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.4}>
          <mesh position={[14, -10, -20]}>
            <sphereGeometry args={[5, 64, 64]} />
            <meshStandardMaterial
              emissive="#0d9488"
              emissiveIntensity={1.8}
              color="#042f2e"
            />
          </mesh>
        </Float>

        {/* Subtle second orb — deep amber accent, far upper-left */}
        <Float speed={0.9} rotationIntensity={0.2} floatIntensity={0.3}>
          <mesh position={[-18, 14, -35]}>
            <sphereGeometry args={[2.5, 32, 32]} />
            <meshStandardMaterial
              emissive="#b45309"
              emissiveIntensity={1.4}
              color="#1c0a00"
            />
          </mesh>
        </Float>

        <ambientLight intensity={0.15} />
        <pointLight position={[14, -8, -15]} intensity={2} color="#14b8a6" />
        <pointLight position={[-18, 14, -30]} intensity={0.8} color="#d97706" />

        <OrbitControls enablePan={false} maxDistance={100} minDistance={10} />
      </Canvas>

      <ComingSoonOverlay />
    </div>
  )
}