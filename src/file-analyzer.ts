import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import path from 'path';
import { Comments, EnhancedTag, FileAnalyzerResults } from './types';
import { warning } from '@actions/core';

export async function fileAnalyzer(
  diffs: { filename: string; patch?: string }[],
  tags: string[]
): Promise<FileAnalyzerResults> {
  const enhancedTags = tags.map(tag => ({
    tag,
    regex: new RegExp(`${tag}(.*)`)
  }));
  const ignoreMinSize = Math.min(...tags.map(t => t.length));
  const result: FileAnalyzerResults = [];

  for (const { filename, patch } of diffs) {
    const absolutePath = path.join(process.cwd(), filename);
    const newComments = parsePatch(enhancedTags, patch);
    let parsedComments: Comments = {};

    try {
      parsedComments = await readFile(
        absolutePath,
        newComments,
        enhancedTags,
        ignoreMinSize
      );
    } catch (error: any) {
      warning(error, {
        file: absolutePath,
        title: "Can't read file"
      });
    }

    if (Object.values(parsedComments).length === 0) continue;

    result.push({
      file: filename,
      comments: parsedComments
    });
  }

  return result;
}

function parsePatch(
  tags: EnhancedTag[],
  patch?: string
): Record<string, string[]> {
  if (!patch) {
    return {};
  }
  const lines = patch.split('\n');
  const addedComments: Record<string, string[]> = {};

  for (const line of lines) {
    if (line[0] !== '+') continue;

    for (const { tag, regex } of tags) {
      const comment = extractCommentFromLine(line, regex);
      if (!comment) continue;

      if (addedComments[tag]) {
        addedComments[tag].push(comment);
        continue;
      }
      addedComments[tag] = [comment];
    }
  }

  return addedComments;
}

async function readFile(
  filepath: string,
  newComments: Record<string, string[]>,
  tags: EnhancedTag[],
  ignoreMinSize: number
): Promise<Comments> {
  let lineCounter = 0;
  const comments: Comments = {};
  const patchExists = Boolean(Object.keys(newComments).length);
  const stream = createReadStream(filepath, 'utf-8');
  const rl = createInterface({
    input: stream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    lineCounter++;
    if (ignoreMinSize > line.length) continue;

    for (const { tag, regex } of tags) {
      const comment = extractCommentFromLine(line, regex);
      if (!comment) continue;
      if (patchExists && isOldComment(newComments[tag], comment)) continue;

      if (comments[tag]) {
        comments[tag].push({
          comment,
          line: lineCounter
        });
        continue;
      }

      comments[tag] = [
        {
          comment,
          line: lineCounter
        }
      ];
    }
  }

  return comments;
}

function isOldComment(newComments: string[], comment: string): boolean {
  return !newComments?.includes(comment);
}

function extractCommentFromLine(line: string, rgx: RegExp): string {
  const matched = line.match(rgx);
  return matched ? matched[1].trim() : '';
}
