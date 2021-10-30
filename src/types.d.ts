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

export type ActionReviewerOptions = {
  owner: string;
  repo: string;
  prNumber: number;
  commitId: string;
  commentIdentifier: string;
};

export type FileAnalyzerResults = {
  file: string;
  comments: Comments;
}[];

export type SingleCommentParams = {
  comments: FileAnalyzerResults;
  actor: string;
  reviewMsg: string;
  title: string;
};

export type GetInputsParams = {
  token: string;
  reviewMsg: string;
  ignoreFilesPattern: string;
  tags: string[];
  multiLineCommentMode: boolean;
  commentTitle: string;
};

export type GetActionParams = {
  actor: string;
  owner: string;
  repo: string;
  prNumber: number;
  commitId: string;
};

export type FormatCommentOptions = {
  actor?: string;
  reviewMsg?: string;
  title: string;
  identifier: string;
};
