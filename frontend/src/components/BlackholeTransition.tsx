'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useStore } from '../store/useStore';

export default function BlackholeTransition() {
  const router = useRouter();
  const isBlackholeTransitioning = useStore((s) => s.isBlackholeTransitioning);
  const pendingDetailPlanet = useStore((s) => s.pendingDetailPlanet);
  const clearBlackholeTransition = useStore((s) => s.clearBlackholeTransition);
  const navigatedRef = useRef(false);

  useEffect(() => {
    if (isBlackholeTransitioning && pendingDetailPlanet && !navigatedRef.current) {
      navigatedRef.current = true;
      
      // Navigate exactly when the screen becomes completely black (1400ms)
      const navTimer = setTimeout(() => {
        router.push(`/planet/${pendingDetailPlanet}`);
      }, 1400);

      // Give the new page a moment to render under the black screen before fading out
      const clearTimer = setTimeout(() => {
        clearBlackholeTransition();
        navigatedRef.current = false;
      }, 1800);

      return () => {
        clearTimeout(navTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [isBlackholeTransitioning, pendingDetailPlanet, router, clearBlackholeTransition]);

  return (
    <AnimatePresence>
      {isBlackholeTransitioning && (
        <motion.div
          key="blackhole-overlay"
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden pointer-events-all"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ backgroundColor: 'transparent' }}
        >
          {/* Darkening backdrop */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)' }}
          />

          {/* Vortex ring layer — spiraling inward */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 4, rotate: 0 }}
            animate={{ opacity: [0, 0.8, 1, 0], scale: [4, 1, 0.1, 0], rotate: [0, -120, -260, -360] }}
            transition={{ duration: 1.3, ease: [0.25, 0.1, 0.8, 1.0], times: [0, 0.4, 0.75, 1] }}
          >
            {/* Outer ring */}
            <div
              className="absolute rounded-full border-2"
              style={{
                width: '80vmax',
                height: '80vmax',
                borderColor: 'rgba(167,139,250,0.15)',
                boxShadow: '0 0 60px 20px rgba(167,139,250,0.08), inset 0 0 60px 20px rgba(167,139,250,0.06)',
              }}
            />
            {/* Mid ring */}
            <div
              className="absolute rounded-full border"
              style={{
                width: '50vmax',
                height: '50vmax',
                borderColor: 'rgba(94,234,212,0.2)',
                boxShadow: '0 0 40px 10px rgba(94,234,212,0.1)',
              }}
            />
            {/* Inner ring */}
            <div
              className="absolute rounded-full border-2"
              style={{
                width: '25vmax',
                height: '25vmax',
                borderColor: 'rgba(251,146,60,0.3)',
                boxShadow: '0 0 30px 15px rgba(251,146,60,0.12)',
              }}
            />
          </motion.div>

          {/* Particle streams — star streaks rushing into the singularity */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.1, times: [0, 0.3, 1] }}
          >
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i / 24) * 360;
              const length = 15 + Math.random() * 20;
              const delay = Math.random() * 0.2;
              return (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-1/2 origin-left"
                  style={{
                    width: `${length}vmax`,
                    height: '1px',
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: '0 0',
                    marginLeft: 0,
                    marginTop: 0,
                  }}
                  initial={{ scaleX: 1, opacity: 0.8 }}
                  animate={{ scaleX: [1, 0], opacity: [0.8, 0] }}
                  transition={{ duration: 0.9, delay, ease: 'easeIn' }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: `linear-gradient(90deg, transparent, rgba(${i % 3 === 0 ? '167,139,250' : i % 3 === 1 ? '94,234,212' : '251,146,60'},0.6), rgba(255,255,255,0.9))`,
                    }}
                  />
                </motion.div>
              );
            })}
          </motion.div>

          {/* Central singularity orb */}
          <motion.div
            className="absolute rounded-full"
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{
              width: ['0px', '8px', '60px', '20vmax', '200vmax'],
              height: ['0px', '8px', '60px', '20vmax', '200vmax'],
              opacity: [0, 1, 1, 1, 1],
            }}
            transition={{
              duration: 1.4,
              ease: [0.2, 0.0, 0.8, 1.0],
              times: [0, 0.15, 0.45, 0.7, 1],
            }}
            style={{
              background: 'radial-gradient(circle, #ffffff 0%, #a78bfa 20%, #4f46e5 40%, #1e1b4b 65%, #000000 100%)',
              boxShadow: '0 0 60px 30px rgba(167,139,250,0.4), 0 0 120px 60px rgba(79,70,229,0.2)',
              transform: 'translate(-50%, -50%)',
              left: '50%',
              top: '50%',
              position: 'absolute',
              marginLeft: 0,
              marginTop: 0,
            }}
          />

          {/* Screen-wide collapse overlay — final black fill */}
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 0, 1] }}
            transition={{ duration: 1.4, times: [0, 0.6, 0.75, 1] }}
          />

          {/* "Initiating Warp" label */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.3] }}
            transition={{ duration: 1.3, times: [0, 0.2, 0.65, 1] }}
          >
            <p
              className="font-cinzel text-xs uppercase tracking-[0.5em] text-white/80"
              style={{ textShadow: '0 0 20px rgba(167,139,250,0.9)' }}
            >
              Entering System
            </p>
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-violet-400"
                  animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.3, 0.7] }}
                  transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.2 }}
                  style={{ boxShadow: '0 0 8px rgba(167,139,250,0.9)' }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
