import { getOctokit } from '@actions/github';

export type Octokit = ReturnType<typeof getOctokit>;
export type Comments = Record<
  string,
  {
    comment: string;
    line: number;
  }[]
>;
export type EnhancedTag = { tag: string; regex: RegExp };

export type ActionReviewerConstructor = {
  octokit: Octokit;
  owner: string;
  repo: string;
  prNumber: number;
};

export type FileAnalyzerResults = {
  file: string;
  comments: Comments;
}[];
