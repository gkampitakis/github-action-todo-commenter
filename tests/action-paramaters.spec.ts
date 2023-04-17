import { Context } from '@actions/github/lib/context';
import { getActionParameters, getInputs } from '../src/action-parameters';

let mockInputs: Record<string, string> = {};

jest.mock('@actions/core', () => ({
  getInput: (input: string) => mockInputs[input]
}));

describe('getActionParameters', () => {
  it('should return action parameters', () => {
    const ctx = {
      actor: 'mock-actor',
      repo: {
        owner: 'mock-owner',
        repo: 'mock-repo'
      },
      eventName: 'pull_request',
      payload: {
        pull_request: {
          number: 10,
          base: { ref: 'master' },
          head: { ref: 'pr' }
        }
      }
    } as unknown as Context;

    expect(getActionParameters(ctx)).toMatchSnapshot();
  });

  it("should throw error if event != 'pull_request'", () => {
    const ctx = {
      repo: {},
      eventName: 'push',
      payload: {}
    } as Context;

    expect(() => getActionParameters(ctx)).toThrow(
      'Action only supports pull requests'
    );
  });

  it('should throw error if cannot find pull request number', () => {
    const ctx = {
      repo: {},
      eventName: 'pull_request',
      payload: {
        pull_request: {}
      }
    } as Context;

    expect(() => getActionParameters(ctx)).toThrow(
      'Action cannot identify pull request number'
    );
  });
});

describe('getInputs', () => {
  beforeEach(() => {
    mockInputs = {};
  });

  it('should return all inputs', () => {
    mockInputs = {
      'github-token': 'mock-token',
      tags: 'test:,data:,more',
      'review-message': 'hello world',
      'ignore-pattern': 'mock-pattern',
      'comment-title': 'my title'
    };
    const inputs = getInputs();

    expect(inputs).toMatchSnapshot();
  });
});
