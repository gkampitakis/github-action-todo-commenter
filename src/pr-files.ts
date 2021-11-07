import { GetFilesParams } from './types';

export async function getFiles({
  octokit,
  owner,
  repo,
  prNumber,
  ignoreFilesPattern
}: GetFilesParams) {
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
