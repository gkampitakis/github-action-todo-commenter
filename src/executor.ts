import { context, getOctokit } from '@actions/github';
import { setFailed, info } from '@actions/core';

import { getActionParameters, getInputs } from './action-parameters';
import { getFiles } from './pr-files';
import { fileAnalyzer } from './file-analyzer';
import { ActionReviewer } from './action-reviewer';
import { formatComment } from './format-comment';
import { SingleCommentParams } from './types';

const COMMENT_IDENTIFIER = '<!-- action-comment-identifier -->';

export async function run() {
  try {
    const {
      tags,
      reviewMsg,
      token,
      ignoreFilesPattern,
      commentTitle,
      multiLineCommentMode
    } = getInputs();
    const { actor, owner, prNumber, repo, commitId } =
      getActionParameters(context);
    const octokit = getOctokit(token);

    const files = await getFiles({
      octokit,
      repo,
      owner,
      prNumber,
      ignoreFilesPattern
    });
    const analyzedComments = await fileAnalyzer(files, tags);
    const actionReviewer = new ActionReviewer(octokit, {
      owner,
      repo,
      prNumber,
      commitId,
      commentIdentifier: COMMENT_IDENTIFIER
    });

    if (multiLineCommentMode) {
      await multilineComment(actionReviewer);
      return;
    }

    await singleComment(actionReviewer, {
      actor,
      title: commentTitle,
      reviewMsg,
      comments: analyzedComments
    });
  } catch (error: any) {
    setFailed(error.message);
  }
}

async function singleComment(
  actionReviewer: ActionReviewer,
  { comments, actor, reviewMsg, title }: SingleCommentParams
) {
  if (comments.length === 0) {
    const { id } = await actionReviewer.reviewExists();
    if (id) {
      await actionReviewer.deleteReview(id);
    }

    info('No tags found in pr 👀');
    return;
  }

  const comment = formatComment(comments, {
    actor,
    reviewMsg,
    title,
    identifier: COMMENT_IDENTIFIER
  });
  await actionReviewer.createReview(comment);
}

async function multilineComment(actionReviewer: ActionReviewer) {
  console.log('TBI');
}
