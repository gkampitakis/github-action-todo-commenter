import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import path from 'path';
import { Comments, EnhancedTag, FileAnalyzerResults } from './types';

export async function fileAnalyzer(
  filePaths: string[],
  tags: string[]
): Promise<FileAnalyzerResults> {
  const enhancedTags = tags.map(tag => ({
    tag,
    regex: new RegExp(`${tag}(.*)`)
  }));
  const ignoreMinSize = Math.min(...tags.map(t => t.length));
  const result: FileAnalyzerResults = [];

  for (const filePath of filePaths) {
    const absolutePath = path.join(process.cwd(), filePath);
    const comments = await readFile(absolutePath, enhancedTags, ignoreMinSize);

    result.push({
      file: filePath,
      comments
    });
  }

  return result;
}

async function readFile(
  filepath: string,
  tags: EnhancedTag[],
  ignoreMinSize: number
): Promise<Comments> {
  const comments: Comments = {};
  const stream = createReadStream(filepath, 'utf-8');
  const rl = createInterface({
    input: stream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (ignoreMinSize > line.length) continue;

    for (const { tag, regex } of tags) {
      const matched = line.match(regex);

      if (!matched) continue;

      const comment = matched[1].trim();

      if (comments[tag]) {
        comments[tag].push(comment);
        continue;
      }

      comments[tag] = [comment];
    }
  }

  return comments;
}
