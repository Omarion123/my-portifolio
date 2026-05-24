import { Request, Response } from 'express';
import https from 'https';
import { GithubAccount } from '../models/GithubAccount';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ContributionDay {
  date: string;
  count: number;
}

interface CacheEntry {
  data: ContributionDay[];
  fetchedAt: number;
}

// ── In-memory cache (1 hour TTL, keyed by year) ──────────────────────────────

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 60 * 60 * 1000;

// ── GitHub GraphQL helper ─────────────────────────────────────────────────────

const CONTRIBUTIONS_QUERY = `
  query($from: DateTime!, $to: DateTime!) {
    viewer {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

function graphqlRequest(token: string, variables: Record<string, string>): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: CONTRIBUTIONS_QUERY, variables });
    const req = https.request(
      {
        hostname: 'api.github.com',
        path: '/graphql',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'portfolio-contribution-tracker',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      res => {
        let raw = '';
        res.on('data', chunk => (raw += chunk));
        res.on('end', () => {
          try { resolve(JSON.parse(raw)); }
          catch (e) { reject(e); }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function fetchForAccount(token: string, year: number): Promise<ContributionDay[]> {
  const currentYear = new Date().getFullYear();
  const from = new Date(year, 0, 1);
  const to = year >= currentYear ? new Date() : new Date(year, 11, 31, 23, 59, 59);

  const result = await graphqlRequest(token, {
    from: from.toISOString(),
    to: to.toISOString(),
  }) as { data?: { viewer?: { contributionsCollection?: { contributionCalendar?: { weeks: { contributionDays: { date: string; contributionCount: number }[] }[] } } } } };

  const weeks =
    result.data?.viewer?.contributionsCollection?.contributionCalendar?.weeks ?? [];

  return weeks.flatMap(w =>
    w.contributionDays.map(d => ({ date: d.date, count: d.contributionCount }))
  );
}

function mergeContributions(allDays: ContributionDay[][]): ContributionDay[] {
  const map = new Map<string, number>();
  for (const days of allDays) {
    for (const day of days) {
      map.set(day.date, (map.get(day.date) ?? 0) + day.count);
    }
  }
  return Array.from(map.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// ── Controllers ───────────────────────────────────────────────────────────────

export async function getContributions(req: Request, res: Response): Promise<void> {
  const year = req.query['year']
    ? parseInt(req.query['year'] as string, 10)
    : new Date().getFullYear();

  const cacheKey = String(year);
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
    res.json(cached.data);
    return;
  }

  const accounts = await GithubAccount.find();
  if (accounts.length === 0) {
    res.json([]);
    return;
  }

  const results = await Promise.allSettled(
    accounts.map(a => fetchForAccount(a.accessToken, year))
  );

  const successful = results
    .filter((r): r is PromiseFulfilledResult<ContributionDay[]> => r.status === 'fulfilled')
    .map(r => r.value);

  const merged = mergeContributions(successful);
  cache.set(cacheKey, { data: merged, fetchedAt: Date.now() });
  res.json(merged);
}

export async function listAccounts(_req: Request, res: Response): Promise<void> {
  // Never return the access token
  const accounts = await GithubAccount.find().select('-accessToken');
  res.json(accounts);
}

export async function addAccount(req: Request, res: Response): Promise<void> {
  const { username, accessToken, label } = req.body as {
    username: string;
    accessToken: string;
    label?: string;
  };

  if (!username || !accessToken) {
    res.status(400).json({ message: 'username and accessToken are required' });
    return;
  }

  // Validate the token works before saving
  try {
    await fetchForAccount(accessToken, new Date().getFullYear());
  } catch {
    res.status(400).json({ message: 'Could not fetch contributions — check your token and permissions.' });
    return;
  }

  const account = await GithubAccount.create({ username, accessToken, label: label ?? username });
  cache.clear(); // invalidate cache
  res.status(201).json({ _id: account.id, username: account.username, label: account.label });
}

export async function deleteAccount(req: Request, res: Response): Promise<void> {
  await GithubAccount.findByIdAndDelete(req.params.id);
  cache.clear(); // invalidate cache
  res.status(204).end();
}
