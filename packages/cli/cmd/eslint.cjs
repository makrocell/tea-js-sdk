#!/usr/bin/env node

const {rootDirPath} = require('../helper/index.cjs');

console.log('$ eslint', process.argv.slice(2).join(' '));

process.chdir(rootDirPath());

require('eslint/bin/eslint');
