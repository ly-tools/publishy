'use strict';
const program = require('commander');
const path = require('path');
const pkg = require(path.join(__dirname, 'package.json'));
const publishy = require('./index');
program.version(pkg.version)
  .usage('[options] <version>')
  .option('-c, --cwd', 'Project path')
  .action((version, prog) => {
    const cwd = prog.cwd || process.cwd();
    if (type)
      publishy(version, cwd, {});
    else
      program.help();
  });
