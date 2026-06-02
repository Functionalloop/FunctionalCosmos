'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  Cpu,
  FolderGit2,
  GraduationCap,
  Share2,
  Compass,
  Star,
  Menu,
  X
} from 'lucide-react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);
import { useStore, PlanetType } from '../store/useStore';
import { PLANETS_CONFIG } from '../utils/celestialData';
import { api } from '../utils/api';
import { audioManager } from '../utils/audio';
import ViewToggle from './ViewToggle';

function getTheme(planet: PlanetType | null) {
  switch (planet) {
    case 'projects': return {
      text: 'text-teal-400',
      textHover: 'hover:text-teal-300',
      border: 'border-teal-500/30',
      borderHover: 'hover:border-teal-500/50',
      bg: 'bg-teal-950/20',
      bgHover: 'hover:bg-teal-900/40',
      glow: 'glow-teal',
      icon: 'text-teal-400'
    };
    case 'tech_stack': return {
      text: 'text-amber-500',
      textHover: 'hover:text-amber-400',
      border: 'border-amber-500/30',
      borderHover: 'hover:border-amber-500/50',
      bg: 'bg-amber-950/20',
      bgHover: 'hover:bg-amber-900/40',
      glow: 'glow-amber',
      icon: 'text-amber-500'
    };
    case 'academics': return {
      text: 'text-orange-600',
      textHover: 'hover:text-orange-500',
      border: 'border-orange-700/30',
      borderHover: 'hover:border-orange-700/50',
      bg: 'bg-orange-950/20',
      bgHover: 'hover:bg-orange-900/40',
      glow: 'glow-bronze',
      icon: 'text-orange-600'
    };
    case 'socials': return {
      text: 'text-cyan-300',
      textHover: 'hover:text-cyan-200',
      border: 'border-cyan-400/30',
      borderHover: 'hover:border-cyan-400/50',
      bg: 'bg-cyan-950/20',
      bgHover: 'hover:bg-cyan-900/40',
      glow: 'glow-cyan',
      icon: 'text-cyan-300'
    };
    case 'resume': return {
      text: 'text-violet-400',
      textHover: 'hover:text-violet-300',
      border: 'border-violet-500/30',
      borderHover: 'hover:border-violet-500/50',
      bg: 'bg-violet-950/20',
      bgHover: 'hover:bg-violet-900/40',
      glow: 'glow-teal',
      icon: 'text-violet-400'
    };
    default: return {
      text: 'text-teal-400',
      textHover: 'hover:text-teal-300',
      border: 'border-teal-500/30',
      borderHover: 'hover:border-teal-500/50',
      bg: 'bg-teal-950/20',
      bgHover: 'hover:bg-teal-900/40',
      glow: 'glow-teal',
      icon: 'text-teal-400'
    };
  }
}

function getPlanetIcon(type: PlanetType) {
  switch (type) {
    case 'projects': return FolderGit2;
    case 'tech_stack': return Cpu;
    case 'academics': return GraduationCap;
    case 'socials': return Share2;
    case 'resume': return Compass;
    default: return Star;
  }
}

function renderMarkdown(text: string, theme: any) {
  if (!text) return null;
  return text.split('\n').map((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={idx} className={`font-cinzel text-xl mt-6 mb-3 ${theme.text} ${theme.glow}`}>
          {trimmed.replace('### ', '')}
        </h3>
      );
    }
    if (trimmed.startsWith('#### ')) {
      return (
        <h4 key={idx} className={`font-cormorant text-lg font-semibold mt-4 mb-2 ${theme.text} ${theme.glow}`}>
          {trimmed.replace('#### ', '')}
        </h4>
      );
    }
    if (trimmed.startsWith('- **')) {
      const match = trimmed.match(/- \*\*(.*?)\*\*:(.*)/);
      if (match) {
        return (
          <li key={idx} className="ml-4 list-disc text-sm text-teal-100/70 my-1.5 font-cormorant text-base">
            <strong className="text-teal-50">{match[1]}:</strong> {match[2]}
          </li>
        );
      }
    }
    if (trimmed.startsWith('- ')) {
      return (
        <li key={idx} className="ml-4 list-disc text-sm text-teal-100/70 my-1 font-cormorant text-base">
          {trimmed.replace('- ', '')}
        </li>
      );
    }
    if (trimmed === '') return <div key={idx} className="h-2" />;
    return (
      <p key={idx} className="text-base font-cormorant text-teal-50/80 my-2 leading-relaxed">
        {trimmed}
      </p>
    );
  });
}

