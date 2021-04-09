#!/usr/bin/env node


const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

const {rootDirPath} = require('../helper/index.cjs');

const PKGS = rootDirPath('packages');


function getDirs (dir) {
  return [path.join(dir, 'build'), path.join(dir, 'build-docs')];
}

function cleanDirs (dirs) {
  dirs.forEach((dir) => rimraf.sync(dir));
}

cleanDirs(getDirs(process.cwd()));

if (fs.existsSync(PKGS)) {
  cleanDirs(
    fs
      .readdirSync(PKGS)
      .map((file) => path.join(PKGS, file))
      .filter((file) => fs.statSync(file).isDirectory())
      .reduce((arr, dir) => arr.concat(getDirs(dir)), [])
  );
}
