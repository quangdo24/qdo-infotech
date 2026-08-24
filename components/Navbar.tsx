import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NavItem } from '../types';
import { siteConfig } from '../siteConfig';
import { Avatar } from './Avatar';

const navItems: NavItem[] = [
  { label: 'Home', sectionId: 'home' },
  { label: 'Projects', sectionId: 'projects' },
  { label: 'Activity', sectionId: 'activity' },
  { label: 'Contact', sectionId: 'contact' },
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
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => handleScroll('home')} className="flex items-center gap-3 group">
          <Avatar name={siteConfig.name} size={34} />
          <span className="font-serif text-base font-semibold text-stone-100 group-hover:text-accent transition-colors">
            {siteConfig.name}
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleScroll(item.sectionId)}
              className="text-sm text-stone-400 hover:text-accent transition-colors relative group py-2"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-accent transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-stone-400 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="flex flex-col p-6 gap-5">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleScroll(item.sectionId)}
                className="text-left text-sm text-stone-300 hover:text-accent transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
