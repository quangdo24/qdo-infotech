import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Star, GitFork, Github } from 'lucide-react';
import { fetchGithubRepos, formatRelativeTime, GitHubRepo } from '../lib/github';
import { siteConfig } from '../siteConfig';

const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Go: '#00ADD8',
  Rust: '#dea584',
};

export const Projects: React.FC = () => {
  const [repos, setRepos] = useState<GitHubRepo[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchGithubRepos(siteConfig.githubUsername, siteConfig.projectsLimit)
      .then((data) => {
        if (active) setRepos(data);
      })
      .catch(() => {
        if (active) setError("Couldn't load projects from GitHub right now.");
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="projects" className="py-24 bg-surface relative border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between gap-4 mb-16 flex-wrap">
          <div>
            <p className="text-accent text-xs font-medium tracking-[0.3em] uppercase mb-3">
              What I've been building
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-stone-100">Projects</h2>
          </div>
          <a
            href={`${siteConfig.githubUrl}?tab=repositories`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm text-stone-400 hover:text-accent transition-colors"
          >
            View all on GitHub <ExternalLink size={14} />
          </a>
        </div>

        {error && (
          <div className="text-center text-stone-500 py-12 border border-dashed border-border rounded-2xl">
            <p>{error}</p>
            <a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-accent hover:underline"
            >
              <Github size={16} /> Visit GitHub profile
            </a>
          </div>
        )}

        {!error && !repos && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 rounded-2xl border border-border bg-background/40 animate-pulse" />
            ))}
          </div>
        )}

        {!error && repos && repos.length === 0 && (
          <div className="text-center text-stone-500 py-12 border border-dashed border-border rounded-2xl">
            No public repositories yet — check back soon.
          </div>
        )}

        {!error && repos && repos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo, index) => (
              <motion.a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group flex flex-col justify-between p-6 rounded-2xl border border-border bg-background/60 hover:border-accent/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-stone-100 group-hover:text-accent transition-colors break-all">
                      {repo.name}
                    </h3>
                    <ExternalLink
                      size={16}
                      className="text-stone-600 group-hover:text-accent transition-colors shrink-0 mt-1"
                    />
                  </div>
                  <p className="text-stone-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {repo.description || 'No description provided yet.'}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-stone-500 pt-4 border-t border-border">
                  <div className="flex items-center gap-4">
                    {repo.language && (
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: languageColors[repo.language] || '#78716c' }}
                        />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star size={12} /> {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork size={12} /> {repo.forks_count}
                    </span>
                  </div>
                  <span>{formatRelativeTime(repo.pushed_at)}</span>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
