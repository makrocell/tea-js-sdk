#!/usr/bin/env node

const {execSync, run, cliDirPath, rootDirPath} = require('../helper/index.cjs');

run(async ()=>{
  const argv = process.argv.slice(2);

  const lint_cmd = cliDirPath('cmd/eslint.cjs');
  const fixed = argv.includes('fixed') ? '--fixed' : ''
  execSync(`node ${lint_cmd} ${fixed} --resolve-plugins-relative-to ${__dirname} --ext .js,.cjs,.mjs,.ts,.tsx ${rootDirPath()}`, true);
});

return;


if (!argv['skip-tsc']) {
  execSync('yarn polkadot-exec-tsc --noEmit --pretty');
}


