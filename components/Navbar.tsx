import React, { useState } from 'react';
import { Menu, X, Terminal } from 'lucide-react';
import { NavItem } from '../types';

const navItems: NavItem[] = [
  { label: 'HOME', sectionId: 'home' },
  { label: 'PROJECTS', sectionId: 'projects' },
  { label: 'CONTACT', sectionId: 'contact' },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div 
          onClick={() => handleScroll('home')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="p-1 border border-zinc-700 group-hover:border-zinc-500 transition-colors">
            <Terminal size={20} className="text-zinc-400 group-hover:text-zinc-200" />
          </div>
          <span className="font-mono text-sm tracking-widest font-bold">QDO-INFOTECH</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleScroll(item.sectionId)}
              className="font-mono text-xs tracking-[0.2em] text-zinc-400 hover:text-white transition-colors relative group py-2"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-zinc-400 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b border-border">
          <div className="flex flex-col p-6 gap-6">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleScroll(item.sectionId)}
                className="text-left font-mono text-sm tracking-[0.2em] text-zinc-400 hover:text-white border-l-2 border-transparent hover:border-white pl-4 transition-all"
              >
                0{navItems.indexOf(item) + 1}. {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};