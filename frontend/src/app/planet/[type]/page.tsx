'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink, Star, Share2, GraduationCap, Cpu, FolderGit2, FileText } from 'lucide-react';
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
} from '../../../utils/api';
import { audioManager } from '../../../utils/audio';

// --- Types ---
type PlanetType = 'projects' | 'tech_stack' | 'socials' | 'academics' | 'resume';

// --- Theme config per planet ---
const PLANET_THEMES: Record<PlanetType, {
  name: string;
  color: string;
  accent: string;
  glow: string;
  bg: string;
  border: string;
  textClass: string;
  Icon: any;
  description: string;
}> = {
  projects: {
    name: 'Projects',
    color: '#2dd4bf',
    accent: 'rgba(45,212,191,0.12)',
    glow: 'rgba(45,212,191,0.5)',
    bg: 'rgba(2,8,12,0.85)',
    border: 'rgba(45,212,191,0.18)',
    textClass: '#2dd4bf',
    Icon: FolderGit2,
    description: 'A constellation of engineered experiences — software projects spanning systems, interfaces, and intelligence.',
  },
  tech_stack: {
    name: 'Tech Stack',
    color: '#f59e0b',
    accent: 'rgba(245,158,11,0.12)',
    glow: 'rgba(245,158,11,0.5)',
    bg: 'rgba(2,8,12,0.85)',
    border: 'rgba(245,158,11,0.18)',
    textClass: '#f59e0b',
    Icon: Cpu,
    description: 'The technological arsenal — languages, frameworks, and tools that power the systems.',
  },
  academics: {
    name: 'Academics',
    color: '#ea580c',
    accent: 'rgba(234,88,12,0.12)',
    glow: 'rgba(234,88,12,0.5)',
    bg: 'rgba(2,8,12,0.85)',
    border: 'rgba(234,88,12,0.18)',
    textClass: '#ea580c',
    Icon: GraduationCap,
    description: 'Academic foundations and the institutions that shaped the architecture of thought.',
  },
  socials: {
    name: 'Socials',
    color: '#67e8f9',
    accent: 'rgba(103,232,249,0.12)',
    glow: 'rgba(103,232,249,0.5)',
    bg: 'rgba(2,8,12,0.85)',
    border: 'rgba(103,232,249,0.18)',
    textClass: '#67e8f9',
    Icon: Share2,
    description: 'Communication channels and digital presence — connect across the network.',
  },
  resume: {
    name: 'Resume',
    color: '#a78bfa',
    accent: 'rgba(167,139,250,0.12)',
    glow: 'rgba(167,139,250,0.5)',
    bg: 'rgba(2,8,12,0.85)',
    border: 'rgba(167,139,250,0.18)',
    textClass: '#a78bfa',
    Icon: FileText,
    description: 'A complete record of professional experience, skills, education, and certifications.',
  },
};

// --- Ornamental Divider ---
function OrnamentalDivider({ color }: { color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${color}55)` }} />
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, boxShadow: `0 0 10px ${color}` }} />
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${color}55, transparent)` }} />
    </div>
  );
}

// --- Github Icon ---
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

// =====================================================================
// SECTION COMPONENTS
// =====================================================================

