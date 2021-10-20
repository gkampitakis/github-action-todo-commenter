import { getInput } from '@actions/core';
import { Context } from '@actions/github/lib/context';

export function getInputs(): {
  token: string;
  reviewMsg: string;
  ignoreFilesPattern: string;
  tags: string[];
} {
  const tags = getInput('tags') || 'TODO:,FIXME:,BUG:';
  const reviewMsg = getInput('review-message');
  const ignoreFilesPattern = getInput('ignore-pattern');
  const token = getInput('github-token') || '';

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

export function getActionParameters(ctx: Context): {
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
