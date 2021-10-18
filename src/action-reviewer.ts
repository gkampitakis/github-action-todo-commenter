import { getOctokit } from '@actions/github';
import { ActionReviewerConstructor } from './types';

export class ActionReviewer {
  private octokit: ReturnType<typeof getOctokit>;
  private owner: string;
  private repo: string;
  private prNumber: number;

  constructor({ octokit, owner, repo, prNumber }: ActionReviewerConstructor) {
    this.octokit = octokit;
    this.owner = owner;
    this.repo = repo;
    this.prNumber = prNumber;
  }

  public async createReview(body: string) {
    const { id, body: oldReviewBody } = await this.reviewExists();

    console.log(oldReviewBody === body, body, oldReviewBody, id);

    if (oldReviewBody === body) return;

    if (id) {
      await this.deleteReview(id);
    }

    await this.octokit.rest.issues.createComment({
      owner: this.owner,
      repo: this.repo,
      issue_number: this.prNumber,
      body
    });

    return;
  }

  public async deleteReview(id: number) {
    return this.octokit.rest.issues.deleteComment({
      owner: this.owner,
      repo: this.repo,
      comment_id: id
    });
  }

  private async reviewExists(): Promise<{ id?: number; body?: string }> {
    const { data: allReviews } = await this.octokit.rest.issues.listComments({
      owner: this.owner,
      repo: this.repo,
      issue_number: this.prNumber
    });

    if (allReviews.length === 0) {
      return {};
    }

    const review = allReviews.find(item => {
      return (
        item.user?.login === 'github-actions[bot]' &&
        item.body?.startsWith('## Todo Commenter\n')
      );
    });

    return { id: review?.id, body: review?.body };
  }
}
