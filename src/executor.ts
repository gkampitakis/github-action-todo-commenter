import { context, getOctokit } from '@actions/github';
import { getInput, setFailed, info } from '@actions/core';
import { fileAnalyzer } from './file-analyzer';
import { formatComment } from './format-comment';
import { ActionReviewer } from './action-reviewer';
import { Context } from '@actions/github/lib/context';
import { Octokit } from './types';

export async function run() {
  try {
    const { tags, reviewMsg, token, ignoreFilesPattern } = getInputs();
    const { actor, owner, prNumber, repo } = getActionParameters(context);
    const octokit = getOctokit(token);

    const files = await getFiles({
      octokit,
      repo,
      owner,
      prNumber,
      ignoreFilesPattern
    });
    const analyzedComments = await fileAnalyzer(files, tags);
    const actionReviewer = new ActionReviewer({
      owner,
      repo,
      octokit,
      prNumber
    });

    if (analyzedComments.length === 0) {
      const { id } = await actionReviewer.reviewExists();
      if (id) {
        await actionReviewer.deleteReview(id);
      }

      info('No tags found in pr 👀');
      return;
    }

    const comment = formatComment(analyzedComments, { actor, reviewMsg });

    await actionReviewer.createReview(comment);
  } catch (error: any) {
    setFailed(error.message);
  }
}

function getInputs(): {
  token: string;
  reviewMsg: string;
  ignoreFilesPattern: string;
  tags: string[];
} {
  const tags = getInput('tags') || 'TODO:,FIXME:,BUG:';
  const reviewMsg = getInput('review-msg');
  const ignoreFilesPattern = getInput('ignore-pattern');
  const token = getInput('github-token') || process.env.GITHUB_TOKEN || '';

  if (token === '') {
    throw new Error(`Action needs 'GITHUB_TOKEN' in order to work correctly`);
  }

  return {
    tags: tags.split(','),
    reviewMsg,
    token,
    ignoreFilesPattern
  };
}

function getActionParameters(ctx: Context): {
  actor: string;
  owner: string;
  repo: string;
  prNumber: number;
} {
  const {
    actor,
    repo: { owner, repo },
    eventName,
    payload: { pull_request }
  } = ctx;

  if (eventName !== 'pull_request') {
    throw new Error('Action only supports pull requests');
  }

  if (!pull_request?.number) {
    throw new Error('Action cannot identify pull request number');
  }

  return {
    actor,
    owner,
    repo,
    prNumber: pull_request?.number
  };
}

async function getFiles({
  octokit,
  owner,
  repo,
  prNumber,
  ignoreFilesPattern
}: {
  octokit: Octokit;
  owner: string;
  repo: string;
  prNumber: number;
  ignoreFilesPattern: string;
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
