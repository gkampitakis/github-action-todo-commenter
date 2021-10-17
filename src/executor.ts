import { context } from '@actions/github';
import { readdir } from 'fs';

export function executor(tags: string[]) {
  const testFolder = './';

  // We need to do the checkout to that branch
  // Take the diff, read each file and find occurrences of tags

  readdir(testFolder, (err, files) => {
    files.forEach(file => {
      console.log(file);
    });
  });

  console.log(context.payload, tags);
}
