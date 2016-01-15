'use strict';

const co = require('co');
const execSync = require('child_process').execSync;
const logger = require('./logger');
const _ = require('lodash');
module.exports = _.curryRight(co.wrap(function*(command, cwd) {
  try {
    execSync(command, {
      stdio: 'inherit',
      cwd: cwd
    });
    return true;
  } catch (e) {
    logger.error(e.message);
    return false;
  }
}), 2);
