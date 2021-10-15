import { getInput } from '@actions/core';
import { executor } from './executor';

const tags = ['TODO', 'FIXME'];
const customTags = getInput('tags').split(',');

console.log(tags, customTags);


executor(customTags || tags);
