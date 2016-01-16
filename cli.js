'use strict';
const program = require('commander');
const path = require('path');
const pkg = require(path.join(__dirname, 'package.json'));
const publishy = require('./index');
const logger = require('./lib/logger');

program.version(pkg.version)
  .usage('[options] <version>')
  .option('-c, --cwd [cwd]', 'Project path, default current working directory')
  .parse(process.argv);

const version = program.args[0];

if (!version)
  program.help();
else if (version === 'rc')
  publishy.createRcFile(program.cwd || process.cwd(), {}).catch(e => logger.error(e.message));
else
  publishy.publish(version, program.cwd || process.cwd(), {}).catch(e => logger.error(e.message));
