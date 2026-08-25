import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  fetchGithubActivity,
  fetchCommitHeatmap,
  describeEvent,
  formatRelativeTime,
  GitHubEvent,
  EventIconKey,
  CommitSummary,
  ContributionDay,
} from '../lib/github';
import { siteConfig } from '../siteConfig';

const INITIAL_VISIBLE = 7;

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

const LEVEL_CLASSES = [
  'bg-stone-800',
  'bg-accent/30',
  'bg-accent/55',
  'bg-accent/80',
  'bg-accent',
] as const;

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface HeatmapCell {
  date: string;
  level: number;
  count: number;
}

const CommitHeatmap: React.FC<{ username: string }> = ({ username }) => {
  const [days, setDays] = useState<ContributionDay[] | null>(null);

  useEffect(() => {
    fetchCommitHeatmap(username).then(setDays);
  }, [username]);

  if (!days) {
    return <div className="h-28 rounded-xl border border-border bg-surface/40 animate-pulse" />;
  }

  if (days.length === 0) {
    return (
      <p className="text-stone-600 text-xs text-center py-4">
        Contribution data unavailable.
      </p>
    );
  }

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 363);
  // Snap to the Sunday of that week
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const dayMap = new Map<string, ContributionDay>(days.map((d) => [d.date, d]));

  const weeks: HeatmapCell[][] = [];
  const cur = new Date(startDate);
  while (cur <= today) {
    const week: HeatmapCell[] = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = cur.toISOString().split('T')[0];
      const dayData = dayMap.get(dateStr);
      week.push({ date: dateStr, level: dayData?.level ?? 0, count: dayData?.count ?? 0 });
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }

  // Build month label positions
  const monthLabels: Array<{ label: string; weekIndex: number }> = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const month = new Date(week[0].date).getMonth();
    if (month !== lastMonth) {
      monthLabels.push({ label: MONTH_NAMES[month], weekIndex: i });
      lastMonth = month;
    }
  });

  const totalContributions = days.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="w-full overflow-x-auto pb-1">
      <div className="inline-flex flex-col gap-1">
        {/* Month labels */}
        <div className="flex gap-[3px] pl-7">
          {weeks.map((_, i) => {
            const ml = monthLabels.find((m) => m.weekIndex === i);
            return (
              <div key={i} className="w-[11px] shrink-0 text-[9px] text-stone-500 overflow-visible whitespace-nowrap">
                {ml ? ml.label : ''}
              </div>
            );
          })}
        </div>

        {/* Day labels + grid */}
        <div className="flex gap-[3px]">
          <div className="flex flex-col gap-[3px] w-6 shrink-0">
            {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((label, i) => (
              <div
                key={i}
                className="h-[11px] text-[9px] text-stone-600 leading-none flex items-center justify-end pr-1"
              >
                {label}
              </div>
            ))}
          </div>

          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <div
                  key={di}
                  className={`w-[11px] h-[11px] rounded-[2px] ${LEVEL_CLASSES[day.level as 0 | 1 | 2 | 3 | 4]} cursor-default transition-opacity hover:opacity-80`}
                  title={`${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-1 pl-7">
          <span className="text-[10px] text-stone-600">
            {totalContributions.toLocaleString()} contributions in the last year
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-stone-600">Less</span>
            {([0, 1, 2, 3, 4] as const).map((level) => (
              <div key={level} className={`w-[11px] h-[11px] rounded-[2px] ${LEVEL_CLASSES[level]}`} />
            ))}
            <span className="text-[10px] text-stone-600">More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const GitHubActivity: React.FC = () => {
  const [events, setEvents] = useState<GitHubEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

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

  const visible = showAll ? described : described.slice(0, INITIAL_VISIBLE);
  const hasMore = described.length > INITIAL_VISIBLE;

  return (
    <section id="activity" className="py-24 bg-background relative border-t border-border">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-14 text-center">
          <p className="text-accent text-xs font-medium tracking-[0.3em] uppercase mb-3">Live from GitHub</p>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-stone-100">Recent Activity</h2>
          <p className="text-stone-500 text-sm mt-3">Automatically updated from my GitHub profile</p>
        </div>

        {/* Commit heatmap */}
        <div className="mb-12 p-5 rounded-2xl border border-border bg-surface/30">
          <p className="text-xs text-stone-500 font-medium mb-4">Contribution activity</p>
          <CommitHeatmap username={siteConfig.githubUsername} />
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
          <>
            <div className="flex flex-col">
              <AnimatePresence initial={false}>
                {visible.map(({ event, description }, index) => {
                  const Icon = iconMap[description.iconKey];
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.3, delay: index < INITIAL_VISIBLE ? index * 0.05 : 0 }}
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
                        {description.commits && description.commits.length > 0 && (
                          <ul className="mt-1.5 flex flex-col gap-0.5">
                            {description.commits.map((c: CommitSummary) => (
                              <li key={c.url} className="flex items-baseline gap-1.5 min-w-0">
                                <span className="text-border shrink-0 text-xs">–</span>
                                <a
                                  href={c.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-stone-500 text-xs leading-relaxed hover:text-stone-300 transition-colors truncate"
                                  title={c.message}
                                >
                                  {c.message}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                        {!description.commits && description.detail && (
                          description.detailUrl ? (
                            <a
                              href={description.detailUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="block text-stone-500 text-xs mt-1 leading-relaxed hover:text-stone-300 transition-colors truncate"
                              title={description.detail}
                            >
                              {description.detail}
                            </a>
                          ) : (
                            <p className="text-stone-500 text-xs mt-1 leading-relaxed truncate" title={description.detail}>
                              {description.detail}
                            </p>
                          )
                        )}
                        <p className="text-stone-600 text-xs mt-1">{formatRelativeTime(event.created_at)}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {hasMore && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowAll((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-accent transition-colors"
                >
                  {showAll ? (
                    <>Show less <ChevronUp size={14} /></>
                  ) : (
                    <>Show {described.length - INITIAL_VISIBLE} more <ChevronDown size={14} /></>
                  )}
                </button>
              </div>
            )}
          </>
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
