'use strict';

const path = require('path');
const _ = require('lodash');
const co = require('co');
const fs = require('fs');
const logger = require('./logger');
const DEFAULT_CONFIG = require('./defaultConfig');

const getRcConfig = co.wrap(function*(cwd) {
  let config;
  try {
    config = fs.readFileSync(path.join(cwd, '.publishrc'), 'utf-8');
  } catch (e) {
    logger.warn(`Can not find .publishrc file in ${cwd}`);
    return {};
  }
  try {
    config = JSON.parse(config);
  } catch (e) {
    logger.warn(`Can not parse .publishrc file in ${cwd}`);
    return {};
  }
  return config;
});

module.exports = co.wrap(function*(cwd, config) {
  logger.line('');
  logger.info('Getting configurations...');
  const rcConfig = yield getRcConfig(cwd);
  return _.defaults({}, config || {}, rcConfig, DEFAULT_CONFIG);
});
