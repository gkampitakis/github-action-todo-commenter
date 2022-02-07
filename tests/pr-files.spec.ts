import { getFiles } from '../src/pr-files';
import { Octokit } from '../src/types';

const sleep = (time: number) =>
  new Promise(resolve => setTimeout(resolve, time));
const execSpy = jest.fn();
const diffCMD = 'git diff origin/master...origin/pr -- src/data.ts';

jest.mock('util', () => {
  return {
    promisify: () => async (command: string) => {
      await sleep(2000);
      execSpy(command);
      return { stdout: 'mock-diff', stderr: '' };
    }
  };
});

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
              filename: 'src/data.ts',
              additions: 10
            },
            {
              status: 'added',
              filename: 'data.js',
              additions: 4,
              patch: 'mock-patch'
            },
            {
              status: 'removed',
              filename: 'mock-file.spec.ts',
              additions: 4,
              patch: 'mock-patch'
            },
            {
              status: 'unchanged',
              filename: 'more-data.ts',
              additions: 4,
              patch: 'mock-patch'
            },
            {
              status: 'modified',
              filename: 'lib/index.js',
              additions: 0,
              patch: 'mock-patch'
            },
            {
              status: 'modified',
              filename: 'index.ts',
              additions: 2,
              patch: 'mock-patch'
            }
          ]
        } as unknown;
      }
    }
  }
} as Octokit;
const owner = 'mock-owner';
const repo = 'mock-repo';
const prNumber = 10;
const base = 'master';
const head = 'pr';

describe('getFiles', () => {
  beforeEach(() => {
    spy.mockClear();
  });

  it('should return correct files', async () => {
    const files = await getFiles({
      octokit: mockOctokit,
      owner,
      repo,
      base,
      head,
      prNumber
    });

    expect(files).toEqual([
      { filename: 'src/data.ts', patch: 'mock-diff' },
      { filename: 'data.js', patch: 'mock-patch' },
      { filename: 'index.ts', patch: 'mock-patch' }
    ]);
    expect(spy).toHaveBeenCalledWith({
      owner,
      repo,
      pull_number: prNumber,
      mediaType: {
        format: 'diff'
      }
    });
    expect(execSpy).toHaveBeenNthCalledWith(1, diffCMD);
  });

  it('should filter out matching files', async () => {
    const files = await getFiles({
      octokit: mockOctokit,
      owner,
      repo,
      prNumber,
      head,
      base,
      ignoreFilesPattern: '.js$'
    });

    expect(files).toEqual([
      { filename: 'src/data.ts', patch: 'mock-diff' },
      { filename: 'index.ts', patch: 'mock-patch' }
    ]);
    expect(spy).toHaveBeenCalledWith({
      owner,
      repo,
      pull_number: prNumber,
      mediaType: {
        format: 'diff'
      }
    });
    expect(execSpy).toHaveBeenNthCalledWith(1, diffCMD);
  });
});
