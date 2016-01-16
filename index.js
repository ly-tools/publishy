'use strict';

const _ = require('lodash');
const co = require('co');
const path = require('path');
const fs = require('fs');
const precmd = require('./lib/commands/runner');
const check = require('./lib/checkers/runner');
const publish = require('./lib/publishers/runner');
const confirm = require('./lib/confirm/runner');
const logger = require('./lib/logger');
const getConfig = require('./lib/getConfig');
const fileExists = require('./lib/fileExists');
const DEFAULT_CONFIG = require('./lib/defaultConfig');

module.exports = {
  logger: logger,
  checkers: require('./lib/checkers/tasks'),
  commands: require('./lib/commands/tasks'),
  publishers: require('./lib/publishers/tasks'),
  publish: co.wrap(function*(version, cwd, config) {
    config = yield getConfig(cwd, config);
    yield precmd(cwd, config);
    yield check(version, cwd, config);
    let pub = yield confirm(version);
    if (!pub) {
      logger.error('Publish canceled');
      return;
    }
    yield publish(version, cwd, config);
  }),
  createRcFile: co.wrap(function*(cwd, config) {
    const rcPath = path.join(cwd, '.publishrc');
    if (fileExists(rcPath)) return Promise.reject(new Error(`.publishrc file has been exists in ${cwd}`));
    try {
      fs.writeFileSync(rcPath, JSON.stringify(_.defaults({}, config, DEFAULT_CONFIG), null, 2), 'utf-8');
      logger.success(`.publishrc file has been created in ${cwd}`);
    } catch (e) {
      return Promise.reject(e);
    }
  })
};
