import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { AmbientBackground } from './AmbientBackground';
import { Avatar } from './Avatar';
import { siteConfig } from '../siteConfig';

export const Hero: React.FC = () => {
  const firstName = siteConfig.name.split(' ')[0];

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background pt-24 pb-16"
    >
      <AmbientBackground />

      <div className="relative z-10 w-full max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 md:gap-16"
        >
          {/* Text column */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="font-serif text-4xl md:text-6xl font-semibold text-stone-100 mb-6 tracking-tight">
              Hi, I'm {firstName}
            </h1>

            <p className="text-stone-400 text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto md:mx-0">
              {siteConfig.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-10">
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 rounded-full bg-accent text-stone-950 font-medium text-sm hover:bg-accent/90 transition-colors"
              >
                View my projects
              </button>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 rounded-full border border-border text-stone-300 font-medium text-sm hover:border-accent/50 hover:text-white transition-colors"
              >
                Get in touch
              </button>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-5">
              <a
                href={siteConfig.githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="text-stone-500 hover:text-accent transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href={siteConfig.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="text-stone-500 hover:text-accent transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                aria-label="Email"
                className="text-stone-500 hover:text-accent transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Avatar column */}
          <Avatar
            src={siteConfig.avatarSrc}
            name={siteConfig.name}
            size="clamp(16rem, 32vw, 24rem)"
            className="shadow-xl shadow-black/30"
          />
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-stone-600"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowDown size={20} />
      </motion.div>
    </section>
  );
};
