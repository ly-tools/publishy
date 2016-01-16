'use strict';

const co = require('co');
const execSync = require('child_process').execSync;
const _ = require('lodash');
module.exports = _.curryRight(co.wrap(function*(command, cwd) {
  try {
    execSync(command, {
      stdio: 'inherit',
      cwd: cwd
    });
  } catch (e) {
    return Promise.reject(new Error(`Run command ${command} failed`));
  }
}), 2);
