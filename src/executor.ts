import { context, getOctokit } from '@actions/github';
import { getInput, setFailed } from '@actions/core';
import { fileAnalyzer } from './file-analyzer';
import { formatComment } from './format-comment';
import { ActionReviewer } from './action-reviewer';
import { Context } from '@actions/github/lib/context';
import { Octokit } from './types';

const mocks = [
  {
    comments: {
      'FIXME:': [':Etess'],
      NOTE: ["Please don't forget review", 'another note'],
      'tODo:': ['this should present']
    },
    file: './tests/mockFiles/mockFile0.js'
  }
];

export async function run() {
  try {
    const { blockPr, tags, reviewMsg, token } = getInputs();
    const { actor, owner, prNumber, repo } = getActionParameters(context);
    const octokit = getOctokit(token);

    // const files = await getFiles({ octokit, repo, owner, prNumber });
    // const analyzedComments = await fileAnalyzer(files, tags);
    const comment = formatComment(mocks, { actor, reviewMsg });

    const actionReviewer = new ActionReviewer({
      owner,
      repo,
      octokit,
      prNumber
    });

    await actionReviewer.createReview(comment, blockPr);
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
  const tags = getInput('tags') || 'TODO:,FIXME:,BUG:';
  const reviewMsg = getInput('review-msg');
  const blockPr = getInput('block-pr') ?? 'false';
  const token = getInput('repo-token') || process.env.GITHUB_TOKEN || '';

  if (token === '') {
    throw new Error(`Action needs 'GITHUB_TOKEN' in order to work correctly`);
  }

  return {
    blockPr: blockPr === 'true',
    tags: tags.split(','),
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

async function getFiles({
  octokit,
  owner,
  repo,
  prNumber
}: {
  octokit: Octokit;
  owner: string;
  repo: string;
  prNumber: number;
}): Promise<string[]> {
  const { data: prFiles } = await octokit.rest.pulls.listFiles({
    owner,
    repo,
    pull_number: prNumber
  });
  const untracked = ['removed', 'unchanged'];

  return prFiles
    .filter(prFile => !untracked.includes(prFile.status))
    .map(f => f.filename);
}
