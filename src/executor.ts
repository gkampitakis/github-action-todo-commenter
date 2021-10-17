import { context } from '@actions/github';
import { getInput } from '@actions/core';
import { fileAnalyzer } from './file-analyzer';

export async function executor() {
  const customTags = getInput('tags').split(',');

  const comments = await fileAnalyzer([], customTags);

  console.log(comments);
  console.log(context.payload);
}
