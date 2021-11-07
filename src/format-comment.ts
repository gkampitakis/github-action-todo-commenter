import { FileAnalyzerResults, FormatCommentOptions } from './types';

export function formatComment(
  analyzedCommentsPerFile: FileAnalyzerResults,
  { actor, reviewMsg, title }: FormatCommentOptions
) {
  let message = `## ${title}\n`;

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
