import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  GitCommit,
  GitPullRequest,
  GitFork,
  Star,
  Tag,
  FolderPlus,
  MessageSquare,
  CircleDot,
  ExternalLink,
} from 'lucide-react';
import {
  fetchGithubActivity,
  describeEvent,
  formatRelativeTime,
  GitHubEvent,
  EventIconKey,
} from '../lib/github';
import { siteConfig } from '../siteConfig';

const iconMap: Record<EventIconKey, React.ComponentType<{ size?: number; className?: string }>> = {
  commit: GitCommit,
  pr: GitPullRequest,
  issue: CircleDot,
  star: Star,
  fork: GitFork,
  release: Tag,
  create: FolderPlus,
  comment: MessageSquare,
};

export const GitHubActivity: React.FC = () => {
  const [events, setEvents] = useState<GitHubEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchGithubActivity(siteConfig.githubUsername, siteConfig.activityLimit)
      .then((data) => {
        if (active) setEvents(data);
      })
      .catch(() => {
        if (active) setError("Couldn't load recent activity right now.");
      });
    return () => {
      active = false;
    };
  }, []);

  const described = (events ?? [])
    .map((event) => ({ event, description: describeEvent(event) }))
    .filter(
      (item): item is { event: GitHubEvent; description: NonNullable<ReturnType<typeof describeEvent>> } =>
        item.description !== null
    );

  return (
    <section id="activity" className="py-24 bg-background relative border-t border-border">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-14 text-center">
          <p className="text-accent text-xs font-medium tracking-[0.3em] uppercase mb-3">Live from GitHub</p>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-stone-100">Recent Activity</h2>
          <p className="text-stone-500 text-sm mt-3">Automatically updated from my GitHub profile</p>
        </div>

        {error && (
          <div className="text-center text-stone-500 py-12 border border-dashed border-border rounded-2xl">
            {error}
          </div>
        )}

        {!error && !events && (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl border border-border bg-surface/40 animate-pulse" />
            ))}
          </div>
        )}

        {!error && events && described.length === 0 && (
          <div className="text-center text-stone-500 py-12 border border-dashed border-border rounded-2xl">
            No recent public activity — check back soon.
          </div>
        )}

        {!error && described.length > 0 && (
          <div className="flex flex-col">
            {described.map(({ event, description }, index) => {
              const Icon = iconMap[description.iconKey];
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="flex items-start gap-4 py-4 border-b border-border last:border-b-0"
                >
                  <div className="mt-0.5 p-2 rounded-full bg-surface border border-border text-accent shrink-0">
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-stone-300 text-sm">
                      {description.action}{' '}
                      <a
                        href={`https://github.com/${event.repo.name}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-stone-100 font-medium hover:text-accent transition-colors break-all"
                      >
                        {description.target}
                      </a>
                    </p>
                    <p className="text-stone-600 text-xs mt-1">{formatRelativeTime(event.created_at)}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-10">
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-accent transition-colors"
          >
            See full activity on GitHub <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  );
};