function ProjectsSection({ projects, theme }: { projects: Project[]; theme: typeof PLANET_THEMES['projects'] }) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}
            style={{
              background: `radial-gradient(circle at top left, ${theme.accent} 0%, rgba(2,8,12,0.95) 100%)`,
              border: `1px solid ${theme.border}`,
              borderRadius: 16,
              padding: '28px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Glow corner */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: 60, height: 60, background: `radial-gradient(circle, ${theme.accent} 0%, transparent 70%)` }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
              <h3 style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '1.1rem', color: theme.color, textShadow: `0 0 15px ${theme.glow}`, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                {project.title}
              </h3>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                    style={{ padding: '6px', borderRadius: '50%', border: `1px solid ${theme.border}`, color: theme.color, display: 'flex', transition: 'all 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = theme.accent)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <GithubIcon />
                  </a>
                )}
                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                    style={{ padding: '6px', borderRadius: '50%', border: `1px solid ${theme.border}`, color: theme.color, display: 'flex', transition: 'all 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = theme.accent)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <ExternalLink size={20} />
                  </a>
                )}
              </div>
            </div>

            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: 'rgba(240,253,250,0.7)', lineHeight: 1.6, marginBottom: 16 }}>
              {project.description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {project.tags.split(',').map((tag) => (
                <span key={tag} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.75rem', padding: '3px 12px', background: theme.accent, border: `1px solid ${theme.border}`, color: theme.color, borderRadius: 999, letterSpacing: '0.1em' }}>
                  {tag.trim()}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TechStackSection({ techStack, theme }: { techStack: TechStack[]; theme: typeof PLANET_THEMES['tech_stack'] }) {
  const categories = Array.from(new Set(techStack.map(t => t.category)));
  return (
    <div>
      {categories.map((cat, ci) => (
        <motion.div key={cat} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + ci * 0.08 }} style={{ marginBottom: 40 }}>
          <h3 style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '0.85rem', color: theme.color, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: 16, textShadow: `0 0 12px ${theme.glow}` }}>
            {cat}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {techStack.filter(t => t.category === cat).map((tech, i) => (
              <motion.div key={tech.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.05 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: theme.accent, border: `1px solid ${theme.border}`, borderRadius: 10 }}>
                <div>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.05rem', color: 'rgba(240,253,250,0.9)', margin: 0 }}>{tech.name}</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.68rem', color: 'rgba(240,253,250,0.35)', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '2px 0 0 0' }}>{tech.category}</p>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} size={12} style={{ color: idx < tech.proficiency ? theme.color : 'rgba(240,253,250,0.1)', fill: idx < tech.proficiency ? theme.color : 'transparent' }} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function AcademicsSection({ academics, theme }: { academics: Academic[]; theme: typeof PLANET_THEMES['academics'] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {academics.map((acad, i) => (
        <motion.div key={acad.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}
          style={{ background: `radial-gradient(circle at top right, ${theme.accent} 0%, rgba(2,8,12,0.95) 100%)`, border: `1px solid ${theme.border}`, borderRadius: 16, padding: '32px' }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.75rem', color: theme.color, border: `1px solid ${theme.border}`, padding: '3px 14px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            {acad.start_date} — {acad.end_date}
          </span>
          <h3 style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '1.3rem', color: theme.color, textShadow: `0 0 15px ${theme.glow}`, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '16px 0 6px 0' }}>
            {acad.institution}
          </h3>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: '#fed7aa', margin: '0 0 4px 0' }}>{acad.degree}</p>
          {acad.major && <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.9rem', color: 'rgba(240,253,250,0.6)', margin: '0 0 4px 0' }}>Major in {acad.major}</p>}
          {acad.gpa && <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.8rem', color: 'rgba(240,253,250,0.4)', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0 0 16px 0' }}>GPA / Score: {acad.gpa}</p>}
          {acad.description && <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: 'rgba(240,253,250,0.7)', lineHeight: 1.7, margin: 0 }}>{acad.description}</p>}
        </motion.div>
      ))}
    </div>
  );
}

