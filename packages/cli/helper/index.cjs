
const chalk = require('chalk');

exports.execSync = require('./execSync.cjs');
exports.execScript = require('./execScript.cjs');
exports.copySync = require('./copySync.cjs');

exports.run = async function (fn) {
  fn().catch((error) => {
    console.log(chalk.red(`script error\n${error}`));
  }).finally(()=>{
    console.log('----- END -----');
    process.chdir(rootDirPath());
    process.exit(0);
  });
}

const rootDirPath = exports.rootDirPath = (ch_path) => {
  ch_path = ch_path || '';
  return __dirname+'/../../../'+ch_path;
};
exports.cliDirPath = (ch_path) => {
  ch_path = ch_path || '';
  return __dirname+'/../'+ch_path;
};
