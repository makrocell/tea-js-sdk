#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');
const chalk = require('chalk');

const assert = (expression, error_string)=>{
  if(!expression){
    throw error_string;
  }
};

const exec = (cmd)=>{
  execSync(cmd, { stdio: 'inherit' })
};

const F = {
  checkVerison(version){
    const md = version.split('.');
    assert(md.length === 3, 'Invalid verison');
  },

  eachPackage(pkg_name, new_version){
    const path = __dirname+'/../packages/'+pkg_name+'/package.json';
    let txt = fs.readFileSync(path);
    const package = JSON.parse(txt);

    const v = package.version;
    if(v === new_version){
      return;
    }
    console.log(chalk.yellow(`[${pkg_name}]: ${v} -> ${new_version}`));

    txt = txt.toString().replace(`"version": "${v}"`, `"version": "${new_version}"`);
    fs.writeFileSync(path, txt);
  }
};

async function start (){
  const argv = process.argv.slice(2);

  const new_version = argv[0].toString();
  F.checkVerison(new_version);

  const list = ['utils', 'layer1'];


  for(let i=0, len=list.length; i<len; i++){
    const pkg_name = list[i];
    F.eachPackage(pkg_name, new_version);
  }
  
  exec('yarn build');
};

start().catch((e)=>{
  console.log(chalk.red(e));

}).finally(()=>{
  process.chdir(__dirname+'/..');

  process.exit(-1);
})