'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SunProfileModalProps {
  onClose: () => void;
}

const HIGHLIGHTS = [
  { label: 'Experience', value: '4+ yrs'  },
  { label: 'Projects',   value: '10+'     },
  { label: 'GPA',        value: '8.7 / 10' },
];

const TECH_TAGS = ['FastAPI', 'Next.js', 'Three.js', 'PostgreSQL', 'Docker', 'Go', 'TypeScript'];

export default function SunProfileModal({ onClose }: SunProfileModalProps) {
  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="sun-profile-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="fixed inset-0 z-[500] flex items-center justify-center"
        style={{ background: 'rgba(2,6,12,0.72)', backdropFilter: 'blur(10px)' }}
        onClick={onClose}
      >
        {/* Panel */}
        <motion.div
          key="sun-profile-panel"
          initial={{ opacity: 0, scale: 0.88, y: 30 }}
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          exit={{    opacity: 0, scale: 0.9,  y: 20 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-xl w-full mx-4 overflow-hidden rounded-2xl"
          style={{
            background:  'linear-gradient(135deg, rgba(12,18,30,0.97) 0%, rgba(20,10,6,0.97) 100%)',
            border:      '1px solid rgba(254,215,170,0.18)',
            boxShadow:   '0 0 60px rgba(251,146,60,0.12), 0 0 120px rgba(251,146,60,0.06), inset 0 1px 0 rgba(254,215,170,0.12)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ambient glow */}
          <div style={{
            position:   'absolute', top: 0, left: 0, right: 0, height: '220px',
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(251,146,60,0.18) 0%, transparent 75%)',
            pointerEvents: 'none',
          }} />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200"
            style={{ background: 'rgba(254,215,170,0.08)', border: '1px solid rgba(254,215,170,0.2)', color: '#fed7aa' }}
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Header */}
          <div className="px-8 pt-8 pb-5 flex flex-col items-center text-center">
            {/* Sun avatar */}
            <div className="relative mb-5">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl select-none"
                style={{
                  background:  'radial-gradient(circle at 38% 35%, #fff7c0 0%, #fb923c 55%, #ea580c 100%)',
                  boxShadow:   '0 0 24px rgba(251,146,60,0.6), 0 0 60px rgba(251,146,60,0.2)',
                  animation:   'sunPulse 3s ease-in-out infinite',
                }}
              >☀</div>
              <div
                className="absolute inset-0 rounded-full"
                style={{ margin: '-10px', border: '1px dashed rgba(251,146,60,0.35)', animation: 'spin 12s linear infinite' }}
              />
            </div>

            <h2
              className="font-cinzel uppercase tracking-[0.28em] m-0 leading-none"
              style={{
                fontSize:              '1.5rem',
                background:            'linear-gradient(135deg, #fed7aa, #fb923c)',
                WebkitBackgroundClip:  'text',
                WebkitTextFillColor:   'transparent',
                backgroundClip:        'text',
              }}
            >
              Tanishq
            </h2>
            <p className="font-cormorant text-[0.72rem] tracking-[0.38em] uppercase text-amber-200/40 mt-1 mb-0">
              Systems Architect &amp; Full-Stack Developer
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2 px-8 mb-5">
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(254,215,170,0.25))' }} />
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(254,215,170,0.5)' }} />
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(254,215,170,0.25))' }} />
          </div>

          {/* Body */}
          <div className="px-8 pb-8 space-y-4">
            <p className="font-cormorant text-base leading-relaxed" style={{ color: 'rgba(254,230,190,0.8)' }}>
              I build systems that matter — from high-concurrency backend APIs to immersive 3D interfaces.
              My craft sits at the intersection of{' '}
              <span style={{ color: '#fb923c' }}>engineering precision</span> and{' '}
              <span style={{ color: '#fbbf24' }}>design intuition</span>.
            </p>
            <p className="font-cormorant text-base leading-relaxed" style={{ color: 'rgba(254,230,190,0.65)' }}>
              Currently architecting scalable microservices and real-time collaborative tools at{' '}
              <span style={{ color: '#fed7aa', fontWeight: 600 }}>FunctionalLoop Systems</span>.
              B.Tech in Computer Science from NIT, specialising in distributed systems and computer graphics.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {HIGHLIGHTS.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1 rounded-xl py-3"
                  style={{ background: 'rgba(254,215,170,0.04)', border: '1px solid rgba(254,215,170,0.1)' }}
                >
                  <span className="font-cinzel text-base" style={{ color: '#fb923c' }}>{value}</span>
                  <span className="font-cormorant text-[0.65rem] uppercase tracking-widest" style={{ color: 'rgba(254,215,170,0.4)' }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {TECH_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="font-cormorant text-[0.68rem] uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{ background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.2)', color: 'rgba(254,215,170,0.7)' }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <p
              className="font-cormorant text-[0.68rem] uppercase tracking-[0.3em] text-center pt-2 animate-pulse"
              style={{ color: 'rgba(254,215,170,0.25)' }}
            >
              Click any orbiting planet to explore further
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
