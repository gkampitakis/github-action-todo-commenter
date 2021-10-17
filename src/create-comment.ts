import { getOctokit } from '@actions/github';
type CreateCommentParams = {
  token: string;
  owner: string;
  repo: string;
  prNumber: number;
};

export async function createComment(
  params: CreateCommentParams,
  body: string,
  block: boolean
) {
  const { token, owner, repo, prNumber } = params;
  const octokit = getOctokit(token);

  const { data: allComments } = await octokit.rest.issues.listComments({
    owner,
    repo,
    issue_number: prNumber
  });

  const comment = allComments.find(item => {
    return (
      item.user?.login === 'github-actions[bot]' &&
      item.body?.startsWith('## Todo Commenter\n')
    );
  });

  if (comment) {
    return await octokit.rest.pulls.updateReviewComment({
      owner,
      repo,
      body,
      comment_id: comment.id,
      pull_number: prNumber
    });
  }

  return octokit.rest.pulls.createReview({
    owner,
    repo,
    event: block ? 'REQUEST_CHANGES' : 'COMMENT',
    pull_number: prNumber,
    body
  });
}
