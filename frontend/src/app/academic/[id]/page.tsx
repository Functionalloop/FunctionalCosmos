'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { api, Academic } from '../../../utils/api';
import '../../../app/flat/flat.css';

export default function AcademicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string, 10);

  const [academic, setAcademic] = useState<Academic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const all = await api.getAcademics();
        const found = all.find(a => a.id === id);
        if (found) setAcademic(found);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (!isNaN(id)) load();
  }, [id]);

  if (loading) {
    return <div className="w-screen h-screen bg-[#02080c] flex items-center justify-center text-orange-500 font-cinzel">Loading Archives...</div>;
  }

  if (!academic) {
    return (
      <div className="w-screen h-screen bg-[#02080c] flex flex-col items-center justify-center text-orange-500">
        <h1 className="font-cinzel text-2xl mb-4">Record Not Found</h1>
        <button onClick={() => router.push('/flat')} className="font-cinzel text-xs uppercase tracking-widest border border-orange-500/30 px-6 py-2 rounded-full hover:bg-orange-900/20">Return</button>
      </div>
    );
  }

  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden bg-[#02080c] text-teal-50">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(234,88,12,0.1)_0%,transparent_50%)] pointer-events-none" />
      
      <nav className="relative z-50 max-w-4xl mx-auto px-6 py-8">
        <button 
          onClick={() => router.push('/flat')}
          className="flex items-center gap-2 text-orange-400/60 hover:text-orange-300 transition-colors cursor-pointer group"
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
          <GraduationCap className="w-6 h-6 text-orange-500/80" />
          <span className="font-cormorant text-xs uppercase tracking-[0.4em] text-orange-400/50 block">Academic Record</span>
        </div>
        
        <h1 className="font-cinzel text-4xl md:text-5xl uppercase tracking-wider bg-gradient-to-r from-[#fed7aa] to-[#ea580c] text-transparent bg-clip-text mb-2">
          {academic.institution}
        </h1>
        <h2 className="font-cormorant text-2xl text-[#fed7aa] mb-6">{academic.degree} {academic.major && `— ${academic.major}`}</h2>

        <div className="flex flex-wrap gap-4 mb-10">
          <span className="font-cormorant text-sm px-4 py-1.5 rounded-full border border-orange-500/20 text-orange-200/80 bg-orange-950/30">
            {academic.start_date} — {academic.end_date}
          </span>
          {academic.gpa && (
            <span className="font-cormorant text-sm px-4 py-1.5 rounded-full border border-orange-500/20 text-orange-200/80 bg-orange-950/30">
              GPA / Score: <span className="text-orange-400">{academic.gpa}</span>
            </span>
          )}
        </div>

        <div className="w-full h-px bg-gradient-to-r from-orange-500/30 via-orange-500/10 to-transparent mb-10" />

        <div className="font-cormorant text-lg md:text-xl leading-relaxed text-teal-50/80 max-w-3xl space-y-6">
          {academic.description ? academic.description.split('\n').map((para, i) => (
            <p key={i}>{para}</p>
          )) : (
            <p className="italic text-teal-50/40">No extended description available.</p>
          )}
        </div>

        <div className="mt-16 p-8 border border-orange-500/10 rounded-2xl bg-orange-950/10 flex flex-col items-center justify-center text-center">
          <BookOpen className="w-8 h-8 text-orange-500/30 mb-4" />
          <h3 className="font-cinzel text-lg text-orange-400/70 uppercase tracking-widest mb-2">Coursework & Research</h3>
          <p className="font-cormorant text-orange-100/50">Additional academic artifacts can be documented here.</p>
        </div>

      </motion.main>
    </div>
  );
}
