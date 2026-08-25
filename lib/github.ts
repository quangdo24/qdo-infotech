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

// Fetch the most recent commits for a repo and turn each into a synthetic PushEvent
// so they slot into the same rendering pipeline.
async function fetchRepoCommitEvents(
  repoFullName: string,
  author: string,
  perRepo = 5,
): Promise<GitHubEvent[]> {
  try {
    const res = await fetch(
      `${API_BASE}/repos/${repoFullName}/commits?author=${author}&per_page=${perRepo}`,
    );
    if (!res.ok) return [];
    const commits: any[] = await res.json();
    return commits.map((c) => ({
      id: c.sha,
      type: 'PushEvent',
      created_at: c.commit?.author?.date ?? c.commit?.committer?.date ?? '',
      repo: {
        name: repoFullName,
        url: `https://api.github.com/repos/${repoFullName}`,
      },
      payload: {
        commits: [
          {
            sha: c.sha,
            message: c.commit?.message ?? '',
            url: c.html_url,
          },
        ],
        size: 1,
        head: c.sha,
        ref: 'refs/heads/main',
      },
    }));
  } catch {
    return [];
  }
}

export async function fetchGithubActivity(username: string, limit = 10): Promise<GitHubEvent[]> {
  const cacheKey = `gh-events-${username}-v2`;
  const cached = getCached<GitHubEvent[]>(cacheKey);
  if (cached) return cached.slice(0, limit);

  // 1. Fetch all public non-fork repos sorted by most recently pushed.
  const reposRes = await fetch(
    `${API_BASE}/users/${username}/repos?per_page=100&sort=pushed`,
  );
  const allRepos: GitHubRepo[] = reposRes.ok ? await reposRes.json() : [];
  const activeRepos = allRepos
    .filter((r) => !r.fork)
    .slice(0, 10); // cap at 10 repos to stay within rate limits

  // 2. Pull recent commits from each repo in parallel.
  const commitEventGroups = await Promise.all(
    activeRepos.map((r) => fetchRepoCommitEvents(r.full_name, username)),
  );
  const commitEvents = commitEventGroups.flat();

  // 3. Fetch the public events feed for non-push activity (PRs, issues, stars, forks).
  let extraEvents: GitHubEvent[] = [];
  try {
    const evRes = await fetch(
      `${API_BASE}/users/${username}/events/public?per_page=100`,
    );
    if (evRes.ok) {
      const raw: GitHubEvent[] = await evRes.json();
      extraEvents = raw.filter((e) => e.type !== 'PushEvent');
    }
  } catch { /* ignore */ }

  // 4. Merge, deduplicate by id, sort newest-first, return top N.
  const seen = new Set<string>();
  const merged: GitHubEvent[] = [];
  for (const ev of [...commitEvents, ...extraEvents]) {
    if (!seen.has(ev.id)) {
      seen.add(ev.id);
      merged.push(ev);
    }
  }
  merged.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  setCached(cacheKey, merged);
  return merged.slice(0, limit);
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export async function fetchCommitHeatmap(username: string): Promise<ContributionDay[]> {
  const cacheKey = `gh-heatmap-${username}`;
  const cached = getCached<ContributionDay[]>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
    );
    if (!res.ok) return [];
    const data: { contributions: ContributionDay[] } = await res.json();
    setCached(cacheKey, data.contributions);
    return data.contributions;
  } catch {
    return [];
  }
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

export interface CommitSummary {
  message: string;
  url: string;
}

export interface EventDescription {
  action: string;
  target: string;
  iconKey: EventIconKey;
  /** Individual commits for PushEvents */
  commits?: CommitSummary[];
  /** Extra human-readable detail (PR/issue title, comment excerpt, etc.) */
  detail?: string;
  /** URL to the specific event item (PR, issue, etc.) */
  detailUrl?: string;
}

