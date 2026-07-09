'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  FolderGit2,
  Cpu,
  GraduationCap,
  Share2,
  FileText,
  ExternalLink,
  Star,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import ViewToggle from '../../components/ViewToggle';
import ScrollCanvas3D from '../../components/ScrollCanvas3D';
import {
  api,
  Project,
  TechStack,
  Academic,
  Social,
  ResumeExperience,
  ResumeSkill,
  ResumeEducation,
  ResumeCertification,
} from '../../utils/api';
import './flat.css';

// ─── Github Icon ────────────────────────────────────────────
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

// ─── Section Config ─────────────────────────────────────────
const SECTIONS = [
  { id: 'hero', name: 'About', color: '#fb923c' },
  { id: 'projects', name: 'Projects', color: '#2dd4bf' },
  { id: 'tech_stack', name: 'Tech Stack', color: '#f59e0b' },
  { id: 'socials', name: 'Socials', color: '#67e8f9' },
  { id: 'academics', name: 'Academics', color: '#ea580c' },
  { id: 'resume', name: 'Resume', color: '#a78bfa' },
] as const;

// ─── Ornamental Divider ─────────────────────────────────────
function OrnamentalDivider({ color }: { color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${color}55)` }} />
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, boxShadow: `0 0 10px ${color}` }} />
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${color}55, transparent)` }} />
    </div>
  );
}

