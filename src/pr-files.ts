import { Octokit } from './types';

export async function getFiles({
  octokit,
  owner,
  repo,
  prNumber,
  ignoreFilesPattern
}: {
  // FIXME: break into types and document what's happening here :scream:
  octokit: Octokit;
  owner: string;
  repo: string;
  prNumber: number;
  ignoreFilesPattern?: string;
}): Promise<string[]> {
  const { data: prFiles } = await octokit.rest.pulls.listFiles({
    owner,
    repo,
    pull_number: prNumber
  });
  const untracked = ['removed', 'unchanged'];
  let matcher = (file: typeof prFiles[number]) =>
    !untracked.includes(file.status);

  if (ignoreFilesPattern) {
    const regex = new RegExp(ignoreFilesPattern);
    matcher = (file: typeof prFiles[number]) =>
      !untracked.includes(file.status) && !file.filename.match(regex);
  }

  return prFiles.filter(matcher).map(f => f.filename);
}
