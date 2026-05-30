'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
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

export default function UIOverlay() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const currentState = useStore((state) => state.currentState);
  const activePlanet = useStore((state) => state.activePlanet);
  const activeMoon = useStore((state) => state.activeMoon);
  const goBack = useStore((state) => state.goBack);
  const setViewState = useStore((state) => state.setViewState);
  const setPlanet = useStore((state) => state.setPlanet);
  const toggleFreeRoam = useStore((state) => state.toggleFreeRoam);
  const triggerDetailPage = useStore((state) => state.triggerDetailPage);

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
  const activeColor = activePlanet ? PLANETS_CONFIG[activePlanet].color : '#a78bfa';

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
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6 select-none">

      {/* --- TOP HUD BAR --- */}
      <div className="w-full flex justify-between items-center pointer-events-auto">
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
            className="absolute top-5 left-6 pointer-events-none flex flex-col items-start gap-0.5"
          >
            <h1 className="font-cinzel text-[clamp(1rem,2vw,1.6rem)] tracking-[0.22em] uppercase m-0 leading-none bg-gradient-to-br from-[#fed7aa] via-[#fb923c] to-[#ea580c] text-transparent bg-clip-text glow-teal drop-shadow-lg">
              Functional
            </h1>
            <span className="font-cormorant text-[0.55rem] tracking-[0.35em] uppercase text-teal-200/35">
              Systems Architect
            </span>
          </motion.div>
        )}
      </AnimatePresence>      {/* --- ADDON FEATURE: SLIDE-OUT SYSTEM INDEX --- */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-auto z-[100] flex items-center">
        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2.5 rounded-l-md hover:bg-violet-900/10 transition-colors backdrop-blur-md cursor-pointer shadow-[-5px_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center animate-pulse border-y border-l"
          style={{ 
            backgroundColor: 'rgba(2, 8, 12, 0.85)', 
            borderColor: `${activeColor}40`, 
            color: activeColor 
          }}
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Slide-out Panel */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-y border-l overflow-hidden backdrop-blur-md rounded-l-xl py-6 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] flex flex-col justify-between max-h-[85vh] relative"
              style={{ 
                backgroundColor: 'rgba(2, 8, 12, 0.92)', 
                borderColor: `${activeColor}30` 
              }}
            >
              {/* Sci-Fi Holographic Border Accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: `${activeColor}60` }} />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: `${activeColor}60` }} />

              <div className="w-[320px] px-6 overflow-y-auto custom-scrollbar flex-1">
                {/* Header & Telemetry */}
                <div className="flex flex-col gap-1 mb-5 border-b pb-3" style={{ borderColor: `${activeColor}20` }}>
                  <div 
                    className="font-cinzel text-xs uppercase tracking-[0.3em] font-bold transition-all duration-500"
                    style={{ color: activeColor, textShadow: `0 0 10px ${activeColor}80` }}
                  >
                    System Navigator
                  </div>
                  <div 
                    className="font-mono text-[8px] uppercase tracking-widest flex justify-between mt-1 transition-colors duration-500"
                    style={{ color: `${activeColor}60` }}
                  >
                    <span>LOCKED: {activePlanet ? activePlanet.toUpperCase() : 'ALL_SYSTEMS'}</span>
                    <span>COORD: {activePlanet ? `${PLANETS_CONFIG[activePlanet].radius}.00 AU` : '0.00 AU'}</span>
                  </div>
                </div>

                {/* SVG Mini Orbital Map */}
                <div 
                  className="flex flex-col items-center mb-5 border rounded-lg p-3 relative transition-all duration-500"
                  style={{ backgroundColor: `${activeColor}10`, borderColor: `${activeColor}20` }}
                >
                  <div className="absolute top-1 left-2 font-mono text-[6.5px] tracking-widest" style={{ color: `${activeColor}50` }}>ORBITAL SCHEMATIC</div>
                  <svg viewBox="0 0 120 120" className="w-28 h-28 mt-2">
                    {/* Sun */}
                    <circle cx="60" cy="60" r="7" fill="#f59e0b" className="animate-pulse" style={{ filter: 'drop-shadow(0 0 5px rgba(245,158,11,0.8))' }} />
                    
                    {/* Planet Orbits & Dots */}
                    {Object.values(PLANETS_CONFIG).map((planet, idx) => {
                      const radius = 18 + idx * 8;
                      const isSelected = activePlanet === planet.type;
                      return (
                        <g key={planet.type}>
                          {/* Orbit Line */}
                          <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            fill="none"
                            stroke={isSelected ? planet.color : `${activeColor}20`}
                            strokeWidth={isSelected ? '0.75' : '0.5'}
                            strokeDasharray={isSelected ? 'none' : '2 3'}
                            className="transition-colors duration-300"
                          />
                          {/* Rotating Planet Group */}
                          <motion.g
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 15 + idx * 6, ease: 'linear' }}
                            style={{ transformOrigin: '60px 60px' }}
                          >
                            <motion.circle
                              cx={60 + radius}
                              cy="60"
                              r={isSelected ? 3.5 : 1.8}
                              fill={planet.color}
                              animate={isSelected ? { scale: [1, 1.4, 1] } : {}}
                              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                              style={{ filter: isSelected ? `drop-shadow(0 0 4px ${planet.color})` : undefined }}
                            />
                          </motion.g>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Global View Button (Solar System) */}
                  <div className="flex flex-col gap-1">
                    <div
                      onClick={() => {
                        setPlanet(null);
                      }}
                      className="group flex items-center gap-3 cursor-pointer"
                    >
                      <div 
                        className="relative flex items-center justify-center w-8 h-8 rounded-full border bg-teal-950/20 transition-all duration-500"
                        style={{
                          borderColor: !activePlanet ? '#fed7aa' : `${activeColor}25`,
                          boxShadow: !activePlanet ? '0 0 8px rgba(254, 215, 170, 0.4)' : undefined,
                        }}
                      >
                        {!activePlanet && (
                          <motion.div
                            className="absolute inset-0 rounded-full border-t border-b border-transparent"
                            style={{ borderColor: '#fed7aa' }}
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                          />
                        )}
                        <Star className="w-4 h-4 transition-colors duration-300" style={{ color: !activePlanet ? '#fed7aa' : `${activeColor}60` }} />
                      </div>
                      
                      <div className="flex-1 flex flex-col items-start gap-0.5">
                        <span className={`font-cinzel text-xs uppercase tracking-[0.2em] transition-all duration-300 ${!activePlanet ? 'font-bold scale-105 text-[#fed7aa] drop-shadow-[0_0_8px_rgba(254,215,170,0.8)]' : 'text-teal-100/50 group-hover:text-teal-100'}`}>
                          Solar System
                        </span>
                        <span 
                          className="font-mono text-[8px] uppercase tracking-[0.15em] transition-colors duration-300"
                          style={{ color: !activePlanet ? '#fed7aa80' : `${activeColor}40` }}
                        >
                          COORDINATES: CENTRAL
                        </span>
                      </div>
                    </div>
                  </div>

                  {Object.values(PLANETS_CONFIG).map((planet) => {
                    const isSelected = activePlanet === planet.type;
                    const PlanetIcon = getPlanetIcon(planet.type);

                    // Inline helper to compute planet stats
                    const getPlanetTelemetry = (type: PlanetType) => {
                      switch (type) {
                        case 'projects': return `MODS ONLINE: ${projects.length}`;
                        case 'tech_stack': return `TOOL MATRIX: ${Array.from(new Set(techStack.map(t => t.category))).length}`;
                        case 'academics': return `ARCHIVES: ${academics.length}`;
                        case 'socials': return `UPLINKS ACTIVE: ${socials.length}`;
                        case 'resume': return `LOGS COMPILED: 4`;
                        default: return 'TELESCOPE LOCK';
                      }
                    };

                    // Generate sub-items (moons) for the selected planet
                    let subItems: { name: string, slug: string }[] = [];
                    if (isSelected) {
                      if (planet.type === 'projects') subItems = projects.map(p => ({ name: p.title, slug: p.slug }));
                      if (planet.type === 'tech_stack') subItems = Array.from(new Set(techStack.map(t => t.category))).slice(0,4).map(c => ({ name: c, slug: c.toLowerCase() }));
                      if (planet.type === 'academics') subItems = academics.map(a => ({ name: a.degree.split(' ').slice(-2).join(' ') || a.institution.split(' ')[0], slug: `acad-${a.id}` }));
                      if (planet.type === 'socials') subItems = socials.slice(0,4).map(s => ({ name: s.platform, slug: s.platform.toLowerCase() }));
                      if (planet.type === 'resume') {
                        if (resumeExperience.length > 0) subItems.push({ name: 'Experience', slug: 'resume-experience' });
                        if (resumeSkills.length > 0) subItems.push({ name: 'Skills', slug: 'resume-skills' });
                        if (resumeEducation.length > 0) subItems.push({ name: 'Education', slug: 'resume-education' });
                        if (resumeCertifications.length > 0) subItems.push({ name: 'Certifications', slug: 'resume-certifications' });
                      }
                    }

                    return (
                      <div key={planet.type} className="flex flex-col gap-2">
                        <div
                          onClick={() => {
                            setPlanet(planet.type as PlanetType);
                            setViewState(2); // Jump straight into orbit
                          }}
                          className="group flex items-center gap-3 cursor-pointer"
                        >
                          <div 
                            className="relative flex items-center justify-center w-8 h-8 rounded-full border bg-teal-950/20 transition-all duration-500"
                            style={{
                              borderColor: isSelected ? planet.color : `${activeColor}25`,
                              boxShadow: isSelected ? `0 0 8px ${planet.color}40` : undefined,
                            }}
                          >
                            {isSelected && (
                              <motion.div
                                className="absolute inset-0 rounded-full border-t border-b border-transparent"
                                style={{ borderColor: `${planet.color}aa` }}
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                              />
                            )}
                            <PlanetIcon className="w-4 h-4 transition-colors duration-300" style={{ color: isSelected ? planet.color : `${activeColor}60` }} />
                          </div>

                          <div className="flex-1 flex flex-col items-start gap-0.5">
                            <span
                              className={`font-cinzel text-xs uppercase tracking-[0.2em] transition-all duration-300 ${isSelected ? 'font-bold scale-105' : 'text-teal-100/50 group-hover:text-teal-100'}`}
                              style={{
                                color: isSelected ? '#fed7aa' : undefined,
                                textShadow: isSelected ? `0 0 10px ${planet.color}` : undefined
                              }}
                            >
                              {planet.name}
                            </span>
                            <span 
                              className="font-mono text-[8px] uppercase tracking-[0.15em] transition-colors duration-300"
                              style={{ color: isSelected ? `${planet.color}80` : `${activeColor}40` }}
                            >
                              {getPlanetTelemetry(planet.type)}
                            </span>
                          </div>
                        </div>

                        {/* Nested Sub-navigation (Moons) */}
                        <AnimatePresence>
                          {isSelected && subItems.length > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="relative flex flex-col gap-2.5 pl-6 overflow-hidden mb-2 ml-4 border-l pt-1"
                              style={{ borderColor: `${planet.color}30` }}
                            >
                              {subItems.map(item => (
                                <div 
                                  key={item.slug}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    useStore.setState({ activeMoon: item.slug });
                                    setViewState(3);
                                  }}
                                  className="group flex items-center gap-2.5 cursor-pointer py-0.5 relative"
                                >
                                  {/* Horizontal connector line */}
                                  <div className="absolute left-[-24px] w-[16px] h-[1px] transition-colors" style={{ backgroundColor: `${planet.color}30` }} />
                                  <div 
                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeMoon === item.slug ? 'scale-125' : 'group-hover:scale-110'}`} 
                                    style={{ 
                                      backgroundColor: activeMoon === item.slug ? '#fed7aa' : `${planet.color}60`,
                                      boxShadow: activeMoon === item.slug ? `0 0 8px ${planet.color}` : undefined
                                    }}
                                  />
                                  <span 
                                    className="font-cormorant text-[11px] tracking-widest uppercase transition-all duration-300"
                                    style={{ color: activeMoon === item.slug ? '#fed7aa' : `${planet.color}a0` }}
                                  >
                                    {item.name}
                                  </span>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              {/* Bottom Actions */}
              <div className="px-6 pt-4 mt-3 border-t flex flex-col gap-4" style={{ borderColor: `${activeColor}20` }}>
                <button 
                  onClick={() => {
                    import('../utils/audio').then(m => m.audioManager.toggleMute());
                  }}
                  className="flex items-center gap-3 transition-colors cursor-pointer group w-fit"
                  style={{ color: `${activeColor}a0` }}
                >
                  <div className="w-1.5 h-1.5 rounded-full transition-all group-hover:scale-125" style={{ backgroundColor: activeColor }} />
                  <span className="font-cinzel text-[10px] tracking-widest uppercase hover:text-teal-100 transition-colors">Toggle Audio</span>
                </button>
              </div>
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

        {/* RIGHT PANEL */}
        <AnimatePresence>
          {currentState === 2 && activePlanet && planetConfig && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="w-full max-w-sm ml-auto glass-panel pointer-events-auto rounded-xl p-6 mr-4"
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
                <h4 className="font-cormorant text-xs text-teal-200/40 uppercase tracking-[0.2em] mb-3 text-center">
                  Orbiting Datasets
                </h4>

                <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto custom-scrollbar pr-2">
                  {activePlanet === 'projects' && projects.map((p) => (
                    <button
                      key={p.slug}
                      onClick={() => { setViewState(3); useStore.setState({ activeMoon: p.slug }); }}
                      className={`text-left font-cormorant tracking-wide text-sm ${theme.bg} ${theme.bgHover} border ${theme.border} ${theme.borderHover} px-4 py-2.5 rounded text-teal-100/80 ${theme.textHover} transition-all cursor-pointer`}
                    >
                      {p.title}
                    </button>
                  ))}
                  {activePlanet === 'tech_stack' && Array.from(new Set(techStack.map(t => t.category))).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setViewState(3); useStore.setState({ activeMoon: cat.toLowerCase() }); }}
                      className={`text-left font-cormorant tracking-wide text-sm ${theme.bg} ${theme.bgHover} border ${theme.border} ${theme.borderHover} px-4 py-2.5 rounded text-teal-100/80 ${theme.textHover} transition-all cursor-pointer`}
                    >
                      {cat} Array
                    </button>
                  ))}
                  {activePlanet === 'academics' && academics.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => { setViewState(3); useStore.setState({ activeMoon: `acad-${a.id}` }); }}
                      className={`text-left font-cormorant tracking-wide text-sm ${theme.bg} ${theme.bgHover} border ${theme.border} ${theme.borderHover} px-4 py-2.5 rounded text-teal-100/80 ${theme.textHover} transition-all cursor-pointer truncate`}
                    >
                      {a.institution}
                    </button>
                  ))}
                  {activePlanet === 'socials' && socials.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { setViewState(3); useStore.setState({ activeMoon: s.platform.toLowerCase() }); }}
                      className={`text-left font-cormorant tracking-wide text-sm ${theme.bg} ${theme.bgHover} border ${theme.border} ${theme.borderHover} px-4 py-2.5 rounded text-teal-100/80 ${theme.textHover} transition-all cursor-pointer`}
                    >
                      {s.platform} Uplink
                    </button>
                  ))}
                  {activePlanet === 'resume' && [
                    { label: 'Experience', slug: 'resume-experience' },
                    { label: 'Skills', slug: 'resume-skills' },
                    { label: 'Education', slug: 'resume-education' },
                    { label: 'Certifications', slug: 'resume-certifications' },
                  ].map((sec) => (
                    <button
                      key={sec.slug}
                      onClick={() => { setViewState(3); useStore.setState({ activeMoon: sec.slug }); }}
                      className={`text-left font-cormorant tracking-wide text-sm ${theme.bg} ${theme.bgHover} border ${theme.border} ${theme.borderHover} px-4 py-2.5 rounded text-teal-100/80 ${theme.textHover} transition-all cursor-pointer`}
                    >
                      {sec.label}
                    </button>
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
                background: `radial-gradient(circle at top left, ${planetConfig?.color ?? '#a78bfa'}22 0%, rgba(2,8,12,0.92) 100%)`,
                border: `1px solid ${planetConfig?.color ?? '#a78bfa'}55`,
                color: planetConfig?.color ?? '#a78bfa',
                boxShadow: `0 0 24px ${planetConfig?.color ?? '#a78bfa'}30, 0 4px 20px rgba(0,0,0,0.6)`,
                backdropFilter: 'blur(12px)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 50px ${planetConfig?.color ?? '#a78bfa'}70, 0 4px 30px rgba(0,0,0,0.7)`;
                (e.currentTarget as HTMLElement).style.transform = 'scale(1.06)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${planetConfig?.color ?? '#a78bfa'}30, 0 4px 20px rgba(0,0,0,0.6)`;
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              }}
            >
              ⬤ &nbsp; Enter {planetConfig?.name ?? 'Planet'}
            </button>
          </motion.div>
        )}
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
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-cormorant text-[10px] text-teal-200/30 uppercase tracking-[0.25em] text-right"
        >
          {currentState === 0 && 'Target lock: Left Click on any planetary body'}
          {currentState === 1 && 'Hold drag to rotate | Click planet label to enter orbit'}
          {currentState === 2 && 'Select an orbiting moon to initiate surface scan'}
          {currentState === 3 && 'Click ⬤ Enter Planet for the full system view'}
          {currentState === 4 && 'Use mouse to freely pan, zoom, and rotate'}
        </motion.div>
      </div>

    </div>
  );
}