// ─── Scroll Section Wrapper ─────────────────────────────────
function ScrollSection({
  id,
  color,
  reverse,
  containerRef,
  children,
}: {
  id: string;
  color: string;
  reverse?: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: containerRef,
    offset: ['start end', 'end start'],
  });
  
  // Smooth fade in and out for the content overlaid on the 3D scene
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -50]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className="flat-section"
      style={{ padding: '80px 24px', minHeight: '100vh', display: 'flex', alignItems: 'center' }}
    >
      <motion.div
        style={{ opacity, y }}
        className={`relative z-10 max-w-6xl mx-auto w-full flex items-start gap-12 ${reverse ? 'flex-row-reverse' : 'flex-row'}`}
      >
        {/* We leave empty space on one side for the 3D sphere to show clearly */}
        <div className="hidden lg:block flex-1" />
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </motion.div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN PAGE (SCROLL 3D HYBRID)
// ═══════════════════════════════════════════════════════════
export default function FlatPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [techStack, setTechStack] = useState<TechStack[]>([]);
  const [academics, setAcademics] = useState<Academic[]>([]);
  const [socials, setSocials] = useState<Social[]>([]);
  const [experience, setExperience] = useState<ResumeExperience[]>([]);
  const [skills, setSkills] = useState<ResumeSkill[]>([]);
  const [education, setEducation] = useState<ResumeEducation[]>([]);
  const [certifications, setCertifications] = useState<ResumeCertification[]>([]);
  
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track master scroll for the 3D background
  const { scrollYProgress } = useScroll({ container: containerRef });

  useEffect(() => {
    async function load() {
      try {
        const [proj, tech, acad, soc, exp, sk, edu, certs] = await Promise.all([
          api.getProjects().catch(() => []),
          api.getTechStack().catch(() => []),
          api.getAcademics().catch(() => []),
          api.getSocials().catch(() => []),
          api.getResumeExperience().catch(() => []),
          api.getResumeSkills().catch(() => []),
          api.getResumeEducation().catch(() => []),
          api.getResumeCertifications().catch(() => []),
        ]);
        setProjects(proj);
        setTechStack(tech);
        setAcademics(acad);
        setSocials(soc);
        setExperience(exp);
        setSkills(sk);
        setEducation(edu);
        setCertifications(certs);
      } catch (e) {
        console.error('Failed to load data', e);
      } finally {
        setLoaded(true);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5, root: containerRef.current }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [loaded]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#02080c]">
      {/* ── Fixed 3D Canvas Background ──────────────────── */}
      <ScrollCanvas3D scrollYProgress={scrollYProgress} />

      {/* ── Fixed Top Navigation ──────────────────────────── */}
      <nav className="flat-nav relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2.5">
          <h1
            className="font-cinzel text-base tracking-[0.22em] uppercase m-0 leading-none bg-gradient-to-br from-[#fed7aa] via-[#fb923c] to-[#ea580c] text-transparent bg-clip-text cursor-pointer"
            onClick={() => scrollToSection('hero')}
          >
            Functional
          </h1>

          <div className="hidden sm:flex items-center gap-4">
            {SECTIONS.map(({ id, name, color }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="flex items-center gap-2 group cursor-pointer"
                title={name}
              >
                <div
                  className={`flat-nav-dot ${activeSection === id ? 'flat-nav-dot-active' : ''}`}
                  style={{
                    borderColor: activeSection === id ? color : `${color}50`,
                    background: activeSection === id ? color : 'transparent',
                  }}
                />
                <span
                  className="font-cinzel text-[8px] uppercase tracking-[0.15em] transition-all duration-300 hidden md:inline"
                  style={{ color: activeSection === id ? color : `${color}60` }}
                >
                  {name}
                </span>
              </button>
            ))}
          </div>

          <ViewToggle />
        </div>
      </nav>

      {/* ── Scroll Progress Bar (right side) ──────────────── */}
      <div className="scroll-progress-track hidden lg:block z-50 relative">
        <div className="scroll-progress-bg">
          <motion.div
            className="scroll-progress-fill"
            style={{ height: useTransform(scrollYProgress, [0, 1], ['0%', '100%']) }}
          />
        </div>
        {SECTIONS.map(({ id, color }, i) => (
          <div
            key={id}
            className={`scroll-progress-dot ${activeSection === id ? 'scroll-progress-dot-active' : ''}`}
            style={{
              top: `${(i / (SECTIONS.length - 1)) * 100}%`,
              borderColor: color,
              background: activeSection === id ? color : 'rgba(2, 8, 12, 0.8)',
              color,
            }}
            onClick={() => scrollToSection(id)}
          />
        ))}
      </div>

      {/* ── Main Scroll Container ─────────────────────────── */}
      <div ref={containerRef} className="flat-scroll-container relative z-10">

        {/* ════════════════════════════════════════════════════
            SECTION 1: HERO — About Me (Center Aligned)
            ════════════════════════════════════════════════════ */}
        <section id="hero" className="flat-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex flex-col items-center text-center max-w-3xl mx-auto px-6 pt-20"
          >
            <span className="font-cormorant text-[0.66rem] tracking-[0.55em] uppercase text-teal-200/50 mb-4">
              Systems Architect & Developer Portfolio
            </span>
            <h1 className="font-cinzel text-[clamp(2.5rem,6vw,5rem)] tracking-[0.22em] uppercase m-0 leading-none bg-gradient-to-br from-[#fed7aa] via-[#fb923c] to-[#ea580c] text-transparent bg-clip-text mb-4">
              Functional
            </h1>
            <OrnamentalDivider color="#fb923c" />
            <h2 className="font-cinzel uppercase tracking-[0.28em] mt-4 mb-2 text-2xl text-transparent bg-clip-text bg-gradient-to-br from-[#fed7aa] to-[#fb923c]">
              Tanishq
            </h2>
            <p className="font-cormorant text-[0.72rem] tracking-[0.38em] uppercase text-amber-200/40 mb-6">
              Systems Architect &amp; Full-Stack Developer
            </p>
            <p className="font-cormorant text-lg leading-relaxed text-[rgba(254,230,190,0.8)] max-w-xl mb-8">
              I build systems that matter — from high-concurrency backend APIs to immersive 3D interfaces.
              My craft sits at the intersection of <span style={{ color: '#fb923c' }}>engineering precision</span> and{' '}
              <span style={{ color: '#fbbf24' }}>design intuition</span>.
            </p>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-1 text-teal-200/30"
            >
              <span className="font-cormorant text-[0.6rem] uppercase tracking-[0.4em]">Scroll to Explore</span>
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════════════
            SECTION 2: PROJECTS (Right Aligned Overlay)
            ════════════════════════════════════════════════════ */}
        <ScrollSection id="projects" color="#2dd4bf" containerRef={containerRef}>
          <p className="font-cormorant text-[0.7rem] uppercase tracking-[0.4em] text-teal-400/40 mb-1">FunctionalCosmos / Systems</p>
          <h2 className="font-cinzel text-4xl uppercase tracking-[0.15em] bg-gradient-to-r from-[#fed7aa] to-[#2dd4bf] text-transparent bg-clip-text mb-2">
            Projects
          </h2>
          <OrnamentalDivider color="#2dd4bf" />
          
          <div className="flex flex-col gap-4 mt-6">
            {projects.slice(0, 4).map((project) => (
              <Link href={`/project/${project.slug}`} key={project.slug} className="group" style={{ textDecoration: 'none' }}>
                <div className="glass-card-2d p-5 flex items-center justify-between hover:border-teal-500/30 transition-all duration-300 cursor-pointer bg-[#02080c]/60 backdrop-blur-md">
                  <div>
                    <h3 className="font-cinzel text-lg uppercase tracking-wider text-teal-400 group-hover:text-teal-300 transition-colors">{project.title}</h3>
                    <p className="font-cormorant text-sm text-teal-50/50 mt-1 line-clamp-1">{project.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-teal-500/30 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex justify-center md:justify-start">
            <Link href="/planet/projects" style={{ textDecoration: 'none' }}>
              <button className="font-cinzel text-xs uppercase tracking-[0.2em] px-6 py-3 border border-teal-500/40 rounded-full text-teal-300 hover:bg-teal-500/10 hover:text-teal-100 transition-all duration-300">
                View All Projects
              </button>
            </Link>
          </div>
        </ScrollSection>

        {/* ════════════════════════════════════════════════════
            SECTION 3: TECH STACK (Left Aligned Overlay)
            ════════════════════════════════════════════════════ */}
        <ScrollSection id="tech_stack" color="#f59e0b" reverse containerRef={containerRef}>
          <p className="font-cormorant text-[0.7rem] uppercase tracking-[0.4em] text-amber-500/40 mb-1">FunctionalCosmos / Arsenal</p>
          <h2 className="font-cinzel text-4xl uppercase tracking-[0.15em] bg-gradient-to-r from-[#fed7aa] to-[#f59e0b] text-transparent bg-clip-text mb-2">
            Tech Stack
          </h2>
          <OrnamentalDivider color="#f59e0b" />
          
          <div className="flex flex-col gap-4 mt-6">
            {Array.from(new Set(techStack.map((t) => t.category))).slice(0, 4).map((cat) => (
              <div key={cat} className="glass-card-2d p-5 bg-[#02080c]/60 backdrop-blur-md border-amber-500/10">
                <h3 className="font-cinzel text-sm uppercase tracking-wider text-amber-500 mb-3">{cat}</h3>
                <div className="flex flex-wrap gap-2">
                  {techStack.filter(t => t.category === cat).map(tech => (
                    <span key={tech.id} className="font-cormorant text-xs px-3 py-1 rounded-full border border-amber-500/20 text-amber-100/70 bg-amber-950/20">
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollSection>

        {/* ════════════════════════════════════════════════════
            SECTION 4: SOCIALS
            ════════════════════════════════════════════════════ */}
        <ScrollSection id="socials" color="#67e8f9" containerRef={containerRef}>
          <p className="font-cormorant text-[0.7rem] uppercase tracking-[0.4em] text-cyan-300/40 mb-1">FunctionalCosmos / Network</p>
          <h2 className="font-cinzel text-4xl uppercase tracking-[0.15em] bg-gradient-to-r from-[#fed7aa] to-[#67e8f9] text-transparent bg-clip-text mb-2">
            Socials
          </h2>
          <OrnamentalDivider color="#67e8f9" />
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            {socials.map((soc) => (
              <a href={soc.url} target="_blank" rel="noopener noreferrer" key={soc.id} style={{ textDecoration: 'none' }}>
                <div className="glass-card-2d p-5 flex flex-col items-center justify-center gap-3 hover:border-cyan-400/30 transition-all cursor-pointer bg-[#02080c]/60 backdrop-blur-md h-full group">
                  <Share2 className="w-6 h-6 text-cyan-400/50 group-hover:text-cyan-300 transition-colors" />
                  <span className="font-cinzel text-sm uppercase tracking-wider text-teal-50/70 group-hover:text-cyan-100">{soc.platform}</span>
                </div>
              </a>
            ))}
          </div>
        </ScrollSection>

        {/* ════════════════════════════════════════════════════
            SECTION 5: ACADEMICS
            ════════════════════════════════════════════════════ */}
        <ScrollSection id="academics" color="#ea580c" reverse containerRef={containerRef}>
          <p className="font-cormorant text-[0.7rem] uppercase tracking-[0.4em] text-orange-600/40 mb-1">FunctionalCosmos / Foundation</p>
          <h2 className="font-cinzel text-4xl uppercase tracking-[0.15em] bg-gradient-to-r from-[#fed7aa] to-[#ea580c] text-transparent bg-clip-text mb-2">
            Academics
          </h2>
          <OrnamentalDivider color="#ea580c" />

          <div className="flex flex-col gap-4 mt-6">
            {academics.map((acad) => (
              <Link href={`/academic/${acad.id}`} key={acad.id} className="group" style={{ textDecoration: 'none' }}>
                <div className="glass-card-2d p-5 flex items-center justify-between hover:border-orange-500/30 transition-all duration-300 cursor-pointer bg-[#02080c]/60 backdrop-blur-md">
                  <div>
                    <h3 className="font-cinzel text-base uppercase tracking-wider text-orange-500 group-hover:text-orange-400 transition-colors">{acad.institution}</h3>
                    <p className="font-cormorant text-sm text-orange-200/50 mt-1">{acad.degree}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-orange-500/30 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </ScrollSection>

        {/* ════════════════════════════════════════════════════
            SECTION 6: RESUME / EXPERIENCE
            ════════════════════════════════════════════════════ */}
        <ScrollSection id="resume" color="#a78bfa" containerRef={containerRef}>
          <p className="font-cormorant text-[0.7rem] uppercase tracking-[0.4em] text-violet-400/40 mb-1">FunctionalCosmos / Career</p>
          <h2 className="font-cinzel text-4xl uppercase tracking-[0.15em] bg-gradient-to-r from-[#fed7aa] to-[#a78bfa] text-transparent bg-clip-text mb-2">
            Experience
          </h2>
          <OrnamentalDivider color="#a78bfa" />

          <div className="flex flex-col gap-4 mt-6">
            {experience.map((exp) => (
              <Link href={`/experience/${exp.id}`} key={exp.id} className="group" style={{ textDecoration: 'none' }}>
                <div className="glass-card-2d p-5 flex flex-col hover:border-violet-500/30 transition-all duration-300 cursor-pointer bg-[#02080c]/60 backdrop-blur-md">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-cinzel text-base uppercase tracking-wider text-violet-400 group-hover:text-violet-300 transition-colors">{exp.role}</h3>
                    <ArrowRight className="w-4 h-4 text-violet-500/30 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="font-cormorant text-sm text-violet-200/50">{exp.company} • {exp.period}</p>
                </div>
              </Link>
            ))}
          </div>
        </ScrollSection>

      </div>
    </div>
  );
}
