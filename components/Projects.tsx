import React from 'react';
import { Github } from 'lucide-react';
import { Project } from '../types';

const projects: Project[] = [
  {
    id: '1',
    title: 'Coming Soon',
    description: '...',
    tags: [],
    imageUrl: 'https://picsum.photos/seed/tech1/600/400',
    link: '#'
  },
  {
    id: '2',
    title: 'Coming Soon',
    description: '...',
    tags: [],
    imageUrl: 'https://picsum.photos/seed/tech2/600/400',
    link: '#'
  },
  {
    id: '3',
    title: 'Coming Soon',
    description: '..',
    tags: [],
    imageUrl: 'https://picsum.photos/seed/tech3/600/400',
    link: '#'
  }
];

export const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-24 bg-surface relative border-t border-border">
      {/* Background decoration */}
      <div className="absolute top-0 right-10 w-px h-full bg-border opacity-50 hidden md:block" />
      <div className="absolute top-0 left-10 w-px h-full bg-border opacity-50 hidden md:block" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end gap-4 mb-16">
          <h2 className="text-4xl font-bold tracking-tight">PROJECT_INDEX</h2>
          <span className="font-mono text-zinc-500 mb-2">/002</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={project.id} className="group relative bg-background border border-border hover:border-zinc-500 transition-colors duration-300">
              {/* Image Container */}
              <div className="aspect-video w-full overflow-hidden bg-zinc-900 border-b border-border">
                <img 
                  src={project.imageUrl} 
                  alt={project.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 grayscale group-hover:grayscale-0"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold tracking-wide">{project.title}</h3>
                  <span className="font-mono text-xs text-zinc-500">0{index + 1}</span>
                </div>
                
                <p className="text-zinc-400 text-sm leading-relaxed mb-6 h-20">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-zinc-900 border border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-400 font-mono">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 border-t border-border pt-4">
                  <a href={project.link} className="flex items-center gap-2 text-xs font-mono uppercase text-zinc-400 hover:text-white transition-colors">
                    <Github size={14} /> Source
                  </a>
                </div>
              </div>

              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};