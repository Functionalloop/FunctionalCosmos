'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, Star } from 'lucide-react';
import { motion } from 'framer-motion';

// ─── Github Icon ────────────────────────────────────────────
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

import { api, Project } from '../../../utils/api';
import '../../../app/flat/flat.css';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const all = await api.getProjects();
        const found = all.find(p => p.slug === slug);
        if (found) setProject(found);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (slug) load();
  }, [slug]);

  if (loading) {
    return <div className="w-screen h-screen bg-[#02080c] flex items-center justify-center text-teal-400 font-cinzel">Loading Telemetry...</div>;
  }

  if (!project) {
    return (
      <div className="w-screen h-screen bg-[#02080c] flex flex-col items-center justify-center text-teal-400">
        <h1 className="font-cinzel text-2xl mb-4">Project Not Found</h1>
        <button onClick={() => router.push('/flat')} className="font-cinzel text-xs uppercase tracking-widest border border-teal-500/30 px-6 py-2 rounded-full hover:bg-teal-900/20">Return</button>
      </div>
    );
  }

  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden bg-[#02080c] text-teal-50">
      {/* Background Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.1)_0%,transparent_50%)] pointer-events-none" />
      
      {/* Nav */}
      <nav className="relative z-50 max-w-4xl mx-auto px-6 py-8">
        <button 
          onClick={() => router.push('/flat')}
          className="flex items-center gap-2 text-teal-400/60 hover:text-teal-300 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-cinzel text-[10px] uppercase tracking-widest">Back to Hub</span>
        </button>
      </nav>

      {/* Content */}
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-4xl mx-auto px-6 pb-20"
      >
        <span className="font-cormorant text-xs uppercase tracking-[0.4em] text-teal-400/50 mb-2 block">System Profile</span>
        <h1 className="font-cinzel text-4xl md:text-6xl uppercase tracking-wider bg-gradient-to-r from-[#fed7aa] to-[#2dd4bf] text-transparent bg-clip-text mb-6">
          {project.title}
        </h1>

        {/* Links */}
        <div className="flex gap-4 mb-10">
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full border border-teal-500/20 bg-teal-950/20 hover:bg-teal-900/40 hover:border-teal-400/40 transition-all text-teal-300 font-cinzel text-xs uppercase tracking-wider">
              <GithubIcon className="w-4 h-4" /> Source Code
            </a>
          )}
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/20 bg-amber-950/20 hover:bg-amber-900/40 hover:border-amber-400/40 transition-all text-amber-300 font-cinzel text-xs uppercase tracking-wider">
              <ExternalLink className="w-4 h-4" /> Live Deployment
            </a>
          )}
        </div>

        {/* Meta / Tags */}
        <div className="flex flex-wrap gap-2 mb-10">
          {project.tags.split(',').map((tag) => (
            <span key={tag} className="font-cormorant text-sm px-4 py-1 rounded-full border border-teal-500/10 text-teal-100/70 bg-[#02080c]">
              {tag.trim()}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-teal-500/30 via-teal-500/10 to-transparent mb-10" />

        {/* Description */}
        <div className="font-cormorant text-lg md:text-xl leading-relaxed text-teal-50/80 max-w-3xl space-y-6">
          {project.description.split('\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* Placeholder for images or extended info */}
        <div className="mt-16 p-8 border border-teal-500/10 rounded-2xl bg-teal-950/10 flex flex-col items-center justify-center text-center">
          <Star className="w-8 h-8 text-teal-500/30 mb-4" />
          <h3 className="font-cinzel text-lg text-teal-400/70 uppercase tracking-widest mb-2">Architecture Blueprint</h3>
          <p className="font-cormorant text-teal-100/50">Extended media and technical deep-dives can be mounted here.</p>
        </div>

      </motion.main>
    </div>
  );
}
