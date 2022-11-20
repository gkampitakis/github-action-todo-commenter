import { getInput } from '@actions/core';
import { Context } from '@actions/github/lib/context';

import { GetActionParams, GetInputParams } from './types';

export function getInputs(): GetInputParams {
  const tags = getInput('tags') || 'TODO:,FIXME:,BUG:';
  const reviewMsg = getInput('review-message');
  const ignoreFilesPattern = getInput('ignore-pattern');
  const token = getInput('github-token', { required: true });
  const commentTitle = getInput('comment-title') || 'Todo Commenter';

  return {
    tags: tags.split(','),
    reviewMsg,
    token,
    ignoreFilesPattern,
    commentTitle
  };
}

export function getActionParameters(ctx: Context): GetActionParams {
  const {
    actor,
    repo: { owner, repo },
    eventName,
    payload: { pull_request }
  } = ctx;
  const base = pull_request?.base?.ref;
  const head = pull_request?.head?.ref;

  console.log(eventName);

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
    base,
    head,
    prNumber: pull_request?.number
  };
}
