'use strict';

const co = require('co');
// const _ = require('lodash');
const loadPkg = require('./loadPkg');
// const checkers = require('./checkers');
const commands = require('./commands');
const logger = require('./logger');

const runCommands = co.wrap(function*(cwd, config) {
  for (let i = 0; i < commands.length; i++) {
    const command = commands[i];
    if (!config[command.name]) continue;
    logger.info(command.startMsg);
    let rst = yield command.run(cwd);
    if (!rst) return Promise.reject(new Error('Run command failed'));
  }
});

module.exports = co.wrap(function*(version, cwd, config) {
  // const pkg = yield loadPkg(cwd);
  yield runCommands(cwd, config);
});
