import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { GitHubActivity } from './components/GitHubActivity';
import { Contact } from './components/Contact';

function App() {
  return (
    <div className="min-h-screen bg-background text-stone-100 font-sans selection:bg-accent/30 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <GitHubActivity />
        <Contact />
      </main>
    </div>
  );
}

export default App;
