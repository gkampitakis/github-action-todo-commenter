import { formatComment } from '../src/format-comment';

const analyzedComments = [
  {
    comments: {
      'FIXME:': [':add implementation'],
      NOTE: ["Please don't forget review", 'another note'],
      'tODo:': ['this should present']
    },
    file: './tests/mockFiles/mockFile0.js'
  },
  {
    comments: {
      'FIXME:': [':add implementation'],
      NOTE: ["Please don't forget review", 'another note'],
      'tODo:': ['this should present']
    },
    file: './tests/mockFiles/mockFile2.js'
  }
];

describe('FormatComment', () => {
  it('should format comment consistently', () => {
    const comment = formatComment(analyzedComments, {});

    expect(comment).toMatchSnapshot();
  });

  it('should tag actor with reviewMsg', () => {
    const comment = formatComment(analyzedComments, {
      actor: 'mock-actor',
      reviewMsg: 'please review'
    });

    expect(comment).toMatchSnapshot();
  });
});
