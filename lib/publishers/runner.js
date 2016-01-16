'use strict';

const _ = require('lodash');
const co = require('co');
const publishers = require('./tasks');
const logger = require('../logger');

module.exports = co.wrap(function*(version, cwd, config) {
  const tag = _.template(config.tagFormat)({
    version: version
  });
  logger.line('');
  logger.info('Publish info:');
  logger.info(`CWD: ${cwd}`);
  logger.info(`Version: ${version}`);
  logger.info(`Tag: ${tag}`);
  for (let i = 0; i < config.type.length; i++) {
    logger.line('');
    const type = config.type[i];
    if (publishers[type])
      yield publishers[type](version, cwd, tag, config);
    else
      logger.error(`Can not find publisher of type ${type}`);
  }
});
