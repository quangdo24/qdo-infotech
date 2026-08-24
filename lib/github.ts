// Small helper layer around the public GitHub REST API.
// Used to power the dynamic "Projects" and "Recent Activity" sections.

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  pushed_at: string;
  fork: boolean;
  homepage: string | null;
  topics?: string[];
}

export interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string; url: string };
  payload: Record<string, any>;
}

const API_BASE = 'https://api.github.com';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes, keeps us well under the public rate limit

function getCached<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL_MS) return null;
    return data as T;
  } catch {
    return null;
  }
}

function setCached<T>(key: string, data: T) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // ignore storage errors (e.g. private browsing / storage full)
  }
}

export async function fetchGithubRepos(username: string, limit = 6): Promise<GitHubRepo[]> {
  const cacheKey = `gh-repos-${username}`;
  const cached = getCached<GitHubRepo[]>(cacheKey);
  if (cached) return cached.slice(0, limit);

  const res = await fetch(`${API_BASE}/users/${username}/repos?per_page=100&sort=updated`);
  if (!res.ok) throw new Error(`GitHub repos request failed (${res.status})`);
  const data: GitHubRepo[] = await res.json();

  const sorted = data
    .filter((repo) => !repo.fork)
    .sort((a, b) => {
      if (b.stargazers_count !== a.stargazers_count) return b.stargazers_count - a.stargazers_count;
      return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
    });

  setCached(cacheKey, sorted);
  return sorted.slice(0, limit);
}

export async function fetchGithubActivity(username: string, limit = 8): Promise<GitHubEvent[]> {
  const cacheKey = `gh-events-${username}`;
  const cached = getCached<GitHubEvent[]>(cacheKey);
  if (cached) return cached.slice(0, limit);

  const res = await fetch(`${API_BASE}/users/${username}/events/public?per_page=30`);
  if (!res.ok) throw new Error(`GitHub activity request failed (${res.status})`);
  const data: GitHubEvent[] = await res.json();

  setCached(cacheKey, data);
  return data.slice(0, limit);
}

export function formatRelativeTime(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);

  const units: [string, number][] = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];

  for (const [name, secondsInUnit] of units) {
    const value = Math.floor(seconds / secondsInUnit);
    if (value >= 1) return `${value} ${name}${value > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

export type EventIconKey =
  | 'commit'
  | 'pr'
  | 'issue'
  | 'star'
  | 'fork'
  | 'release'
  | 'create'
  | 'comment';

export interface EventDescription {
  action: string;
  target: string;
  iconKey: EventIconKey;
}

function capitalize(value?: string): string {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function describeEvent(event: GitHubEvent): EventDescription | null {
  const repoName = event.repo.name.split('/').slice(1).join('/') || event.repo.name;

  switch (event.type) {
    case 'PushEvent': {
      const commitCount = event.payload?.commits?.length ?? event.payload?.size ?? 1;
      return {
        action: `Pushed ${commitCount} commit${commitCount === 1 ? '' : 's'} to`,
        target: repoName,
        iconKey: 'commit',
      };
    }
    case 'PullRequestEvent': {
      const action =
        event.payload?.action === 'opened'
          ? 'Opened'
          : event.payload?.action === 'closed'
          ? event.payload?.pull_request?.merged
            ? 'Merged'
            : 'Closed'
          : capitalize(event.payload?.action);
      return { action: `${action} a pull request in`, target: repoName, iconKey: 'pr' };
    }
    case 'IssuesEvent':
      return { action: `${capitalize(event.payload?.action)} an issue in`, target: repoName, iconKey: 'issue' };
    case 'IssueCommentEvent':
      return { action: 'Commented on an issue in', target: repoName, iconKey: 'comment' };
    case 'WatchEvent':
      return { action: 'Starred', target: repoName, iconKey: 'star' };
    case 'ForkEvent':
      return { action: 'Forked', target: repoName, iconKey: 'fork' };
    case 'CreateEvent': {
      const refType = event.payload?.ref_type;
      if (refType === 'repository') return { action: 'Created a new repository', target: repoName, iconKey: 'create' };
      if (refType === 'branch') return { action: `Created branch "${event.payload?.ref}" in`, target: repoName, iconKey: 'create' };
      return { action: 'Created a tag in', target: repoName, iconKey: 'create' };
    }
    case 'ReleaseEvent':
      return {
        action: `Published release ${event.payload?.release?.tag_name ?? ''} for`,
        target: repoName,
        iconKey: 'release',
      };
    case 'PublicEvent':
      return { action: 'Open-sourced', target: repoName, iconKey: 'create' };
    default:
      return null;
  }
}
