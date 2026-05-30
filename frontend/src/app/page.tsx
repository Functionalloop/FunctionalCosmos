'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket } from 'lucide-react';
import CosmosCanvas from '../components/CosmosCanvas';
import UIOverlay from '../components/UIOverlay';
import { useStore } from '../store/useStore';
import { audioManager } from '../utils/audio';

const LOADING_STEPS = [
  "HYPERSPACE LINK ESTABLISHED...",
  "ALIGNING ORBITAL TELEMETRY...",
  "RETRIEVING CELESTIAL METADATA...",
  "CALIBRATING STARFIELD MATRICES...",
  "SYSTEM ONLINE. WELCOME ARCHITECT."
];

// Lucide Rocket — matches app icon system, teal/amber theme, 45° takeoff shake
function LaunchRocket() {
  return (
    <motion.div
      className="absolute flex items-center justify-center"
      animate={{
        x: [0, -1.5, 1.5, -1, 1, 0],
        y: [0, 1.5, -1, 1, -1.5, 0],
        rotate: [0, -1.5, 1.5, -1, 1, 0], // The Lucide Rocket points 45deg top-right natively
      }}
      transition={{ repeat: Infinity, duration: 0.18, ease: 'easeInOut' }}
      style={{
        filter:
          'drop-shadow(0 0 8px rgba(94,234,212,0.7)) drop-shadow(0 0 16px rgba(20,184,166,0.35))',
      }}
    >
      {/* Exhaust flame glow blob — pulses behind the bottom-left tail of the rocket */}
      <motion.div
        className="absolute rounded-full blur-lg"
        style={{
          width: 20, height: 20,
          bottom: -4, left: -4, // Fixed to bottom-left where the tail actually is
          background: 'radial-gradient(circle, rgba(251,146,60,0.8) 0%, rgba(239,68,68,0.3) 60%, transparent 100%)',
        }}
        animate={{ scale: [1, 1.5, 0.8, 1.4, 1], opacity: [0.7, 1, 0.5, 0.9, 0.7] }}
        transition={{ repeat: Infinity, duration: 0.14, ease: 'easeInOut' }}
      />
      <Rocket
        className="w-9 h-9 text-teal-400"
        strokeWidth={1.5}
      />
    </motion.div>
  );
}

// Hyperspace warp effect to transition into the main solar system canvas
function HyperspaceJump() {
  return (
    <motion.div className="absolute inset-0 z-[100] overflow-hidden pointer-events-none">
      {/* Central flash */}
      <motion.div 
        className="absolute inset-0 bg-teal-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.2, times: [0, 0.3, 1], ease: "easeInOut" }}
        style={{ mixBlendMode: 'screen' }}
      />
      
      {/* Warp streaks */}
      {Array.from({ length: 60 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const angleDeg = angle * (180 / Math.PI);
        const length = 100 + Math.random() * 200;
        const thickness = 1 + Math.random() * 3;
        const color = Math.random() > 0.6 ? '#5eead4' : '#fed7aa'; // Teal or amber
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: length,
              height: thickness,
              backgroundColor: color,
              left: '50%',
              top: '50%',
              marginTop: -thickness / 2,
              transformOrigin: '0% 50%',
              boxShadow: `0 0 10px ${color}`,
            }}
            initial={{ 
              x: Math.cos(angle) * (50 + Math.random() * 50),
              y: Math.sin(angle) * (50 + Math.random() * 50),
              rotate: angleDeg,
              scaleX: 0,
              opacity: 0
            }}
            animate={{ 
              x: Math.cos(angle) * (1000 + Math.random() * 500),
              y: Math.sin(angle) * (1000 + Math.random() * 500),
              scaleX: 1,
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 0.5 + Math.random() * 0.4,
              ease: "easeIn",
              delay: Math.random() * 0.2
            }}
          />
        );
      })}
    </motion.div>
  );
}

