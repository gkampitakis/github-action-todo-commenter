import { getOctokit } from '@actions/github';

export type Octokit = ReturnType<typeof getOctokit>;
export type Comments = Record<
  string, // This is the tag
  {
    comment: string;
    line: number;
  }[]
>;
export type EnhancedTag = { tag: string; regex: RegExp };

export type ActionReviewerOptions = {
  owner: string;
  repo: string;
  prNumber: number;
  commentTitle: string;
};

export type FileAnalyzerResults = {
  file: string;
  comments: Comments;
}[];

export type GetInputParams = {
  token: string;
  reviewMsg: string;
  ignoreFilesPattern: string;
  tags: string[];
  commentTitle: string;
};

export type GetActionParams = {
  actor: string;
  owner: string;
  repo: string;
  base: string;
  head: string;
  prNumber: number;
};

export type FormatCommentOptions = {
  actor?: string;
  reviewMsg?: string;
  title: string;
};

export type GetFilesParams = {
  octokit: Octokit;
  owner: string;
  repo: string;
  prNumber: number;
  base: string;
  head: string;
  ignoreFilesPattern?: string;
};
