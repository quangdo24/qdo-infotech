import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import { siteConfig } from '../siteConfig';

export const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-surface relative border-t border-border">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <p className="text-accent text-xs font-medium tracking-[0.3em] uppercase mb-3">Let's connect</p>
        <h2 className="text-3xl md:text-4xl font-serif font-semibold text-stone-100 mb-4">Get in touch</h2>
        <p className="text-stone-400 max-w-lg mx-auto leading-relaxed mb-10">
          Have a project, opportunity, or just want to talk tech? My inbox is always open.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={`mailto:${siteConfig.email}`}
            className="flex items-center gap-3 px-6 py-3 rounded-full bg-accent text-stone-950 font-medium text-sm hover:bg-accent/90 transition-colors"
          >
            <Mail size={16} /> {siteConfig.email}
          </a>
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-5 py-3 rounded-full border border-border text-stone-300 text-sm hover:border-accent/50 hover:text-white transition-colors"
          >
            <Github size={16} /> GitHub
          </a>
          <a
            href={siteConfig.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-5 py-3 rounded-full border border-border text-stone-300 text-sm hover:border-accent/50 hover:text-white transition-colors"
          >
            <Linkedin size={16} /> LinkedIn
          </a>
        </div>

        <div className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-stone-600 text-xs gap-2">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p>Built with React, Tailwind &amp; the GitHub API.</p>
        </div>
      </div>
    </section>
  );
};
