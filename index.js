'use strict';
const program = require('commander');
const path = require('path');
const pkg = require(path.join(__dirname, 'package.json'));


program.version(pkg.version)
  .usage('[options] <type>')
  .option('-t, --test', 'Run test')
  .action((type, prog) => {
    if (type === 'git') {
      publishGit();
    } else if (type === 'node') {
      publishNode();
    } else {
      program.help();
    }
  });

module.exports = program;
