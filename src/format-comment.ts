import { FileAnalyzerResults } from './types';

export function formatComment(
  analyzedCommentsPerFile: FileAnalyzerResults,
  { actor, reviewMsg }: { actor?: string; reviewMsg?: string }
) {
  let message = '## Todo Commenter\n';

  analyzedCommentsPerFile.forEach(({ comments, file }) => {
    message += `<details>\n`;
    message += `<summary><strong>${file}</strong></summary>\n`;

    Object.entries(comments).forEach(([key, items]) => {
      message += `\n##### ${key}\n\n`;

      items.forEach(item => {
        if (item === '') {
          message += `- [ ] <space>\n`;
          return;
        }
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
