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
          className="relative max-w-xl w-full mx-4 overflow-hidden rounded-2xl max-h-[90vh] flex flex-col"
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
              Tanishq Deu Naik
            </h2>
            <p className="font-cormorant text-[0.72rem] tracking-[0.38em] uppercase text-amber-200/40 mt-1 mb-0 text-center">
              Founder & Lead Developer, Functional Enterprises
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2 px-8 mb-5">
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(254,215,170,0.25))' }} />
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(254,215,170,0.5)' }} />
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(254,215,170,0.25))' }} />
          </div>

          {/* Body */}
          <div className="px-8 pb-8 space-y-4 overflow-y-auto custom-scrollbar max-h-[60vh]">
            <p className="font-cormorant text-base leading-relaxed" style={{ color: 'rgba(254,230,190,0.8)' }}>
              Based in Goa, I am a B.Tech student at Parul University and a technical founder dedicated to building out the "Functional" ecosystem. Bridging the gap between deep backend architecture, advanced AI integration, and practical business solutions, my work centers on delivering scalable, high-performance digital experiences.
            </p>

            <h3 className="font-cinzel text-lg mt-4 mb-2" style={{ color: '#fb923c' }}>Founder & Lead Developer, Functional Enterprises</h3>
            <p className="font-cormorant text-base leading-relaxed" style={{ color: 'rgba(254,230,190,0.65)' }}>
              Serving as the core operational layer of the "Functional" brand, Functional Enterprises is a B2B IT solutions agency built to deliver professional digital services.
            </p>
            <ul className="list-disc ml-5 font-cormorant text-sm space-y-1" style={{ color: 'rgba(254,230,190,0.65)' }}>
              <li><strong>Technical & Strategic Direction:</strong> Sole technical founder and lead developer overseeing system architecture, full-stack development, and long-term startup strategy.</li>
              <li><strong>Business Operations:</strong> Overseeing the overarching brand identity, social media presence, and client acquisition.</li>
              <li><strong>Ecosystem Management:</strong> Operating alongside co-founder Aaditya, managing the larger umbrella of ventures and directing the <strong>FunctionalX</strong> team for collaborative hackathon projects.</li>
            </ul>

            <h3 className="font-cinzel text-lg mt-4 mb-2" style={{ color: '#fb923c' }}>Technical Expertise & Design Philosophy</h3>
            <ul className="list-disc ml-5 font-cormorant text-sm space-y-1" style={{ color: 'rgba(254,230,190,0.65)' }}>
              <li><strong>Core Engineering:</strong> Specialized in React, FastAPI, Node.js, and Java, supported by a strong foundation in Data Structures and Algorithms.</li>
              <li><strong>Computer Vision & AI:</strong> Experience engineering real-time detection systems utilizing YOLOv8 and Google MediaPipe for sign language translation and object detection.</li>
              <li><strong>Design Identity:</strong> A distinct preference for stark, minimalist branding utilizing clean, typographic designs on stark black backgrounds.</li>
            </ul>

            <h3 className="font-cinzel text-lg mt-4 mb-2" style={{ color: '#fb923c' }}>Leadership & Mentorship</h3>
            <p className="font-cormorant text-base leading-relaxed" style={{ color: 'rgba(254,230,190,0.65)' }}>
              A frequent hackathon participant and organizer, working alongside a core collaborative team to make advanced concepts accessible. This extends to peer mentorship through the development of structured study roadmaps and rapid-revision "survival guides" to help fellow students navigate technical exams.
            </p>

            <h3 className="font-cinzel text-lg mt-4 mb-2" style={{ color: '#fb923c' }}>2026 Milestones</h3>
            <ul className="list-disc ml-5 font-cormorant text-sm space-y-1" style={{ color: 'rgba(254,230,190,0.65)' }}>
              <li><strong>May 2026 (FunctionalLoop Cosmos):</strong> Developed a 3D orbital-themed web portfolio using Next.js and Three.js.</li>
              <li><strong>April 2026 (Vibe Coding Workshop):</strong> Architected and organized a workshop teaching AI-driven development.</li>
              <li><strong>Feb 2026 (The Carbon Engine):</strong> Developed a carbon-aware workload scheduler utilizing real-time telemetry.</li>
              <li><strong>Jan 2026 (Bitathon 2026):</strong> Participated focusing heavily on applied statistics and SAS testing.</li>
            </ul>

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
