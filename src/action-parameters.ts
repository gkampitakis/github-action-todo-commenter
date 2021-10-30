import { getInput } from '@actions/core';
import { Context } from '@actions/github/lib/context';
import { GetActionParams, GetInputsParams } from './types';

export function getInputs(): GetInputsParams {
  const tags = getInput('tags') || 'TODO:,FIXME:,BUG:';
  const reviewMsg = getInput('review-message');
  const ignoreFilesPattern = getInput('ignore-pattern');
  const token = getInput('github-token') || '';
  const multiLineCommentMode = getInput('multiline-comment') === 'true';
  const commentTitle = getInput('comment-title') || 'Todo Commenter';

  if (token === '') {
    throw new Error(`Action needs 'GITHUB_TOKEN' in order to work correctly`);
  }

  return {
    tags: tags.split(','),
    reviewMsg,
    token,
    ignoreFilesPattern,
    multiLineCommentMode,
    commentTitle
  };
}

export function getActionParameters(ctx: Context): GetActionParams {
  const {
    actor,
    repo: { owner, repo },
    eventName,
    payload: { pull_request, after }
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
    commitId: after,
    prNumber: pull_request?.number
  };
}
