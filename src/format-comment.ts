import { FileAnalyzerResults, FormatCommentOptions } from './types';

export function formatSingleComment(
  analyzedCommentsPerFile: FileAnalyzerResults,
  { actor, reviewMsg, title, identifier }: FormatCommentOptions
) {
  let message = `${identifier}
## ${title}\n`;

  analyzedCommentsPerFile.forEach(({ comments, file }) => {
    message += `<details>\n`;
    message += `<summary><strong>${file}</strong></summary>\n`;

    Object.entries(comments).forEach(([key, items]) => {
      message += `\n##### ${key}\n\n`;

      items.forEach(item => {
        if (item.comment === '') {
          message += `- [ ] <space> \`Line: ${item.line}\`\n`;
          return;
        }
        message += `- [ ] ${item.comment} \`Line: ${item.line}\` \n`;
      });
    });

    message += `</details>\n\n`;
  });

  if (reviewMsg) {
    message += '---\n';
    message += `@${actor} ${reviewMsg}`;
  }

  return message;
}

export function formatMultilineComments(
  analyzedCommentsPerFile: FileAnalyzerResults
) {
  return analyzedCommentsPerFile.map(({ comments, file }) => ({
    file,
    comments: Object.entries(comments)
      .map(([tag, elements]) =>
        elements.map(({ comment, line }) => ({
          comment: comment === '' ? tag : comment,
          line
        }))
      )
      .flat()
  }));
}
// NOTE: could this be written better :thinking:
