const execSync = require('./execSync.cjs');
const chalk = require('chalk');

module.exports = function (script_name, ...args) {
  const path = __dirname+'/../script/'+script_name+'.cjs';

  console.log(chalk.green('[script]: '+path));

  execSync('node '+path+' '+args.join(' '));
};