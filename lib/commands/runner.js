'use strict';

const co = require('co');
const commands = require('./tasks');
const logger = require('../logger');

module.exports = co.wrap(function*(cwd, config) {
  for (let i = 0; i < config.commands.length; i++) {
    const commandName = config.commands[i];
    if (!config[commandName]) continue;
    const command = commands[commandName];
    logger.line('');
    logger.info(command.startMsg);
    yield command.run(cwd);
  }
});
