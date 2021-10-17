import { FileAnalyzerResults } from './file-analyzer';

export function formatComment(
  analyzedComments: FileAnalyzerResults,
  { actor, reviewMsg }: { actor?: string; reviewMsg?: string }
) {
  let message = '## Todo Commenter\n';

  analyzedComments.forEach(({ comments, file }) => {
    message += `<details>\n`;
    message += `<summary><strong>${file}</strong></summary>\n`;

    Object.entries(comments).forEach(([key, items]) => {
      message += `\n##### ${key}\n\n`;

      items.forEach(item => {
        message += `- [ ] ${item}\n`;
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
