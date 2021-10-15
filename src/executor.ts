import { context, getOctokit } from '@actions/github';
import { readdir } from 'fs';

export function executor(tags: string[]) {
  const testFolder = './';

  readdir(testFolder, (err, files) => {
    files.forEach(file => {
      console.log(file);
    });
  });

  console.log(context.payload, tags);
}