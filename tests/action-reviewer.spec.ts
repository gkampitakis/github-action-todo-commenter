import { ActionReviewer } from '../src/action-reviewer';
import { Octokit } from '../src/types';

let mockData: any[] = [];
const createSpy = jest.fn();
const deleteSpy = jest.fn();
const listSpy = jest.fn();
const mockOctokit = {
  rest: {
    issues: {
      createComment: createSpy,
      deleteComment: deleteSpy,
      listComments: (args: any) => {
        listSpy(args);

        return {
          data: mockData
        };
      }
    }
  } as any
} as Octokit;
const owner = 'mock-owner';
const repo = 'mock-repo';
const prNumber = 10;

describe('ActionReviewer', () => {
  const actionReviewer = new ActionReviewer({
    octokit: mockOctokit,
    owner,
    repo,
    prNumber
  });

  beforeEach(() => {
    createSpy.mockClear();
    deleteSpy.mockClear();
    listSpy.mockClear();
    mockData = [];
  });

  it('should create comment', async () => {
    await actionReviewer.createReview('mock-body');

    expect(listSpy).toHaveBeenCalledWith({
      owner,
      repo,
      issue_number: prNumber
    });
    expect(createSpy).toHaveBeenCalledWith({
      owner,
      repo,
      issue_number: prNumber,
      body: 'mock-body'
    });
  });

  it('should delete existing comment and create a new', async () => {
    mockData = [
      {},
      {
        user: {
          login: 'github-actions[bot]'
        },
        body: '## Todo Commenter\n',
        id: prNumber
      }
    ];
    await actionReviewer.createReview('mock-body');

    expect(listSpy).toHaveBeenCalledWith({
      owner,
      repo,
      issue_number: prNumber
    });
    expect(deleteSpy).toHaveBeenCalledWith({
      owner,
      repo,
      comment_id: prNumber
    });
    expect(createSpy).toHaveBeenCalledWith({
      owner,
      repo,
      issue_number: prNumber,
      body: 'mock-body'
    });
  });

  it('should skip creating comment if already exists', async () => {
    mockData = [
      {},
      {
        user: {
          login: 'github-actions[bot]'
        }
      },
      {
        user: {
          login: 'github-actions[bot]'
        },
        body: '## Todo Commenter\n',
        id: prNumber
      }
    ];
    await actionReviewer.createReview('## Todo Commenter\n');

    expect(listSpy).toHaveBeenCalledWith({
      owner,
      repo,
      issue_number: prNumber
    });
    expect(deleteSpy).not.toHaveBeenCalled();
    expect(createSpy).not.toHaveBeenCalled();
  });

  it('should call deleteReview', async () => {
    await actionReviewer.deleteReview(prNumber);

    expect(deleteSpy).toHaveBeenCalledWith({
      owner,
      repo,
      comment_id: prNumber
    });
  });
});
