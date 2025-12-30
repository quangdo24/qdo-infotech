import React from 'react';
import { CyberAnimation } from './CyberAnimation';
import { ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
  return (
    <section id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      <CyberAnimation />
      
      <div className="relative z-10 max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
             <div className="h-[1px] w-12 bg-zinc-600" />
             <span className="font-mono text-zinc-400 text-sm tracking-[0.3em]">SYSTEM ONLINE</span>
             <div className="h-[1px] w-12 bg-zinc-600" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            BUILDING <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500">DIGITAL</span>
            <br />
            INFRASTRUCTURE
          </h1>

          <p className="max-w-lg mx-auto text-zinc-400 font-mono text-sm md:text-base leading-relaxed mb-10">
            IT Specialist specializing in networking and system administration, with experience and interest in AI projects
          </p>

          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 border border-zinc-600 text-zinc-300 font-mono text-xs tracking-widest hover:bg-zinc-800 hover:border-zinc-400 transition-all uppercase"
            >
              Explore Projects
            </button>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-zinc-600"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowDown size={20} />
      </motion.div>
    </section>
  );
};