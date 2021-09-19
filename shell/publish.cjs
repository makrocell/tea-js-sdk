#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

const exec = (cmd)=>{
  execSync(cmd, { stdio: 'inherit' })
};

async function start (){
  const argv = process.argv.slice(2);

  const pkg_name = argv[0];
  if(!pkg_name) throw 'Invalid params';

  const path = __dirname+'/../packages/'+pkg_name+'/build/';

  if(!fs.existsSync(path)){
    throw 'No such dir => ['+path+'].';
  }

  process.chdir(path);
  exec('npm publish --registry http://registry.npmjs.org');
  
};

start().catch((e)=>{
  console.error(e);

  
}).finally(()=>{
  process.chdir(__dirname+'/..');

  process.exit(-1);
})