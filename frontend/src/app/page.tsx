'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CosmosCanvas from '../components/CosmosCanvas';
import UIOverlay from '../components/UIOverlay';
import { useStore } from '../store/useStore';
import { Compass } from 'lucide-react';

export default function Home() {
  const fetchInitialData = useStore((state) => state.fetchInitialData);
  const loading = useStore((state) => state.loading);
  const projects = useStore((state) => state.projects);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Start fetching data
    fetchInitialData().finally(() => {
      // Keep loader visible for at least 1.5s for branding/smooth transition
      setTimeout(() => {
        setShowIntro(false);
      }, 1500);
    });
  }, [fetchInitialData]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      <AnimatePresence mode="wait">
        {showIntro ? (
          /* Futuristic Loader */
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950"
          >
            <div className="relative flex flex-col items-center gap-4">
              {/* Spinner */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-16 h-16 border-t-2 border-r-2 border-purple-500 border-b border-l border-transparent rounded-full shadow-[0_0_15px_rgba(168,85,247,0.3)]"
              />
              <Compass className="w-6 h-6 text-purple-400 absolute top-5 animate-pulse" />
              
              <div className="flex flex-col items-center gap-1 mt-4">
                <motion.h2 
                  initial={{ letterSpacing: "0.2em", opacity: 0 }}
                  animate={{ letterSpacing: "0.4em", opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="font-mono text-xs uppercase text-slate-400 font-bold ml-1"
                >
                  INITIALIZING COSMOS
                </motion.h2>
                <span className="text-[9px] font-mono text-purple-400/70 tracking-widest uppercase animate-pulse">
                  Scanning stellar endpoints...
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Main Cosmos Application */
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full h-full"
          >
            {/* 3D WebGL Canvas */}
            <CosmosCanvas />
            
            {/* HUD and Information Panels */}
            <UIOverlay />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
