'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const isCursorActive = useStore((state) => state.isCursorActive);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center mix-blend-difference"
      animate={{
        x: mousePosition.x - 12,
        y: mousePosition.y - 12,
        scale: isCursorActive ? 1.5 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 800,
        damping: 40,
        mass: 0.5,
      }}
      style={{
        width: '24px',
        height: '24px',
      }}
    >
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 rounded-full border"
        animate={{
          borderColor: isCursorActive ? 'rgba(251, 146, 60, 0.8)' : 'rgba(255, 255, 255, 0.4)',
          borderWidth: isCursorActive ? '2px' : '1px',
          scale: isCursorActive ? 1.2 : 1,
        }}
        transition={{ duration: 0.2 }}
      />
      {/* Center dot */}
      <motion.div
        className="rounded-full"
        animate={{
          backgroundColor: isCursorActive ? 'rgba(251, 146, 60, 1)' : 'rgba(255, 255, 255, 1)',
          width: isCursorActive ? '6px' : '4px',
          height: isCursorActive ? '6px' : '4px',
        }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Crosshairs */}
      <motion.div 
        className="absolute w-[2px] h-[6px] top-[-4px]" 
        animate={{ backgroundColor: isCursorActive ? 'rgba(251, 146, 60, 0.8)' : 'transparent' }}
      />
      <motion.div 
        className="absolute w-[2px] h-[6px] bottom-[-4px]" 
        animate={{ backgroundColor: isCursorActive ? 'rgba(251, 146, 60, 0.8)' : 'transparent' }}
      />
      <motion.div 
        className="absolute w-[6px] h-[2px] left-[-4px]" 
        animate={{ backgroundColor: isCursorActive ? 'rgba(251, 146, 60, 0.8)' : 'transparent' }}
      />
      <motion.div 
        className="absolute w-[6px] h-[2px] right-[-4px]" 
        animate={{ backgroundColor: isCursorActive ? 'rgba(251, 146, 60, 0.8)' : 'transparent' }}
      />
    </motion.div>
  );
}