function OrnamentalDivider() {
  return (
    <div className="ornamental-divider my-4 justify-center">
      <div className="ornamental-line-left" />
      <div className="ornamental-dot" />
      <div className="ornamental-line-right" />
    </div>
  );
}
// ─── Keybinds Panel ─────────────────────────────────────────────────────────────
function KeybindsPanel({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-24 left-6 z-[200] p-5 rounded-xl pointer-events-auto"
      style={{
        background: 'rgba(2, 8, 12, 0.85)',
        border: '1px solid rgba(254, 215, 170, 0.15)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-cinzel text-[#fed7aa] text-sm tracking-widest uppercase">Navigation Systems</h3>
        <button onClick={onClose} className="text-teal-200/50 hover:text-[#fed7aa] transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
        {[
          { key: 'P', action: 'Projects' },
          { key: 'T', action: 'Tech Stack' },
          { key: 'S', action: 'Socials' },
          { key: 'A', action: 'Academics' },
          { key: 'R', action: 'Resume' },
          { key: 'ESC', action: 'Reset View' },
          { key: 'SPACE', action: 'Free Roam' },
          { key: 'M', action: 'Toggle Audio' },
          { key: '?', action: 'Toggle HUD' },
        ].map(({ key, action }) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <span className="font-cormorant text-teal-100/60 text-xs tracking-wider uppercase">{action}</span>
            <kbd className="font-mono text-[10px] text-[#fb923c] bg-[#fb923c]/10 px-1.5 py-0.5 rounded border border-[#fb923c]/20">
              {key}
            </kbd>
          </div>
        ))}
      </div>
    </motion.div>
  );
}


// ─── Sun Profile Modal ────────────────────────────────────────────────────────
function SunProfileModal({ onClose }: { onClose: () => void }) {
  return (
    <AnimatePresence>
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
        <motion.div
          key="sun-profile-panel"
          initial={{ opacity: 0, scale: 0.88, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-xl w-full mx-4 overflow-hidden rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(12,18,30,0.97) 0%, rgba(20,10,6,0.97) 100%)',
            border: '1px solid rgba(254,215,170,0.18)',
            boxShadow: '0 0 60px rgba(251,146,60,0.12), 0 0 120px rgba(251,146,60,0.06), inset 0 1px 0 rgba(254,215,170,0.12)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Radial amber glow behind header */}
          <div
            style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '220px',
              background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(251,146,60,0.18) 0%, transparent 75%)',
              pointerEvents: 'none',
            }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200"
            style={{
              background: 'rgba(254,215,170,0.08)',
              border: '1px solid rgba(254,215,170,0.2)',
              color: '#fed7aa',
            }}
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Header */}
          <div className="px-8 pt-8 pb-5 flex flex-col items-center text-center">
            {/* Sun avatar / avatar ring */}
            <div className="relative mb-5">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl select-none"
                style={{
                  background: 'radial-gradient(circle at 38% 35%, #fff7c0 0%, #fb923c 55%, #ea580c 100%)',
                  boxShadow: '0 0 24px rgba(251,146,60,0.6), 0 0 60px rgba(251,146,60,0.2)',
                  animation: 'sunPulse 3s ease-in-out infinite',
                }}
              >
                ☀
              </div>
              {/* Orbit ring decoration */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  margin: '-10px',
                  border: '1px dashed rgba(251,146,60,0.35)',
                  animation: 'spin 12s linear infinite',
                }}
              />
            </div>

            <h2
              className="font-cinzel uppercase tracking-[0.28em] m-0 leading-none"
              style={{
                fontSize: '1.5rem',
                background: 'linear-gradient(135deg, #fed7aa, #fb923c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: 'none',
              }}
            >
              Tanishq
            </h2>
            <p className="font-cormorant text-[0.72rem] tracking-[0.38em] uppercase text-amber-200/40 mt-1 mb-0">
              Systems Architect &amp; Full-Stack Developer
            </p>
          </div>

          {/* Ornamental divider */}
          <div className="flex items-center gap-2 px-8 mb-5">
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(254,215,170,0.25))' }} />
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(254,215,170,0.5)' }} />
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(254,215,170,0.25))' }} />
          </div>

          {/* Summary body */}
          <div className="px-8 pb-8 space-y-4">
            <p className="font-cormorant text-base leading-relaxed" style={{ color: 'rgba(254,230,190,0.8)' }}>
              I build systems that matter — from high-concurrency backend APIs to immersive 3D interfaces.
              My craft sits at the intersection of <span style={{ color: '#fb923c' }}>engineering precision</span> and{' '}
              <span style={{ color: '#fbbf24' }}>design intuition</span>.
            </p>
            <p className="font-cormorant text-base leading-relaxed" style={{ color: 'rgba(254,230,190,0.65)' }}>
              Currently architecting scalable microservices and real-time collaborative tools at
              {' '}<span style={{ color: '#fed7aa', fontWeight: 600 }}>FunctionalLoop Systems</span>.
              B.Tech in Computer Science from NIT, specialising in distributed systems and computer graphics.
            </p>

            {/* Highlights row */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { label: 'Experience', value: '4+ yrs' },
                { label: 'Projects', value: '10+' },
                { label: 'GPA', value: '8.7 / 10' },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1 rounded-xl py-3"
                  style={{
                    background: 'rgba(254,215,170,0.04)',
                    border: '1px solid rgba(254,215,170,0.1)',
                  }}
                >
                  <span
                    className="font-cinzel text-base"
                    style={{ color: '#fb923c' }}
                  >
                    {value}
                  </span>
                  <span className="font-cormorant text-[0.65rem] uppercase tracking-widest" style={{ color: 'rgba(254,215,170,0.4)' }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {['FastAPI', 'Next.js', 'Three.js', 'PostgreSQL', 'Docker', 'Go', 'TypeScript'].map((tag) => (
                <span
                  key={tag}
                  className="font-cormorant text-[0.68rem] uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{
                    background: 'rgba(251,146,60,0.08)',
                    border: '1px solid rgba(251,146,60,0.2)',
                    color: 'rgba(254,215,170,0.7)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Hint to explore */}
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

export default function UIOverlay() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showKeybinds, setShowKeybinds] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const currentState = useStore((state) => state.currentState);
  const activePlanet = useStore((state) => state.activePlanet);
  const activeMoon = useStore((state) => state.activeMoon);
  const goBack = useStore((state) => state.goBack);
  const setViewState = useStore((state) => state.setViewState);
  const setPlanet = useStore((state) => state.setPlanet);
  const toggleFreeRoam = useStore((state) => state.toggleFreeRoam);
  const triggerDetailPage = useStore((state) => state.triggerDetailPage);
  const performanceMode = useStore((state) => state.performanceMode);
  const togglePerformanceMode = useStore((state) => state.togglePerformanceMode);
  const showSunProfile = useStore((state) => state.showSunProfile);
  const setShowSunProfile = useStore((state) => state.setShowSunProfile);

  const isBlackholeTransitioning = useStore((state) => state.isBlackholeTransitioning);

  const handleToggleMute = () => {
    const nowMuted = audioManager.toggleMute();
    setIsMuted(nowMuted);
  };

  useEffect(() => {
    // Ping visitor counter on mount
    api.pingVisitor().then((res) => {
      setVisitorCount(res.count);
    }).catch(console.error);

    // Init audio on first click anywhere
    const handleFirstInteraction = () => {
      if (!audioStarted) {
        audioManager.init().then(() => setAudioStarted(true));
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction as any);
      }
    };
    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('keydown', handleFirstInteraction as any, { once: true });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key.toLowerCase()) {
        case 'p': setPlanet('projects'); break;
        case 't': setPlanet('tech_stack'); break;
        case 's': setPlanet('socials'); break;
        case 'a': setPlanet('academics'); break;
        case 'r': setPlanet('resume'); break;
        case 'escape': setViewState(0); break;
        case ' ':
          e.preventDefault();
          toggleFreeRoam();
          break;
        case '?':
        case 'h':
          setShowKeybinds((prev) => !prev);
          break;
        case 'm':
          handleToggleMute();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setPlanet, setViewState, toggleFreeRoam, audioStarted]);

  // Trigger whoosh SFX when blackhole transition fires
  useEffect(() => {
    if (isBlackholeTransitioning) {
      audioManager.playBlackholeWhoosh();
    }
  }, [isBlackholeTransitioning]);

  const projects = useStore((state) => state.projects);
  const techStack = useStore((state) => state.techStack);
  const academics = useStore((state) => state.academics);
  const socials = useStore((state) => state.socials);
  const resumeExperience = useStore((state) => state.resumeExperience);
  const resumeSkills = useStore((state) => state.resumeSkills);
  const resumeEducation = useStore((state) => state.resumeEducation);
  const resumeCertifications = useStore((state) => state.resumeCertifications);

  const planetConfig = activePlanet ? PLANETS_CONFIG[activePlanet] : null;
  const theme = getTheme(activePlanet);
  const activeColor = activePlanet ? PLANETS_CONFIG[activePlanet].color : '#ffffff';

  const getStateTitle = () => {
    switch (currentState) {
      case 1: return 'Target Lock established';
      case 2: return 'Cinematic Orbit';
      case 3: return 'Horizon View';
      case 4: return 'Free Roam Active';
      default: return 'System Scan Active';
    }
  };

  return (
    <>
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6 select-none">

      {/* --- TOP HUD BAR (status badge, offset below nav bar) --- */}
      <div className="w-full flex justify-between items-center pointer-events-auto mt-12">
        {/* Left side empty or reserved for future elements */}
        <div></div>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`px-4 py-1.5 rounded-lg glass-hud text-xs font-cormorant tracking-[0.2em] uppercase ${theme.text} ${theme.glow}`}
        >
          {getStateTitle()}
        </motion.div>
      </div>

      {/* --- FUNCTIONAL LOGO — centered on load, shifts to top-left on interaction --- */}
      <AnimatePresence mode="wait">
        {currentState === 0 ? (
          <motion.div
            key="functional-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="font-cormorant text-[0.66rem] tracking-[0.55em] uppercase text-teal-200/50 mb-6">
                Systems Architect & Developer Portfolio
              </span>
              <h1 className="font-cinzel text-[clamp(2rem,5.5vw,5rem)] tracking-[0.22em] uppercase m-0 leading-none bg-gradient-to-br from-[#fed7aa] via-[#fb923c] to-[#ea580c] text-transparent bg-clip-text glow-teal drop-shadow-2xl">
                Functional
              </h1>
              <OrnamentalDivider />
              <p className="font-cormorant text-[0.75rem] text-teal-200/30 uppercase tracking-[0.4em] mt-2 animate-pulse">
                Select an orbiting body or use the index to initiate sequence
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="functional-corner"
            initial={{ opacity: 0, x: -20, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="absolute top-2 left-6 pointer-events-none flex flex-col items-start gap-0.5 z-[200]"
          >
            <h1 className="font-cinzel text-[clamp(1rem,2vw,1.6rem)] tracking-[0.22em] uppercase m-0 leading-none bg-gradient-to-br from-[#fed7aa] via-[#fb923c] to-[#ea580c] text-transparent bg-clip-text glow-teal drop-shadow-lg">
              Functional
            </h1>
            <span className="font-cormorant text-[0.55rem] tracking-[0.35em] uppercase text-teal-200/35">
              Systems Architect
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- TOP NAVIGATION BAR --- */}
      <div className="absolute top-0 left-0 right-0 pointer-events-auto z-[100] flex flex-col items-center">

        {/* Top Bar Strip */}
        <div
          className="w-full flex items-center justify-between px-6 py-2 backdrop-blur-md relative"
          style={{
            backgroundColor: 'rgba(2, 8, 12, 0.82)',
            borderColor: `${activeColor}25`,
          }}
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l" style={{ borderColor: `${activeColor}60` }} />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r" style={{ borderColor: `${activeColor}60` }} />

          {/* Left: spacer to balance flex layout */}
          <div className="min-w-[160px]" />

          {/* Center: Planet Nav Tabs */}
          <div className="flex items-center gap-1">
            {/* Solar System Tab */}
            <button
              onClick={() => setPlanet(null)}
              className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded transition-all duration-300 cursor-pointer"
              style={{
                backgroundColor: !activePlanet ? `${activeColor}15` : 'transparent',
                borderBottom: !activePlanet ? `2px solid #fed7aa` : '2px solid transparent',
              }}
            >
              <div className="relative flex items-center justify-center w-5 h-5 rounded-full border transition-all duration-300"
                style={{
                  borderColor: !activePlanet ? '#fed7aa' : `${activeColor}30`,
                  boxShadow: !activePlanet ? '0 0 6px rgba(254,215,170,0.4)' : undefined,
                }}
              >
                {!activePlanet && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-t border-transparent"
                    style={{ borderColor: '#fed7aa' }}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                  />
                )}
                <Star className="w-2.5 h-2.5" style={{ color: !activePlanet ? '#fed7aa' : `${activeColor}50` }} />
              </div>
              <span
                className="font-cinzel text-[9px] uppercase tracking-[0.18em] transition-all duration-300 whitespace-nowrap"
                style={{
                  color: !activePlanet ? '#fed7aa' : `${activeColor}60`,
                  textShadow: !activePlanet ? '0 0 8px rgba(254,215,170,0.6)' : undefined,
                }}
              >
                Solar
              </span>
            </button>

            {/* Divider */}
            <div className="w-px h-5 mx-1" style={{ backgroundColor: `${activeColor}20` }} />

            {/* Planet Tabs */}
            {Object.values(PLANETS_CONFIG).map((planet) => {
              const isSelected = activePlanet === planet.type;
              const PlanetIcon = getPlanetIcon(planet.type);
              return (
                <button
                  key={planet.type}
                  onClick={() => { setPlanet(planet.type as PlanetType); setViewState(2); }}
                  className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded transition-all duration-300 cursor-pointer"
                  style={{
                    backgroundColor: isSelected ? `${planet.color}15` : 'transparent',
                    borderBottom: isSelected ? `2px solid ${planet.color}` : '2px solid transparent',
                  }}
                >
                  <div
                    className="relative flex items-center justify-center w-5 h-5 rounded-full border transition-all duration-300"
                    style={{
                      borderColor: isSelected ? planet.color : `${activeColor}30`,
                      boxShadow: isSelected ? `0 0 6px ${planet.color}50` : undefined,
                    }}
                  >
                    {isSelected && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-t border-transparent"
                        style={{ borderColor: `${planet.color}cc` }}
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                      />
                    )}
                    <PlanetIcon
                      className="w-2.5 h-2.5 transition-colors duration-300"
                      style={{ color: isSelected ? planet.color : `${activeColor}50` }}
                    />
                  </div>
                  <span
                    className="font-cinzel text-[9px] uppercase tracking-[0.18em] transition-all duration-300 whitespace-nowrap"
                    style={{
                      color: isSelected ? planet.color : `${activeColor}60`,
                      textShadow: isSelected ? `0 0 8px ${planet.color}80` : undefined,
                    }}
                  >
                    {planet.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Audio toggle + COORD + View Toggle */}
          <div className="flex items-center gap-4 min-w-[200px] justify-end">
            <ViewToggle />
            <span
              className="font-mono text-[7px] uppercase tracking-widest transition-colors duration-500"
              style={{ color: `${activeColor}50` }}
            >
              COORD: {activePlanet ? `${PLANETS_CONFIG[activePlanet].radius}.00 AU` : '0.00 AU'}
            </span>
            <button
              onClick={handleToggleMute}
              className="flex items-center gap-1.5 cursor-pointer group"
              style={{ color: isMuted ? `${activeColor}35` : `${activeColor}90` }}
              title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
            >
              <div
                className="w-1.5 h-1.5 rounded-full group-hover:scale-125 transition-all"
                style={{
                  backgroundColor: isMuted ? `${activeColor}40` : activeColor,
                  boxShadow: isMuted ? 'none' : `0 0 6px ${activeColor}80`,
                }}
              />
              <span className="font-cinzel text-[8px] tracking-widest uppercase group-hover:text-white transition-colors">
                {isMuted ? 'MUTED' : 'AUDIO'}
              </span>
            </button>
            {/* Toggle expand for dropdown sub-nav */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex items-center justify-center w-6 h-6 rounded border cursor-pointer transition-all"
              style={{
                borderColor: `${activeColor}35`,
                backgroundColor: isSidebarOpen ? `${activeColor}15` : 'transparent',
                color: activeColor,
              }}
            >
              {isSidebarOpen ? <X className="w-3 h-3" /> : <Menu className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Dropdown Sub-Nav Panel (moons + mini map) */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="w-full overflow-hidden backdrop-blur-md border-b border-x shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
              style={{
                backgroundColor: 'rgba(2, 8, 12, 0.92)',
                borderColor: `${activeColor}20`,
              }}
            >
              <div className="flex items-start gap-6 px-6 py-4">

                {/* Mini Orbital Map */}
                <div
                  className="flex-shrink-0 flex flex-col items-center border rounded-lg p-3 relative transition-all duration-500"
                  style={{ backgroundColor: `${activeColor}08`, borderColor: `${activeColor}20`, minWidth: '120px' }}
                >
                  <div className="font-mono text-[6px] tracking-widest mb-1" style={{ color: `${activeColor}50` }}>ORBITAL SCHEMATIC</div>
                  <svg viewBox="0 0 120 120" className="w-20 h-20">
                    <circle cx="60" cy="60" r="7" fill="#f59e0b" className="animate-pulse" style={{ filter: 'drop-shadow(0 0 5px rgba(245,158,11,0.8))' }} />
                    {Object.values(PLANETS_CONFIG).map((planet, idx) => {
                      const radius = 18 + idx * 8;
                      const isSelected = activePlanet === planet.type;
                      return (
                        <g key={planet.type}>
                          <circle cx="60" cy="60" r={radius} fill="none"
                            stroke={isSelected ? planet.color : `${activeColor}20`}
                            strokeWidth={isSelected ? '0.75' : '0.5'}
                            strokeDasharray={isSelected ? 'none' : '2 3'}
                          />
                          <motion.g animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 15 + idx * 6, ease: 'linear' }} style={{ transformOrigin: '60px 60px' }}>
                            <motion.circle cx={60 + radius} cy="60" r={isSelected ? 3 : 1.5} fill={planet.color}
                              animate={isSelected ? { scale: [1, 1.3, 1] } : {}}
                              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                              style={{ filter: isSelected ? `drop-shadow(0 0 4px ${planet.color})` : undefined }}
                            />
                          </motion.g>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Sub-items for active planet */}
                <div className="flex-1">
                  {!activePlanet && (
                    <div className="flex flex-col gap-1">
                      <span className="font-cinzel text-[9px] uppercase tracking-widest" style={{ color: `${activeColor}60` }}>All Systems — Overview</span>
                      <p className="font-cormorant text-xs text-white/40 mt-1">Select a planet tab above to navigate to its data sector.</p>
                    </div>
                  )}
                  {activePlanet && (() => {
                    const planet = PLANETS_CONFIG[activePlanet];
                    const PlanetIcon = getPlanetIcon(activePlanet);

                    let subItems: { name: string, slug: string }[] = [];
                    if (activePlanet === 'projects') subItems = projects.map(p => ({ name: p.title, slug: p.slug }));
                    if (activePlanet === 'tech_stack') subItems = Array.from(new Set(techStack.map(t => t.category))).slice(0,4).map(c => ({ name: c, slug: c.toLowerCase() }));
                    if (activePlanet === 'academics') subItems = academics.map(a => ({ name: a.degree.split(' ').slice(-2).join(' ') || a.institution.split(' ')[0], slug: `acad-${a.id}` }));
                    if (activePlanet === 'socials') subItems = socials.slice(0,4).map(s => ({ name: s.platform, slug: s.platform.toLowerCase() }));
                    if (activePlanet === 'resume') {
                      if (resumeExperience.length > 0) subItems.push({ name: 'Experience', slug: 'resume-experience' });
                      if (resumeSkills.length > 0) subItems.push({ name: 'Skills', slug: 'resume-skills' });
                      if (resumeEducation.length > 0) subItems.push({ name: 'Education', slug: 'resume-education' });
                      if (resumeCertifications.length > 0) subItems.push({ name: 'Certifications', slug: 'resume-certifications' });
                    }

                    return (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <PlanetIcon className="w-3.5 h-3.5" style={{ color: planet.color }} />
                            <span className="font-cinzel text-[10px] uppercase tracking-widest font-bold" style={{ color: planet.color }}>
                              {planet.name} — Orbiting Datasets
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {activePlanet === 'resume' && (
                              <a
                                href="/assets/resume/tanishq_resume.pdf"
                                download="Tanishq_Resume.pdf"
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#a78bfa]/40 text-[#a78bfa]/80 hover:text-[#a78bfa] hover:bg-[#a78bfa]/10 transition-all font-cormorant text-[10px] uppercase tracking-widest shadow-[0_0_10px_rgba(167,139,250,0.15)]"
                              >
                                <span className="animate-pulse">↓</span> Eject PDF
                              </a>
                            )}
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/cosmos/${activePlanet}`);
                                setShowCopyToast(true);
                                setTimeout(() => setShowCopyToast(false), 2000);
                              }}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-teal-500/20 text-teal-200/60 hover:text-teal-100 hover:bg-teal-500/10 transition-all font-cormorant text-[10px] uppercase tracking-widest"
                            >
                              <Share2 className="w-3 h-3" />
                              {showCopyToast ? 'Copied URL!' : 'Share Planet'}
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {subItems.map(item => (
                            <button
                              key={item.slug}
                              onClick={() => { useStore.setState({ activeMoon: item.slug }); setViewState(3); setIsSidebarOpen(false); }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded border cursor-pointer transition-all duration-200 font-cormorant text-[11px] tracking-widest uppercase"
                              style={{
                                borderColor: activeMoon === item.slug ? planet.color : `${planet.color}30`,
                                backgroundColor: activeMoon === item.slug ? `${planet.color}20` : `${planet.color}08`,
                                color: activeMoon === item.slug ? '#fed7aa' : `${planet.color}b0`,
                                boxShadow: activeMoon === item.slug ? `0 0 10px ${planet.color}30` : undefined,
                              }}
                            >
                              <div className="w-1 h-1 rounded-full" style={{ backgroundColor: activeMoon === item.slug ? '#fed7aa' : `${planet.color}80` }} />
                              {item.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>

              </div>
              {/* Bottom border accent */}
              <div className="h-px w-full" style={{ background: `linear-gradient(to right, transparent, ${activeColor}40, transparent)` }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- PANEL OVERLAYS (STATE 2 & 3) --- */}
      <div className="flex-1 flex items-center justify-between pointer-events-none my-6 overflow-hidden">

        {/* LEFT PANEL */}
        <AnimatePresence>
          {currentState === 3 && activePlanet && (
            <motion.div
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              className="w-full max-w-xl h-full max-h-[85vh] glass-card pointer-events-auto rounded-xl p-8 flex flex-col"
            >
              <button
                onClick={goBack}
                className={`flex items-center gap-2 font-cormorant tracking-widest uppercase ${theme.text} ${theme.textHover} transition-colors mb-6 border ${theme.border} px-4 py-1.5 rounded-full ${theme.bg} w-fit cursor-pointer text-sm`}
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Orbit
              </button>

              <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                {activePlanet === 'projects' && (
                  (() => {
                    const project = projects.find(p => p.slug === activeMoon);
                    if (!project) return <p className="font-cormorant text-teal-100/50">Select a project moon...</p>;
                    return (
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <h2 className={`font-cinzel text-3xl uppercase tracking-[0.1em] ${theme.text} ${theme.glow}`}>{project.title}</h2>
                          <div className="flex gap-3">
                            {project.github_url && (
                              <a href={project.github_url} target="_blank" rel="noopener noreferrer" className={`p-2 bg-[#02080c]/50 border ${theme.border} rounded-full ${theme.borderHover} ${theme.textHover} text-teal-100/70 transition-all`}>
                                <GithubIcon className="w-5 h-5" />
                              </a>
                            )}
                            {project.live_url && (
                              <a href={project.live_url} target="_blank" rel="noopener noreferrer" className={`p-2 bg-[#02080c]/50 border ${theme.border} rounded-full ${theme.borderHover} ${theme.textHover} text-teal-100/70 transition-all`}>
                                <ExternalLink className="w-5 h-5" />
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 my-4">
                          {project.tags.split(',').map((tag) => (
                            <span key={tag} className={`font-cormorant text-xs tracking-wider px-3 py-1 ${theme.bg} ${theme.text} border ${theme.border} rounded-full`}>
                              {tag.trim()}
                            </span>
                          ))}
                        </div>

                        <OrnamentalDivider />
                        <div className="pt-2">
                          {renderMarkdown(project.content, theme)}
                        </div>
                      </div>
                    );
                  })()
                )}

                {activePlanet === 'tech_stack' && (
                  <div>
                    <h2 className={`font-cinzel text-3xl uppercase tracking-widest ${theme.text} ${theme.glow} mb-2`}>
                      {activeMoon ? `${activeMoon} Stack` : 'Technical Toolkit'}
                    </h2>
                    <p className="font-cormorant text-sm text-teal-100/50 mb-6 uppercase tracking-widest">
                      Categorized breakdown of technologies.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {techStack
                        .filter(t => !activeMoon || t.category.toLowerCase() === activeMoon.toLowerCase())
                        .map((tech) => (
                          <div key={tech.id} className={`p-4 ${theme.bg} border ${theme.border} rounded-lg flex items-center justify-between`}>
                            <div>
                              <h4 className="font-cormorant text-lg text-teal-50">{tech.name}</h4>
                              <p className="font-cormorant text-[10px] text-teal-100/40 uppercase tracking-[0.2em]">{tech.category}</p>
                            </div>
                            <div className="flex gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${i < tech.proficiency ? `${theme.text} fill-current` : 'text-teal-900/40'}`}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {activePlanet === 'academics' && (
                  (() => {
                    const targetId = activeMoon ? parseInt(activeMoon.replace('acad-', '')) : null;
                    const acad = academics.find(a => a.id === targetId);
                    if (!acad) return <p className="font-cormorant text-teal-100/50">Select academic entry moon...</p>;
                    return (
                      <div>
                        <span className={`font-cormorant text-xs uppercase tracking-widest ${theme.text} border ${theme.border} px-3 py-1 rounded-full`}>
                          {acad.start_date} - {acad.end_date}
                        </span>
                        <h2 className={`font-cinzel text-3xl uppercase tracking-wide mt-4 ${theme.text} ${theme.glow}`}>{acad.institution}</h2>
                        <h3 className="font-cormorant text-xl text-[#fed7aa] mt-2">{acad.degree}</h3>
                        {acad.major && <p className="font-cormorant text-teal-100/80 mt-1">Major in {acad.major}</p>}
                        {acad.gpa && <p className="font-cormorant text-sm text-teal-100/50 mt-1 uppercase tracking-widest">GPA/Score: {acad.gpa}</p>}

                        <OrnamentalDivider />
                        <div className="pt-2 text-teal-50/80 font-cormorant text-lg leading-relaxed">
                          {acad.description}
                        </div>
                      </div>
                    );
                  })()
                )}

                {activePlanet === 'socials' && (
                  <div>
                    <h2 className={`font-cinzel text-3xl uppercase tracking-widest mb-6 ${theme.text} ${theme.glow}`}>
                      Establish Connection
                    </h2>
                    <div className="flex flex-col gap-4">
                      {socials.map((soc) => (
                        <a
                          key={soc.id}
                          href={soc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-between p-5 ${theme.bg} border ${theme.border} ${theme.borderHover} ${theme.bgHover} rounded-lg group transition-all cursor-pointer pointer-events-auto`}
                        >
                          <div className="flex items-center gap-4">
                            <Share2 className={`w-5 h-5 ${theme.text}`} />
                            <span className={`font-cinzel text-xl tracking-wider text-teal-50 ${theme.textHover} transition-colors`}>
                              {soc.platform}
                            </span>
                          </div>
                          <span className={`font-cormorant text-xs text-teal-100/40 uppercase tracking-widest ${theme.textHover} transition-colors flex items-center gap-2`}>
                            Connect <ExternalLink className="w-4 h-4" />
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {activePlanet === 'resume' && (() => {
                  const moon = activeMoon;

                  // Badge emoji map for certifications
                  const badgeMap: Record<string, string> = {
                    cloud: '☁️', atom: '⚛️', shield: '🛡️', docker: '🐳', database: '🗄️',
                  };

                  if (moon === 'resume-experience') return (
                    <div>
                      <h2 className={`font-cinzel text-3xl uppercase tracking-widest mb-1 ${theme.text} ${theme.glow}`}>Experience</h2>
                      <p className="font-cormorant text-xs uppercase tracking-widest text-violet-200/40 mb-6">Professional Work History</p>
                      <OrnamentalDivider />
                      {resumeExperience.length === 0 && (
                        <p className="font-cormorant text-teal-100/40">Loading experience data...</p>
                      )}
                      {resumeExperience.map((exp) => (
                        <div key={exp.id} className={`mb-6 p-5 ${theme.bg} border ${theme.border} rounded-xl`}>
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <h3 className={`font-cinzel text-lg uppercase tracking-wide ${theme.text}`}>{exp.role}</h3>
                            <span className="font-cormorant text-xs text-violet-200/40 whitespace-nowrap">{exp.period}</span>
                          </div>
                          <p className="font-cormorant text-xs text-violet-100/60 mb-3 uppercase tracking-widest">{exp.company}</p>
                          <p className="font-cormorant text-base text-teal-50/80 leading-relaxed mb-3">{exp.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {exp.tags.split(',').map(t => (
                              <span key={t} className={`font-cormorant text-xs px-3 py-0.5 ${theme.bg} border ${theme.border} ${theme.text} rounded-full`}>{t.trim()}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  );

                  if (moon === 'resume-skills') {
                    const categories = Array.from(new Set(resumeSkills.map(s => s.category)));
                    return (
                      <div>
                        <h2 className={`font-cinzel text-3xl uppercase tracking-widest mb-1 ${theme.text} ${theme.glow}`}>Skills</h2>
                        <p className="font-cormorant text-xs uppercase tracking-widest text-violet-200/40 mb-6">Technical Proficiency Matrix</p>
                        <OrnamentalDivider />
                        {resumeSkills.length === 0 && (
                          <p className="font-cormorant text-teal-100/40">Loading skills data...</p>
                        )}
                        {categories.map((cat) => (
                          <div key={cat} className="mb-6">
                            <h4 className={`font-cormorant text-sm uppercase tracking-[0.25em] ${theme.text} mb-3`}>{cat}</h4>
                            <div className="grid grid-cols-1 gap-2">
                              {resumeSkills.filter(s => s.category === cat).map((sk) => (
                                <div key={sk.id} className={`flex items-center justify-between p-3 ${theme.bg} border ${theme.border} rounded-lg`}>
                                  <span className="font-cormorant text-teal-50 text-base">{sk.name}</span>
                                  <div className="flex gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <div key={i} className={`w-2 h-2 rounded-full ${i < sk.level ? 'bg-violet-400' : 'bg-violet-900/40'}`} />
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  }

                  if (moon === 'resume-education') return (
                    <div>
                      <h2 className={`font-cinzel text-3xl uppercase tracking-widest mb-1 ${theme.text} ${theme.glow}`}>Education</h2>
                      <p className="font-cormorant text-xs uppercase tracking-widest text-violet-200/40 mb-6">Academic Background</p>
                      <OrnamentalDivider />
                      {resumeEducation.length === 0 && (
                        <p className="font-cormorant text-teal-100/40">Loading education data...</p>
                      )}
                      {resumeEducation.map((ed) => (
                        <div key={ed.id} className={`mb-6 p-5 ${theme.bg} border ${theme.border} rounded-xl`}>
                          <span className={`font-cormorant text-xs uppercase tracking-widest ${theme.text} border ${theme.border} px-3 py-0.5 rounded-full`}>{ed.period}</span>
                          <h3 className={`font-cinzel text-lg uppercase tracking-wide mt-3 ${theme.text}`}>{ed.institution}</h3>
                          <p className="font-cormorant text-base text-[#fed7aa] mt-1">{ed.degree}</p>
                          {ed.gpa && <p className="font-cormorant text-xs text-violet-200/40 uppercase tracking-widest mt-1">GPA / Score: {ed.gpa}</p>}
                          {ed.description && <p className="font-cormorant text-base text-teal-50/70 mt-3 leading-relaxed">{ed.description}</p>}
                        </div>
                      ))}
                    </div>
                  );

                  if (moon === 'resume-certifications') return (
                    <div>
                      <h2 className={`font-cinzel text-3xl uppercase tracking-widest mb-1 ${theme.text} ${theme.glow}`}>Certifications</h2>
                      <p className="font-cormorant text-xs uppercase tracking-widest text-violet-200/40 mb-6">Credentials & Achievements</p>
                      <OrnamentalDivider />
                      {resumeCertifications.length === 0 && (
                        <p className="font-cormorant text-teal-100/40">Loading certifications data...</p>
                      )}
                      {resumeCertifications.map((cert) => (
                        <div key={cert.id} className={`flex items-center gap-5 p-4 mb-3 ${theme.bg} border ${theme.border} rounded-xl`}>
                          <span className="text-3xl">{cert.badge ? (badgeMap[cert.badge] ?? cert.badge) : '🏅'}</span>
                          <div className="flex-1">
                            <p className={`font-cinzel text-sm uppercase tracking-wide ${theme.text}`}>{cert.name}</p>
                            <p className="font-cormorant text-xs text-violet-200/40 uppercase tracking-widest mt-0.5">{cert.issuer}</p>
                          </div>
                          <span className={`font-cormorant text-xs ${theme.text} border ${theme.border} px-2 py-0.5 rounded-full`}>{cert.year}</span>
                        </div>
                      ))}
                    </div>
                  );

                  // Default: overview
                  return (
                    <div>
                      <h2 className={`font-cinzel text-3xl uppercase tracking-widest mb-2 ${theme.text} ${theme.glow}`}>Resume</h2>
                      <p className="font-cormorant text-sm text-violet-200/50 uppercase tracking-widest mb-6">Select a moon to explore a section</p>
                      <OrnamentalDivider />
                      <p className="font-cormorant text-base text-teal-50/70 leading-relaxed">
                        Full-stack developer with {resumeExperience.length > 0 ? resumeExperience.length + '+' : '3+'} years of experience crafting high-performance web applications, APIs, and immersive 3D experiences.
                        Skilled across {Array.from(new Set(resumeSkills.map(s => s.category))).length || 3} technology domains.
                      </p>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ORBIT PANEL (Previously Right Panel, now on Left) */}
        <AnimatePresence>
          {currentState === 2 && activePlanet && planetConfig && (
            <motion.div
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="w-full max-w-sm mr-auto glass-panel pointer-events-auto rounded-xl p-6 ml-4"
            >
              <div className="flex items-center gap-3 mb-4 border-b border-teal-500/10 pb-4">
                <Compass className={`w-6 h-6 ${theme.icon}`} />
                <h3 className={`font-cinzel font-bold uppercase tracking-widest text-lg ${theme.text} ${theme.glow}`}>
                  {planetConfig.name} System
                </h3>
              </div>

              <p className="font-cormorant text-base text-teal-100/70 leading-relaxed mb-6">
                You have reached the close-range orbit of the <strong className={theme.text}>{planetConfig.name}</strong> planetary body. Moons in orbit represent discrete datasets. Click any moon to initiate surface scan.
              </p>

              <div>
                <div className="relative overflow-hidden mb-3">
                  <h4 className="font-cormorant text-xs text-teal-200/40 uppercase tracking-[0.2em] text-center pb-1">
                    Orbiting Datasets
                  </h4>
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute bottom-0 left-0 w-full h-[1px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${activeColor}, transparent)` }}
                  />
                </div>

                <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto custom-scrollbar pr-2">
                  {activePlanet === 'projects' && projects.map((p, i) => (
                    <motion.button
                      key={p.slug}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                      onClick={() => { setViewState(3); useStore.setState({ activeMoon: p.slug }); }}
                      className={`text-left font-cormorant tracking-wide text-sm ${theme.bg} ${theme.bgHover} border ${theme.border} ${theme.borderHover} px-4 py-2.5 rounded text-teal-100/80 ${theme.textHover} transition-all cursor-pointer`}
                    >
                      {p.title}
                    </motion.button>
                  ))}
                  {activePlanet === 'tech_stack' && Array.from(new Set(techStack.map(t => t.category))).map((cat, i) => (
                    <motion.button
                      key={cat}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                      onClick={() => { setViewState(3); useStore.setState({ activeMoon: cat.toLowerCase() }); }}
                      className={`text-left font-cormorant tracking-wide text-sm ${theme.bg} ${theme.bgHover} border ${theme.border} ${theme.borderHover} px-4 py-2.5 rounded text-teal-100/80 ${theme.textHover} transition-all cursor-pointer`}
                    >
                      {cat} Array
                    </motion.button>
                  ))}
                  {activePlanet === 'academics' && academics.map((a, i) => (
                    <motion.button
                      key={a.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                      onClick={() => { setViewState(3); useStore.setState({ activeMoon: `acad-${a.id}` }); }}
                      className={`text-left font-cormorant tracking-wide text-sm ${theme.bg} ${theme.bgHover} border ${theme.border} ${theme.borderHover} px-4 py-2.5 rounded text-teal-100/80 ${theme.textHover} transition-all cursor-pointer truncate`}
                    >
                      {a.institution}
                    </motion.button>
                  ))}
                  {activePlanet === 'socials' && socials.map((s, i) => (
                    <motion.button
                      key={s.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                      onClick={() => { setViewState(3); useStore.setState({ activeMoon: s.platform.toLowerCase() }); }}
                      className={`text-left font-cormorant tracking-wide text-sm ${theme.bg} ${theme.bgHover} border ${theme.border} ${theme.borderHover} px-4 py-2.5 rounded text-teal-100/80 ${theme.textHover} transition-all cursor-pointer`}
                    >
                      {s.platform} Uplink
                    </motion.button>
                  ))}
                  {activePlanet === 'resume' && [
                    { label: 'Experience', slug: 'resume-experience' },
                    { label: 'Skills', slug: 'resume-skills' },
                    { label: 'Education', slug: 'resume-education' },
                    { label: 'Certifications', slug: 'resume-certifications' },
                  ].map((sec, i) => (
                    <motion.button
                      key={sec.slug}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                      onClick={() => { setViewState(3); useStore.setState({ activeMoon: sec.slug }); }}
                      className={`text-left font-cormorant tracking-wide text-sm ${theme.bg} ${theme.bgHover} border ${theme.border} ${theme.borderHover} px-4 py-2.5 rounded text-teal-100/80 ${theme.textHover} transition-all cursor-pointer`}
                    >
                      {sec.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- ENTER PLANET CTA — shown in Horizon View (state 3) --- */}
      <AnimatePresence>
        {currentState === 3 && activePlanet && (
          <motion.div
            key="enter-planet-cta"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 160, delay: 0.4 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-auto flex flex-col items-center gap-3 z-20"
          >
            <button
              onClick={() => activePlanet && triggerDetailPage(activePlanet)}
              className="relative font-cinzel text-xs uppercase tracking-[0.35em] px-8 py-3.5 rounded-full cursor-pointer transition-all duration-300"
              style={{
                background: `radial-gradient(circle at top left, ${planetConfig?.color ?? '#ffffff'}22 0%, rgba(2,8,12,0.92) 100%)`,
                border: `1px solid ${planetConfig?.color ?? '#ffffff'}55`,
                color: planetConfig?.color ?? '#ffffff',
                boxShadow: `0 0 24px ${planetConfig?.color ?? '#ffffff'}30, 0 4px 20px rgba(0,0,0,0.6)`,
                backdropFilter: 'blur(12px)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 50px ${planetConfig?.color ?? '#ffffff'}70, 0 4px 30px rgba(0,0,0,0.7)`;
                (e.currentTarget as HTMLElement).style.transform = 'scale(1.06)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${planetConfig?.color ?? '#ffffff'}30, 0 4px 20px rgba(0,0,0,0.6)`;
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              }}
            >
              ⬤ &nbsp; Enter {planetConfig?.name ?? 'Planet'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- BOTTOM HUD BAR --- */}
      <div className="w-full flex justify-between items-end pointer-events-auto mb-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-cormorant text-[11px] text-teal-200/50 uppercase tracking-[0.2em] flex items-center gap-2"
        >
          <span>✦ {visitorCount !== null ? `${visitorCount.toLocaleString()} explorers have mapped this system` : 'Establishing connection...'}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-cormorant text-[10px] text-teal-200/30 uppercase tracking-[0.25em] text-right"
        >
          Press '?' for Keyboard Shortcuts <br/>
          {currentState === 0 && 'Target lock: Left Click on any planetary body'}
          {currentState === 1 && 'Hold drag to rotate | Click planet label to enter orbit'}
          {currentState === 2 && 'Select an orbiting moon to initiate surface scan'}
          {currentState === 3 && 'Click ⬤ Enter Planet for the full system view'}
          {currentState === 4 && 'Use mouse to freely pan, zoom, and rotate'}
        </motion.div>
      </div>

      <AnimatePresence>
        {showKeybinds && <KeybindsPanel onClose={() => setShowKeybinds(false)} />}
      </AnimatePresence>

      {/* --- BOTTOM CONTROLS & NAVIGATION --- */}
      <div className="w-full flex justify-between items-center pointer-events-auto">
        <div className="flex gap-3">
          {currentState > 0 && (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={goBack}
              className={`px-5 py-2 rounded-full glass-hud font-cormorant text-xs uppercase tracking-widest text-teal-100/60 ${theme.textHover} border ${theme.border} ${theme.borderHover} transition-all cursor-pointer`}
            >
              &larr; Pull Back
            </motion.button>
          )}
          {currentState > 0 && (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={() => setViewState(0)}
              className={`px-5 py-2 rounded-full glass-hud font-cormorant text-xs uppercase tracking-widest ${theme.text} hover:text-teal-50 border ${theme.border} ${theme.borderHover} transition-all cursor-pointer`}
            >
              Reset View
            </motion.button>
          )}

          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={toggleFreeRoam}
            className={`px-5 py-2 rounded-full font-cormorant text-xs uppercase tracking-widest transition-all cursor-pointer border ${currentState === 4
              ? 'bg-amber-900/60 text-amber-100 border-amber-400/60 shadow-[0_0_15px_rgba(212,160,23,0.3)]'
              : 'glass-hud text-teal-100/60 hover:text-[#fed7aa] border-teal-500/10 hover:border-teal-400/40'
              }`}
          >
            {currentState === 4 ? 'Exit Free Roam' : 'Free Roam'}
          </motion.button>
          
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={togglePerformanceMode}
            className={`px-5 py-2 rounded-full font-cormorant text-xs uppercase tracking-widest transition-all cursor-pointer border ${
              performanceMode === 'low'
                ? 'bg-orange-900/60 text-orange-100 border-orange-400/60 shadow-[0_0_15px_rgba(234,88,12,0.3)]'
                : 'glass-hud text-teal-100/60 hover:text-teal-50 border-teal-500/10 hover:border-teal-400/40'
            }`}
          >
            VFX: {performanceMode.toUpperCase()}
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-cormorant text-[10px] text-teal-200/30 uppercase tracking-[0.25em] text-right"
        >
          Press '?' for Keyboard Shortcuts <br/>
          {currentState === 0 && 'Target lock: Left Click on any planetary body'}
          {currentState === 1 && 'Hold drag to rotate | Click planet label to enter orbit'}
          {currentState === 2 && 'Select an orbiting moon to initiate surface scan'}
          {currentState === 3 && 'Click ⬤ Enter Planet for the full system view'}
          {currentState === 4 && 'Use mouse to freely pan, zoom, and rotate'}
        </motion.div>
      </div>

      <AnimatePresence>
        {showKeybinds && <KeybindsPanel onClose={() => setShowKeybinds(false)} />}
      </AnimatePresence>

    </div>

    {/* Sun Profile Modal — rendered above the 3D canvas */}
    {showSunProfile && <SunProfileModal onClose={() => setShowSunProfile(false)} />}
    </>
  );
}
