import {
  formatMultilineComments,
  formatSingleComment
} from '../src/format-comment';
import { FileAnalyzerResults } from '../src/types';

const analyzedComments: FileAnalyzerResults = [
  {
    comments: {
      'FIXME:': [{ comment: ':add implementation', line: 10 }],
      NOTE: [
        { comment: "Please don't forget review", line: 11 },
        { comment: 'another note', line: 20 }
      ],
      'tODo:': [{ comment: 'this should present', line: 13 }],
      missingBody: [{ comment: '', line: 1 }]
    },
    file: 'tests/mockFiles/mockFile0.js'
  },
  {
    comments: {
      'FIXME:': [{ comment: ':add implementation', line: 20 }],
      NOTE: [
        { comment: "Please don't forget review", line: 21 },
        { comment: 'another note', line: 2 }
      ],
      'tODo:': [{ comment: 'this should present', line: 5 }]
    },
    file: 'tests/mockFiles/mockFile2.js'
  }
];

const mockIdentifier = '<!-- mock-comment-identifier -->';

describe('FormatSingleComment', () => {
  it('should format comment consistently', () => {
    const comment = formatSingleComment(analyzedComments, {
      identifier: mockIdentifier,
      title: 'mock title'
    });

    expect(comment).toMatchSnapshot();
  });

  it('should tag actor with reviewMsg', () => {
    const comment = formatSingleComment(analyzedComments, {
      identifier: mockIdentifier,
      title: 'mock-title',
      actor: 'mock-actor',
      reviewMsg: 'please review'
    });

    expect(comment).toMatchSnapshot();
  });
});

describe('FormatMultilineComments', () => {
  it('should flatten comments and remove tags', () => {
    expect(formatMultilineComments(analyzedComments)).toMatchSnapshot();
  });
});
