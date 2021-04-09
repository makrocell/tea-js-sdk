#!/usr/bin/env node

const {rootDirPath} = require('../helper/index.cjs');

process.env.NODE_OPTIONS = `--experimental-vm-modules${
  process.env.NODE_OPTIONS
    ? ` ${process.env.NODE_OPTIONS}`
    : ''
}`;

process.chdir(rootDirPath());

// eslint-disable-next-line
require('jest-cli/bin/jest');
