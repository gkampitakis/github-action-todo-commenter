"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executor = void 0;
const github_1 = require("@actions/github");
const fs_1 = require("fs");
function executor(tags) {
    const testFolder = './';
    (0, fs_1.readdir)(testFolder, (err, files) => {
        files.forEach(file => {
            console.log(file);
        });
    });
    console.log(github_1.context.payload, tags);
}
exports.executor = executor;
