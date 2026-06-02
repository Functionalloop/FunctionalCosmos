'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Briefcase, TerminalSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { api, ResumeExperience } from '../../../utils/api';
import '../../../app/flat/flat.css';

export default function ExperienceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string, 10);

  const [experience, setExperience] = useState<ResumeExperience | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const all = await api.getResumeExperience();
        const found = all.find(e => e.id === id);
        if (found) setExperience(found);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (!isNaN(id)) load();
  }, [id]);

  if (loading) {
    return <div className="w-screen h-screen bg-[#02080c] flex items-center justify-center text-violet-500 font-cinzel">Loading Logs...</div>;
  }

  if (!experience) {
    return (
      <div className="w-screen h-screen bg-[#02080c] flex flex-col items-center justify-center text-violet-500">
        <h1 className="font-cinzel text-2xl mb-4">Record Not Found</h1>
        <button onClick={() => router.push('/flat')} className="font-cinzel text-xs uppercase tracking-widest border border-violet-500/30 px-6 py-2 rounded-full hover:bg-violet-900/20">Return</button>
      </div>
    );
  }

  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden bg-[#02080c] text-teal-50">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(167,139,250,0.1)_0%,transparent_50%)] pointer-events-none" />
      
      <nav className="relative z-50 max-w-4xl mx-auto px-6 py-8">
        <button 
          onClick={() => router.push('/flat')}
          className="flex items-center gap-2 text-violet-400/60 hover:text-violet-300 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-cinzel text-[10px] uppercase tracking-widest">Back to Hub</span>
        </button>
      </nav>

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-4xl mx-auto px-6 pb-20"
      >
        <div className="flex items-center gap-3 mb-4">
          <Briefcase className="w-6 h-6 text-violet-500/80" />
          <span className="font-cormorant text-xs uppercase tracking-[0.4em] text-violet-400/50 block">Professional Deployment</span>
        </div>
        
        <h1 className="font-cinzel text-4xl md:text-5xl uppercase tracking-wider bg-gradient-to-r from-[#fed7aa] to-[#a78bfa] text-transparent bg-clip-text mb-2">
          {experience.role}
        </h1>
        <h2 className="font-cormorant text-2xl text-[#fed7aa] mb-6">{experience.company}</h2>

        <div className="flex flex-wrap gap-4 mb-6">
          <span className="font-cormorant text-sm px-4 py-1.5 rounded-full border border-violet-500/20 text-violet-200/80 bg-violet-950/30">
            {experience.period}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {experience.tags.split(',').map((tag) => (
            <span key={tag} className="font-cormorant text-sm px-3 py-1 rounded-full border border-violet-500/15 text-violet-300/80 bg-[#02080c]">
              {tag.trim()}
            </span>
          ))}
        </div>

        <div className="w-full h-px bg-gradient-to-r from-violet-500/30 via-violet-500/10 to-transparent mb-10" />

        <div className="font-cormorant text-lg md:text-xl leading-relaxed text-teal-50/80 max-w-3xl space-y-6">
          {experience.description.split('\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="mt-16 p-8 border border-violet-500/10 rounded-2xl bg-violet-950/10 flex flex-col items-center justify-center text-center">
          <TerminalSquare className="w-8 h-8 text-violet-500/30 mb-4" />
          <h3 className="font-cinzel text-lg text-violet-400/70 uppercase tracking-widest mb-2">Impact & Deliverables</h3>
          <p className="font-cormorant text-violet-100/50">Metrics and key achievements logged during this deployment.</p>
        </div>

      </motion.main>
    </div>
  );
}
