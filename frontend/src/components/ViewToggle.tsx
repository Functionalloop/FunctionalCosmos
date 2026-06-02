'use client';

import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ViewToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const is3D = !pathname.startsWith('/flat');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = (target: '3d' | '2d') => {
    if (target === '2d' && is3D) {
      localStorage.setItem('cosmos-view-mode', '2d');
      router.push('/flat');
    } else if (target === '3d' && !is3D) {
      localStorage.setItem('cosmos-view-mode', '3d');
      router.push('/');
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative flex items-center p-1 rounded-full bg-[#02080c]/80 border border-teal-500/20 backdrop-blur-md">
      <button
        onClick={() => handleToggle('3d')}
        className={`relative px-4 py-1.5 rounded-full font-cinzel text-[9px] uppercase tracking-[0.25em] transition-colors duration-300 z-10 ${
          is3D ? 'text-[#02080c] font-bold' : 'text-teal-400/50 hover:text-teal-300'
        }`}
      >
        {is3D && (
          <motion.div
            layoutId="view-toggle-indicator"
            className="absolute inset-0 bg-gradient-to-r from-[#fed7aa] to-[#fb923c] rounded-full -z-10"
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          />
        )}
        <span className="flex items-center gap-1.5">
          <span className="text-[10px]">◆</span> 3D
        </span>
      </button>

      <button
        onClick={() => handleToggle('2d')}
        className={`relative px-4 py-1.5 rounded-full font-cinzel text-[9px] uppercase tracking-[0.25em] transition-colors duration-300 z-10 ${
          !is3D ? 'text-[#02080c] font-bold' : 'text-teal-400/50 hover:text-teal-300'
        }`}
      >
        {!is3D && (
          <motion.div
            layoutId="view-toggle-indicator"
            className="absolute inset-0 bg-gradient-to-r from-teal-300 to-teal-500 rounded-full -z-10"
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          />
        )}
        <span className="flex items-center gap-1.5">
          <span className="text-[10px]">◇</span> Scroll
        </span>
      </button>
    </div>
  );
}
