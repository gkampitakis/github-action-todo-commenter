"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const executor_1 = require("./executor");
const tags = ['TODO', 'FIXME'];
const customTags = (0, core_1.getInput)('tags').split(',');
console.log(tags, customTags);
(0, executor_1.executor)(customTags || tags);
