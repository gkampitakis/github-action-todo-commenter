import { getFiles } from '../src/pr-files';
import { Octokit } from '../src/types';

const spy = jest.fn();
const mockOctokit = {
  rest: {
    pulls: {
      listFiles: args => {
        spy(args);
        return {
          data: [
            {
              status: 'added',
              filename: 'data.ts'
            },
            {
              status: 'added',
              filename: 'data.js'
            },
            {
              status: 'removed',
              filename: 'mock-file.spec.ts'
            },
            {
              status: 'unchanged',
              filename: 'more-data.ts'
            },
            {
              status: 'modified',
              filename: 'index.js'
            },
            {
              status: 'modified',
              filename: 'index.ts'
            }
          ]
        } as any;
      }
    }
  }
} as Octokit;
const owner = 'mock-owner';
const repo = 'mock-repo';
const prNumber = 10;

describe('getFiles', () => {
  beforeEach(() => {
    spy.mockClear();
  });

  it('should return correct files', async () => {
    const files = await getFiles({
      octokit: mockOctokit,
      owner,
      repo,
      prNumber
    });

    expect(files).toEqual(['data.ts', 'data.js', 'index.js', 'index.ts']);
    expect(spy).toHaveBeenCalledWith({
      owner,
      repo,
      pull_number: prNumber
    });
  });

  it('should filter out matching files', async () => {
    const files = await getFiles({
      octokit: mockOctokit,
      owner,
      repo,
      prNumber,
      ignoreFilesPattern: '.js$'
    });

    expect(files).toEqual(['data.ts', 'index.ts']);
    expect(spy).toHaveBeenCalledWith({
      owner,
      repo,
      pull_number: prNumber
    });
  });
});