export default function Home() {
  const fetchInitialData = useStore((state) => state.fetchInitialData);
  const [showIntro, setShowIntro] = useState(true);
  const [isWarping, setIsWarping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Initialize audio on first interaction
  const handleInteraction = () => {
    audioManager.init();
  };

  useEffect(() => {
    let progressTimer: NodeJS.Timeout;

    // Start fetching data
    fetchInitialData().finally(() => {
      setIsDataLoaded(true);
    });

    // Animate progress smoothly
    const startTime = Date.now();
    const duration = 1800; // 1.8 seconds minimum loading animation

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const computedProgress = Math.min((elapsed / duration) * 100, 95);

      if (isDataLoaded && elapsed >= duration) {
        setProgress(100);
        setTimeout(() => {
          setIsWarping(true); // Trigger warp effect
          
          setTimeout(() => {
            setShowIntro(false); // Hide loader during peak flash
          }, 350); 
          
          setTimeout(() => {
            setIsWarping(false); // Clean up warp effect
          }, 1500);
        }, 300); // short delay to show 100% progress
      } else {
        setProgress(Math.floor(computedProgress));
        progressTimer = setTimeout(updateProgress, 30);
      }
    };

    updateProgress();
    return () => clearTimeout(progressTimer);
  }, [fetchInitialData, isDataLoaded]);

  useEffect(() => {
    const step = Math.min(Math.floor(progress / 20), LOADING_STEPS.length - 1);
    setLoadingStep(step);
  }, [progress]);

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden bg-[#02080c] text-[#fed7aa] font-cormorant"
      onClick={handleInteraction}
      onKeyDown={handleInteraction}
    >
      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ 
              opacity: 0, 
              scale: 3, 
              filter: 'blur(10px)',
              transition: { duration: 0.8, ease: 'easeIn' }
            }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#02080c] overflow-hidden select-none"
          >
            {/* Ambient space background */}
            <div className="starfield-bg opacity-40 absolute inset-0 pointer-events-none" />
            <div className="vignette-overlay absolute inset-0 pointer-events-none" />

            {/* Corner Sci-Fi Telemetry HUD Tags */}
            <div className="absolute top-6 left-6 font-mono text-[9px] tracking-[0.25em] text-teal-500/40 uppercase hidden sm:block">
              SYS_REF: SGR-A* | COORD: 17H 45M 40S / -29°00'28"
            </div>
            <div className="absolute top-6 right-6 font-mono text-[9px] tracking-[0.25em] text-[#fed7aa]/40 uppercase hidden sm:block">
              CORE_UPLINK: ONLINE_LOCKED
            </div>
            <div className="absolute bottom-6 left-6 font-mono text-[9px] tracking-[0.25em] text-[#fed7aa]/30 uppercase hidden md:block">
              GL_RENDERER: WEBGL_2.0_THREEJS
            </div>
            <div className="absolute bottom-6 right-6 font-mono text-[9px] tracking-[0.25em] text-teal-500/30 uppercase hidden md:block">
              SECURE_NODE: v0.1.0-ALPHA
            </div>

            <div className="relative flex flex-col items-center gap-2 z-10">
              {/* Concentric orbit rings behind the rocket */}
              <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
                {/* Outer ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 16, ease: 'linear' }}
                  className="absolute w-[210px] h-[210px] rounded-full border border-dashed border-teal-500/15"
                />
                {/* Middle ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 11, ease: 'linear' }}
                  className="absolute w-[170px] h-[170px] rounded-full border border-dotted border-[#fb923c]/15"
                />
                {/* Inner spinning arc */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2.8, ease: 'linear' }}
                  className="absolute w-[130px] h-[130px] rounded-full border-t-[1.5px] border-r-[1.5px] border-teal-400/60 border-b border-l border-transparent shadow-[0_0_16px_rgba(20,184,166,0.15)]"
                />
                {/* Core amber glow */}
                <motion.div
                  animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  className="absolute w-24 h-24 rounded-full blur-xl"
                  style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)' }}
                />
                {/* The rocket */}
                <LaunchRocket />
              </div>

              {/* Text block */}
              <div className="flex flex-col items-center gap-1.5 mt-1">
                <motion.h2
                  initial={{ letterSpacing: '0.2em', opacity: 0 }}
                  animate={{ letterSpacing: '0.4em', opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="font-cinzel text-sm uppercase font-bold bg-gradient-to-r from-[#fed7aa] via-[#fb923c] to-[#ea580c] text-transparent bg-clip-text drop-shadow-[0_0_12px_rgba(251,146,60,0.25)] ml-1"
                >
                  INITIALIZING COSMOS
                </motion.h2>

                <span className="text-[10px] font-cormorant text-[#fed7aa]/60 tracking-[0.25em] uppercase h-4 flex items-center justify-center">
                  {LOADING_STEPS[loadingStep]}
                </span>

                {/* Progress bar */}
                <div className="flex flex-col items-center gap-1.5 mt-1">
                  <div className="w-52 h-[2px] bg-teal-950/40 border border-teal-900/20 rounded-full relative overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-teal-500 to-amber-500 shadow-[0_0_8px_rgba(45,212,191,0.4)]"
                      style={{ width: `${progress}%` }}
                      transition={{ ease: 'easeOut' }}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-teal-400/50 tracking-wider">
                    {progress}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full h-full"
          >
            <CosmosCanvas />
            <UIOverlay />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hyperspace Transition Overlay */}
      <AnimatePresence>
        {isWarping && <HyperspaceJump key="warp" />}
      </AnimatePresence>
    </div>
  );
}