function capitalize(value?: string): string {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function truncate(text: string | null | undefined, max = 120): string | undefined {
  if (!text) return undefined;
  const trimmed = text.trim().replace(/\n+/g, ' ');
  return trimmed.length > max ? `${trimmed.slice(0, max)}…` : trimmed;
}

export function describeEvent(event: GitHubEvent): EventDescription | null {
  const repoName = event.repo.name.split('/').slice(1).join('/') || event.repo.name;

  switch (event.type) {
    case 'PushEvent': {
      const rawCommits: Array<{ message: string; sha: string }> =
        event.payload?.commits ?? [];
      const size: number | undefined = event.payload?.size;
      const commitCount = rawCommits.length || size;
      const commits: CommitSummary[] = rawCommits
        .filter((c) => c.message)
        .map((c) => ({
          message: truncate(c.message, 100) ?? c.sha.slice(0, 7),
          url: `https://github.com/${event.repo.name}/commit/${c.sha}`,
        }));

      const branch: string | undefined = event.payload?.ref?.replace('refs/heads/', '');
      const before: string | undefined = event.payload?.before;
      const head: string | undefined = event.payload?.head;
      const compareUrl =
        before && head
          ? `https://github.com/${event.repo.name}/compare/${before.slice(0, 7)}...${head.slice(0, 7)}`
          : head
          ? `https://github.com/${event.repo.name}/commit/${head}`
          : undefined;

      const countLabel = commitCount ? `${commitCount} commit${commitCount === 1 ? '' : 's'}` : 'commits';
      const action = branch && branch !== 'main' && branch !== 'master'
        ? `Pushed ${countLabel} to ${branch} in`
        : `Pushed ${countLabel} to`;

      return {
        action,
        target: repoName,
        iconKey: 'commit',
        commits: commits.length > 0 ? commits : undefined,
        detail: commits.length === 0 ? 'View diff →' : undefined,
        detailUrl: commits.length === 0 ? compareUrl : undefined,
      };
    }
    case 'PullRequestEvent': {
      const prAction =
        event.payload?.action === 'opened'
          ? 'Opened'
          : event.payload?.action === 'closed'
          ? event.payload?.pull_request?.merged
            ? 'Merged'
            : 'Closed'
          : capitalize(event.payload?.action);
      const pr = event.payload?.pull_request;
      return {
        action: `${prAction} a pull request in`,
        target: repoName,
        iconKey: 'pr',
        detail: truncate(pr?.title),
        detailUrl: pr?.html_url,
      };
    }
    case 'IssuesEvent': {
      const issue = event.payload?.issue;
      return {
        action: `${capitalize(event.payload?.action)} an issue in`,
        target: repoName,
        iconKey: 'issue',
        detail: truncate(issue?.title),
        detailUrl: issue?.html_url,
      };
    }
    case 'IssueCommentEvent': {
      const comment = event.payload?.comment;
      const issue = event.payload?.issue;
      return {
        action: 'Commented on an issue in',
        target: repoName,
        iconKey: 'comment',
        detail: truncate(comment?.body) ?? truncate(issue?.title),
        detailUrl: comment?.html_url ?? issue?.html_url,
      };
    }
    case 'WatchEvent':
      return { action: 'Starred', target: repoName, iconKey: 'star' };
    case 'ForkEvent': {
      const forkee = event.payload?.forkee;
      return {
        action: 'Forked',
        target: repoName,
        iconKey: 'fork',
        detailUrl: forkee?.html_url,
      };
    }
    case 'CreateEvent': {
      const refType = event.payload?.ref_type;
      if (refType === 'repository')
        return { action: 'Created a new repository', target: repoName, iconKey: 'create' };
      if (refType === 'branch')
        return {
          action: `Created branch "${event.payload?.ref}" in`,
          target: repoName,
          iconKey: 'create',
        };
      return { action: 'Created a tag in', target: repoName, iconKey: 'create' };
    }
    case 'ReleaseEvent': {
      const release = event.payload?.release;
      return {
        action: `Published release ${release?.tag_name ?? ''} for`,
        target: repoName,
        iconKey: 'release',
        detail: truncate(release?.name ?? release?.body),
        detailUrl: release?.html_url,
      };
    }
    case 'PublicEvent':
      return { action: 'Open-sourced', target: repoName, iconKey: 'create' };
    default:
      return null;
  }
}
