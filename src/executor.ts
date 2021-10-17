import { context } from '@actions/github';
import { getInput, setFailed } from '@actions/core';
import { fileAnalyzer } from './file-analyzer';
import { formatComment } from './format-comment';
import { createComment } from './create-comment';
import { Context } from '@actions/github/lib/context';

const mock = [
  {
    comments: {
      'FIXME:': [':add implementation'],
      NOTE: ["Please don't forget review", 'another note'],
      'tODo:': ['this should present']
    },
    file: './tests/mockFiles/mockFile0.js'
  },
  {
    comments: {
      'FIXME:': [':add implementation'],
      NOTE: ["Please don't forget review", 'another note'],
      'tODo:': ['this should present']
    },
    file: './tests/mockFiles/mockFile1.js'
  }
];

export async function run() {
  try {
    const { blockPr, tags, reviewMsg, token } = getInputs();
    const { actor, owner, prNumber, repo } = getActionParameters(context);

    console.log(blockPr, tags, reviewMsg, token);
    console.log(actor, owner, prNumber, repo);

    // const analyzedComments = await fileAnalyzer([], tags); // TODO: here we need the files that we need to check
    const comment = formatComment(mock, { actor, reviewMsg });

    await createComment(
      {
        repo,
        prNumber,
        owner,
        token
      },
      comment,
      blockPr
    );
  } catch (error: any) {
    setFailed(error.message);
  }
}

function getInputs(): {
  blockPr: boolean;
  token: string;
  reviewMsg: string;
  tags: string[];
} {
  const tags = getInput('tags').split(',') || ['TODO:', 'FIXME:', 'BUG:'];
  const reviewMsg = getInput('review-msg');
  const blockPr = getInput('block-pr') ?? 'false';
  const token = getInput('repo-token') || process.env.GITHUB_TOKEN || '';

  if (token === '') {
    throw new Error(`Action needs 'GITHUB_TOKEN' in order to work correctly`);
  }

  return {
    blockPr: blockPr === 'true',
    tags,
    reviewMsg,
    token
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
