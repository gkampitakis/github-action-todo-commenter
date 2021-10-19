import { context, getOctokit } from '@actions/github';
import { setFailed, info } from '@actions/core';

import { getActionParameters, getInputs } from './action-parameters';
import { getFiles } from './pr-files';
import { fileAnalyzer } from './file-analyzer';
import { ActionReviewer } from './action-reviewer';
import { formatComment } from './format-comment';

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
