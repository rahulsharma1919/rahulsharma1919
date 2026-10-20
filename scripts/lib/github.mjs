// Live numbers for the dashboard, from GitHub's GraphQL API. With a token that
// has the `repo` scope, private work counts too (commits, PRs, languages).

const ENDPOINT = 'https://api.github.com/graphql';

/** Languages that describe tooling, not what was written. */
const IGNORED_LANGUAGES = new Set(['Jupyter Notebook', 'Dockerfile', 'Procfile', 'Makefile', 'Shell', 'Batchfile', 'PowerShell']);

async function graphql(token, query, variables) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'profile-cards' },
    body: JSON.stringify({ query, variables }),
  });
  const body = await response.json();
  if (!response.ok || body.errors) {
    throw new Error(`GitHub GraphQL: ${String(response.status)} ${JSON.stringify(body.errors ?? body)}`);
  }
  return body.data;
}

const PROFILE_QUERY = `query ($login: String!) {
  user(login: $login) {
    createdAt
    followers { totalCount }
    repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
      totalCount
      nodes {
        stargazerCount
        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) { edges { size node { name color } } }
      }
    }
    contributionsCollection {
      totalCommitContributions
      restrictedContributionsCount
      totalPullRequestContributions
      contributionCalendar { totalContributions }
    }
  }
}`;

const YEAR_QUERY = `query ($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar { weeks { contributionDays { date contributionCount } } }
    }
  }
}`;

/** Current and longest runs of days with at least one contribution. */
export function streaks(days) {
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  let best = 0;
  let run = 0;
  for (const day of sorted) {
    run = day.count > 0 ? run + 1 : 0;
    best = Math.max(best, run);
  }
  // Today may simply not have started yet: count back from yesterday then.
  let index = sorted.length - 1;
  if (index >= 0 && sorted[index].count === 0) index -= 1;
  let current = 0;
  while (index >= 0 && sorted[index].count > 0) {
    current += 1;
    index -= 1;
  }
  return { current, best };
}

export async function fetchStats(token, login) {
  const { user } = await graphql(token, PROFILE_QUERY, { login });
  const repos = user.repositories.nodes;

  const bytes = new Map();
  for (const repo of repos) {
    for (const edge of repo.languages.edges) {
      if (IGNORED_LANGUAGES.has(edge.node.name)) continue;
      const entry = bytes.get(edge.node.name) ?? { color: edge.node.color ?? '#a3abd1', size: 0 };
      entry.size += edge.size;
      bytes.set(edge.node.name, entry);
    }
  }
  const totalBytes = [...bytes.values()].reduce((sum, entry) => sum + entry.size, 0) || 1;
  const languages = [...bytes.entries()]
    .sort((a, b) => b[1].size - a[1].size)
    .slice(0, 5)
    .map(([name, entry]) => ({ name, color: entry.color, share: entry.size / totalBytes }));

  // Every year since the account was created, for an all-time best streak.
  const days = [];
  const now = new Date();
  for (let year = new Date(user.createdAt).getUTCFullYear(); year <= now.getUTCFullYear(); year += 1) {
    const from = new Date(Date.UTC(year, 0, 1));
    const to = year === now.getUTCFullYear() ? now : new Date(Date.UTC(year, 11, 31, 23, 59, 59));
    const data = await graphql(token, YEAR_QUERY, { login, from: from.toISOString(), to: to.toISOString() });
    for (const week of data.user.contributionsCollection.contributionCalendar.weeks) {
      for (const day of week.contributionDays) days.push({ date: day.date, count: day.contributionCount });
    }
  }
  const firstActive = days.find((day) => day.count > 0)?.date;

  const collection = user.contributionsCollection;
  return {
    generatedAt: now.toISOString(),
    contributions: collection.contributionCalendar.totalContributions,
    commits: collection.totalCommitContributions + collection.restrictedContributionsCount,
    pullRequests: collection.totalPullRequestContributions,
    repositories: user.repositories.totalCount,
    stars: repos.reduce((sum, repo) => sum + repo.stargazerCount, 0),
    followers: user.followers.totalCount,
    activeSince: firstActive ? firstActive.slice(0, 4) : String(new Date(user.createdAt).getUTCFullYear()),
    ...streaks(days),
    languages,
  };
}
