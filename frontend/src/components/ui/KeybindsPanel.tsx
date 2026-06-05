'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface KeybindsPanelProps {
  onClose: () => void;
}

const KEYBINDS = [
  { key: 'P', action: 'Projects'  },
  { key: 'T', action: 'Tech Stack' },
  { key: 'S', action: 'Socials'   },
  { key: 'A', action: 'Academics' },
  { key: 'R', action: 'Resume'    },
  { key: 'ESC',   action: 'Reset View' },
  { key: 'SPACE', action: 'Free Roam' },
  { key: 'M', action: 'Toggle Audio' },
  { key: 'H', action: 'Toggle UI'    },
  { key: '?', action: 'Show Keybinds' },
];

export default function KeybindsPanel({ onClose }: KeybindsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-24 left-6 z-[200] p-5 rounded-xl pointer-events-auto"
      style={{
        background:       'rgba(2, 8, 12, 0.85)',
        border:           '1px solid rgba(254, 215, 170, 0.15)',
        boxShadow:        '0 8px 32px rgba(0, 0, 0, 0.4)',
        backdropFilter:   'blur(8px)',
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-cinzel text-[#fed7aa] text-sm tracking-widest uppercase">
          Navigation Systems
        </h3>
        <button onClick={onClose} className="text-teal-200/50 hover:text-[#fed7aa] transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
        {KEYBINDS.map(({ key, action }) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <span className="font-cormorant text-teal-100/60 text-xs tracking-wider uppercase">
              {action}
            </span>
            <kbd className="font-mono text-[10px] text-[#fb923c] bg-[#fb923c]/10 px-1.5 py-0.5 rounded border border-[#fb923c]/20">
              {key}
            </kbd>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
