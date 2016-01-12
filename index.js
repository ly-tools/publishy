'use strict';
const program = require('commander');
const path = require('path');
const pkg = require(path.join(__dirname, 'package.json'));

const publishers = {
  git: require('./lib/git'),
  node: require('./lib/node')
};

const DEFAULT_CONFIG = {
  checkCommitted: 2,
  checkTracked: 2,
  checkBranch: 2,
  checkTaggable: 2,
  checkDepVersion: 2,
  checkChangelog: 2,
  checkVersion: 2,
  runPrepublish: true,
  runTest: true,
  tagFormat: `<%= version %>`,
  branchFormat: `<%= version %>`
};

program.version(pkg.version)
  .usage('[options] <version>')
  .option('-c, --cwd', 'Project path')
  .option('-t, --type [type]', 'Use default publish type')
  .action((version, prog) => {
    const cwd = prog.cwd || process.cwd();
    if (type && publishers[type])
      publishers[type](version, cwd, DEFAULT_CONFIG);
    else
      program.help();
  });

module.exports = program;
