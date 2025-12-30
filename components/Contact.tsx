import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-background relative border-t border-border">
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16">
          
          {/* About Column */}
          <div>
            <div className="flex items-end gap-4 mb-8">
              <h2 className="text-3xl font-bold tracking-tight">ABOUT_ME</h2>
              <span className="font-mono text-zinc-500 mb-1">/003</span>
            </div>
            <div className="prose prose-invert">
              <p className="text-zinc-400 leading-relaxed mb-4">
                I am an IT specialist focusing on networking and system administration. 
                I specialize in troubleshooting, setting up, and deploying systems to ensure optimal performance.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                Dedicated to maintaining secure, efficient infrastructures and resolving complex technical challenges.
              </p>
            </div>
          </div>

          {/* Contact Column */}
          <div className="md:border-l md:border-border md:pl-16">
            <div className="flex items-end gap-4 mb-8">
              <h2 className="text-3xl font-bold tracking-tight">CONNECT</h2>
            </div>
            
            <div className="flex flex-col gap-6">
              <p className="text-sm font-mono text-zinc-500 uppercase tracking-widest">
                Transmissions
              </p>
              
              <a href="mailto:qdo.thien@outlook.com" className="group flex items-center gap-4 text-zinc-300 hover:text-white transition-colors">
                <div className="p-2 border border-zinc-700 group-hover:border-white transition-colors">
                  <Mail size={18} />
                </div>
                <span className="font-mono text-sm">qdo.thien@outlook.com</span>
              </a>

              <a href="https://github.com/quangdo24" target="_blank" rel="noreferrer" className="group flex items-center gap-4 text-zinc-300 hover:text-white transition-colors">
                <div className="p-2 border border-zinc-700 group-hover:border-white transition-colors">
                  <Github size={18} />
                </div>
                <span className="font-mono text-sm">github.com/quangdo24</span>
              </a>

              <a href="https://linkedin.com/in/doq18" target="_blank" rel="noreferrer" className="group flex items-center gap-4 text-zinc-300 hover:text-white transition-colors">
                <div className="p-2 border border-zinc-700 group-hover:border-white transition-colors">
                  <Linkedin size={18} />
                </div>
                <span className="font-mono text-sm">linkedin.com/in/doq18t</span>
              </a>
            </div>
          </div>

        </div>

        <div className="mt-24 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-zinc-600 text-xs font-mono">
          <p>© 2025 QDO-INFOTECH. ALL RIGHTS RESERVED.</p>
          <p className="mt-2 md:mt-0">SYSTEM STATUS: OPERATIONAL</p>
        </div>
      </div>
    </section>
  );
};