function SocialsSection({ socials, theme }: { socials: Social[]; theme: typeof PLANET_THEMES['socials'] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
      {socials.map((soc, i) => (
        <motion.a key={soc.id} href={soc.url} target="_blank" rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.07 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px', background: theme.accent, border: `1px solid ${theme.border}`, borderRadius: 14, textDecoration: 'none', cursor: 'pointer', transition: 'all 0.3s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${theme.glow}`; (e.currentTarget as HTMLElement).style.borderColor = theme.color; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.borderColor = theme.border; }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Share2 size={22} style={{ color: theme.color }} />
            <span style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '1rem', color: 'rgba(240,253,250,0.9)', letterSpacing: '0.1em' }}>{soc.platform}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.75rem', color: theme.color, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Connect</span>
            <ExternalLink size={14} style={{ color: theme.color }} />
          </div>
        </motion.a>
      ))}
    </div>
  );
}

function ResumeSection({
  experience, skills, education, certifications, theme
}: {
  experience: ResumeExperience[];
  skills: ResumeSkill[];
  education: ResumeEducation[];
  certifications: ResumeCertification[];
  theme: typeof PLANET_THEMES['resume'];
}) {
  const skillCategories = Array.from(new Set(skills.map(s => s.category)));
  const badgeMap: Record<string, string> = {
    cloud: '☁️', atom: '⚛️', shield: '🛡️', docker: '🐳', database: '🗄️',
  };

  return (
    <div>
      {/* Experience */}
      <section style={{ marginBottom: 60 }}>
        <h2 style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '1.4rem', color: theme.color, textShadow: `0 0 18px ${theme.glow}`, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 4 }}>
          Experience
        </h2>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.8rem', color: 'rgba(167,139,250,0.4)', textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: 24 }}>
          Professional Work History
        </p>
        <OrnamentalDivider color={theme.color} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {experience.map((exp, i) => (
            <motion.div key={exp.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
              style={{ background: theme.accent, border: `1px solid ${theme.border}`, borderRadius: 14, padding: '24px 28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 6 }}>
                <h3 style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '1rem', color: theme.color, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{exp.role}</h3>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.8rem', color: 'rgba(167,139,250,0.45)', whiteSpace: 'nowrap', flexShrink: 0 }}>{exp.period}</span>
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.8rem', color: 'rgba(167,139,250,0.55)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>{exp.company}</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: 'rgba(240,253,250,0.75)', lineHeight: 1.65, marginBottom: 14 }}>{exp.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {exp.tags.split(',').map(t => (
                  <span key={t} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.75rem', padding: '2px 12px', background: theme.accent, border: `1px solid ${theme.border}`, color: theme.color, borderRadius: 999 }}>{t.trim()}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section style={{ marginBottom: 60 }}>
        <h2 style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '1.4rem', color: theme.color, textShadow: `0 0 18px ${theme.glow}`, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 4 }}>
          Skills
        </h2>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.8rem', color: 'rgba(167,139,250,0.4)', textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: 24 }}>
          Technical Proficiency Matrix
        </p>
        <OrnamentalDivider color={theme.color} />
        {skillCategories.map((cat, ci) => (
          <motion.div key={cat} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + ci * 0.07 }} style={{ marginBottom: 28 }}>
            <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.8rem', color: theme.color, textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: 12 }}>{cat}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
              {skills.filter(s => s.category === cat).map((sk) => (
                <div key={sk.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: theme.accent, border: `1px solid ${theme.border}`, borderRadius: 10 }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.95rem', color: 'rgba(240,253,250,0.85)' }}>{sk.name}</span>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <div key={idx} style={{ width: 8, height: 8, borderRadius: '50%', background: idx < sk.level ? theme.color : 'rgba(167,139,250,0.15)', boxShadow: idx < sk.level ? `0 0 6px ${theme.color}` : 'none' }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </section>

      {/* Education */}
      <section style={{ marginBottom: 60 }}>
        <h2 style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '1.4rem', color: theme.color, textShadow: `0 0 18px ${theme.glow}`, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 4 }}>
          Education
        </h2>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.8rem', color: 'rgba(167,139,250,0.4)', textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: 24 }}>
          Academic Background
        </p>
        <OrnamentalDivider color={theme.color} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {education.map((ed, i) => (
            <motion.div key={ed.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
              style={{ background: theme.accent, border: `1px solid ${theme.border}`, borderRadius: 14, padding: '24px 28px' }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.75rem', color: theme.color, border: `1px solid ${theme.border}`, padding: '2px 12px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{ed.period}</span>
              <h3 style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '1rem', color: theme.color, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '14px 0 4px 0' }}>{ed.institution}</h3>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: '#fed7aa', margin: '0 0 4px 0' }}>{ed.degree}</p>
              {ed.gpa && <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.78rem', color: 'rgba(167,139,250,0.4)', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0 0 10px 0' }}>GPA / Score: {ed.gpa}</p>}
              {ed.description && <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: 'rgba(240,253,250,0.7)', lineHeight: 1.65, margin: 0 }}>{ed.description}</p>}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section>
        <h2 style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '1.4rem', color: theme.color, textShadow: `0 0 18px ${theme.glow}`, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 4 }}>
          Certifications
        </h2>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.8rem', color: 'rgba(167,139,250,0.4)', textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: 24 }}>
          Credentials &amp; Achievements
        </p>
        <OrnamentalDivider color={theme.color} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {certifications.map((cert, i) => (
            <motion.div key={cert.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.07 }}
              style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '18px 24px', background: theme.accent, border: `1px solid ${theme.border}`, borderRadius: 14 }}>
              <span style={{ fontSize: '2rem' }}>{cert.badge ? (badgeMap[cert.badge] ?? cert.badge) : '🏅'}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '0.85rem', color: theme.color, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{cert.name}</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.78rem', color: 'rgba(167,139,250,0.45)', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '3px 0 0 0' }}>{cert.issuer}</p>
              </div>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.8rem', color: theme.color, border: `1px solid ${theme.border}`, padding: '2px 12px', borderRadius: 999 }}>{cert.year}</span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

// =====================================================================
// MAIN PAGE
// =====================================================================

export default function PlanetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawType = params?.type as string;
  const planetType = rawType as PlanetType;
  const theme = PLANET_THEMES[planetType] ?? PLANET_THEMES.projects;

  const [pageVisible, setPageVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  // Data state
  const [projects, setProjects] = useState<Project[]>([]);
  const [techStack, setTechStack] = useState<TechStack[]>([]);
  const [academics, setAcademics] = useState<Academic[]>([]);
  const [socials, setSocials] = useState<Social[]>([]);
  const [experience, setExperience] = useState<ResumeExperience[]>([]);
  const [skills, setSkills] = useState<ResumeSkill[]>([]);
  const [education, setEducation] = useState<ResumeEducation[]>([]);
  const [certifications, setCertifications] = useState<ResumeCertification[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Fade in from black
  useEffect(() => {
    const t = setTimeout(() => setPageVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Audio adjustments for detail page
  useEffect(() => {
    audioManager.enterPlanetSurface();
    return () => {
      audioManager.leavePlanetSurface();
    };
  }, []);

  // Fetch data for this planet type
  useEffect(() => {
    async function load() {
      try {
        if (planetType === 'projects') {
          const data = await api.getProjects();
          setProjects(data);
        } else if (planetType === 'tech_stack') {
          const data = await api.getTechStack();
          setTechStack(data);
        } else if (planetType === 'academics') {
          const data = await api.getAcademics();
          setAcademics(data);
        } else if (planetType === 'socials') {
          const data = await api.getSocials();
          setSocials(data);
        } else if (planetType === 'resume') {
          const [exp, sk, edu, certs] = await Promise.all([
            api.getResumeExperience(),
            api.getResumeSkills(),
            api.getResumeEducation(),
            api.getResumeCertifications(),
          ]);
          setExperience(exp);
          setSkills(sk);
          setEducation(edu);
          setCertifications(certs);
        }
      } catch (e) {
        console.error('Failed to load planet data', e);
      } finally {
        setLoaded(true);
      }
    }
    load();
  }, [planetType]);

  const handleReturn = () => {
    setLeaving(true);
    setTimeout(() => {
      router.push('/');
    }, 600);
  };

  const { Icon } = theme;

  return (
    <>
      {/* Page fade-in/out wrapper — natural block flow, scrolls with the page */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: leaving ? 0 : (pageVisible ? 1 : 0) }}
        transition={{ duration: leaving ? 0.5 : 0.8, ease: 'easeOut' }}
        style={{
          minHeight: '100vh',
          background: '#020a0c',
          color: 'rgba(240,253,250,0.85)',
          position: 'relative',
        }}
      >
        {/* ---- ANIMATED SPACE BACKGROUND ---- */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {/* Deep nebula gradients */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(ellipse 60% 50% at 20% 30%, ${theme.accent} 0%, transparent 60%),
                          radial-gradient(ellipse 40% 35% at 80% 70%, rgba(2,8,12,0) 0%, transparent 70%),
                          radial-gradient(ellipse 80% 80% at 50% 50%, rgba(5,15,20,1) 0%, #020a0c 100%)`,
          }} />
          {/* Planet color nebula bloom */}
          <div style={{
            position: 'absolute',
            top: '-10%', right: '-5%',
            width: '45vw', height: '45vw',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${theme.accent} 0%, transparent 70%)`,
            filter: 'blur(60px)',
            opacity: 0.7,
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-5%', left: '-8%',
            width: '35vw', height: '35vw',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${theme.accent} 0%, transparent 70%)`,
            filter: 'blur(80px)',
            opacity: 0.5,
          }} />
          {/* Static star field via CSS */}
          <div className="starfield-bg" />
          {/* Vignette */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 65% 55% at 50% 50%, transparent 30%, rgba(2,10,14,0.8) 100%)',
          }} />
        </div>

        {/* ---- CONTENT ---- */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '40px 24px 100px' }}>

          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={handleReturn}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '0.8rem', letterSpacing: '0.25em', textTransform: 'uppercase',
              color: theme.color, cursor: 'pointer',
              background: theme.accent,
              border: `1px solid ${theme.border}`,
              borderRadius: 999, padding: '8px 20px',
              marginBottom: 48,
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 20px ${theme.glow}`)}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
          >
            <ArrowLeft size={14} />
            Return to Cosmos
          </motion.button>

          {/* Hero Header */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: `radial-gradient(circle, ${theme.color} 0%, ${theme.accent} 100%)`,
                boxShadow: `0 0 30px ${theme.glow}, 0 0 60px ${theme.accent}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={24} style={{ color: '#020a0c' }} />
              </div>
              <div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.7rem', color: 'rgba(240,253,250,0.35)', textTransform: 'uppercase', letterSpacing: '0.4em', margin: 0 }}>
                  FunctionalCosmos / Planetary Body
                </p>
                <h1 style={{
                  fontFamily: "'Cinzel Decorative', serif",
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  background: `linear-gradient(135deg, #fed7aa, ${theme.color})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: 'none',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  margin: '4px 0 0 0',
                  lineHeight: 1.1,
                }}>
                  {theme.name}
                </h1>
              </div>
            </div>

            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: 'rgba(240,253,250,0.55)', lineHeight: 1.7, maxWidth: 680, marginBottom: 0 }}>
              {theme.description}
            </p>
          </motion.div>

          <OrnamentalDivider color={theme.color} />

          {/* Content Sections */}
          <AnimatePresence>
            {!loaded ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '80px 0' }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  style={{ width: 44, height: 44, border: `2px solid ${theme.border}`, borderTopColor: theme.color, borderRadius: '50%' }}
                />
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.8rem', color: 'rgba(240,253,250,0.3)', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                  Scanning stellar data...
                </p>
              </motion.div>
            ) : (
              <motion.div key="content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                {planetType === 'projects' && <ProjectsSection projects={projects} theme={theme} />}
                {planetType === 'tech_stack' && <TechStackSection techStack={techStack} theme={theme} />}
                {planetType === 'academics' && <AcademicsSection academics={academics} theme={theme} />}
                {planetType === 'socials' && <SocialsSection socials={socials} theme={theme} />}
                {planetType === 'resume' && <ResumeSection experience={experience} skills={skills} education={education} certifications={certifications} theme={theme} />}
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Bottom Return Button (sticky) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: pageVisible ? 1 : 0, y: pageVisible ? 0 : 20 }}
          transition={{ delay: 1 }}
          style={{
            position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
            zIndex: 100,
          }}
        >
          <button
            onClick={handleReturn}
            style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: '0.7rem', letterSpacing: '0.35em', textTransform: 'uppercase',
              color: theme.color,
              background: 'rgba(2,8,12,0.85)',
              border: `1px solid ${theme.border}`,
              backdropFilter: 'blur(12px)',
              borderRadius: 999,
              padding: '10px 28px',
              cursor: 'pointer',
              boxShadow: `0 0 20px ${theme.accent}, 0 4px 30px rgba(0,0,0,0.5)`,
              display: 'flex', alignItems: 'center', gap: 10,
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 40px ${theme.glow}, 0 4px 30px rgba(0,0,0,0.5)`)}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 0 20px ${theme.accent}, 0 4px 30px rgba(0,0,0,0.5)`)}
          >
            <ArrowLeft size={14} />
            Return to Cosmos
          </button>
        </motion.div>
      </motion.div>
    </>
  );
}
