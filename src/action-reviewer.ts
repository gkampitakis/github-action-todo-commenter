import { info } from 'console';
import { ActionReviewerOptions, Octokit } from './types';

export class ActionReviewer {
  private octokit: Octokit;
  private options: ActionReviewerOptions;

  constructor(octokit: Octokit, options: ActionReviewerOptions) {
    this.octokit = octokit;
    this.options = options;
  }

  public async createReview(body: string) {
    const { id, body: oldReviewBody } = await this.reviewExists();

    if (oldReviewBody === body) {
      info('No new changes detected since last commit');
      return;
    }

    if (id) {
      await this.deleteReview(id);
    }

    await this.octokit.rest.issues.createComment({
      owner: this.options.owner,
      repo: this.options.repo,
      issue_number: this.options.prNumber,
      body
    });

    return;
  }

  public async deleteReview(id: number) {
    return this.octokit.rest.issues.deleteComment({
      owner: this.options.owner,
      repo: this.options.repo,
      comment_id: id
    });
  }

  public async reviewExists(): Promise<{ id?: number; body?: string }> {
    const { data: allReviews } = await this.octokit.rest.issues.listComments({
      owner: this.options.owner,
      repo: this.options.repo,
      issue_number: this.options.prNumber
    });

    if (allReviews.length === 0) {
      return {};
    }

    const review = allReviews.find(item => {
      return (
        item.user?.login === 'github-actions[bot]' &&
        item.body?.startsWith(`## ${this.options.commentTitle}`)
      );
    });

    return { id: review?.id, body: review?.body };
  }
}
