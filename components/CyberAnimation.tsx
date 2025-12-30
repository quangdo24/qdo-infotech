import React from 'react';
import { motion } from 'framer-motion';

export const CyberAnimation: React.FC = () => {
  // Generate a grid of points
  const gridPoints = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Subtle Hex Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-5" 
        style={{
          backgroundImage: `radial-gradient(#06b6d4 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      />

      {/* Grid Lines - Enhanced Visibility */}
      <div 
        className="absolute inset-0 opacity-20" 
        style={{
          backgroundImage: `linear-gradient(to right, #52525b 1px, transparent 1px), linear-gradient(to bottom, #52525b 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
        }}
      />

      {/* Glowing Nodes */}
      {gridPoints.map((point) => (
        <motion.div
          key={point.id}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
            boxShadow: '0 0 8px 2px rgba(6, 182, 212, 0.3)'
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: point.duration,
            repeat: Infinity,
            delay: point.delay,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Vertical Data Streams */}
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={`stream-${i}`}
          className="absolute w-[1px] bg-gradient-to-b from-transparent via-cyan-500/40 to-transparent"
          style={{
            left: `${20 + i * 20}%`,
            height: '40%',
            top: '-40%'
          }}
          animate={{
            top: ['0%', '100%'],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 5 + i * 2,
            repeat: Infinity,
            ease: "linear",
            delay: i
          }}
        />
      ))}

      {/* Horizontal Scanning Line */}
      <motion.div
        className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
        animate={{
          top: ['0%', '100%'],
          opacity: [0, 0.5, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Rotating Architectural Rings */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-zinc-700/30 rounded-full"
        style={{ width: '45vw', height: '45vw' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-zinc-500 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(255,255,255,0.2)]"></div>
      </motion.div>

       <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-dashed border-cyan-900/40 rounded-full"
        style={{ width: '35vw', height: '35vw' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};