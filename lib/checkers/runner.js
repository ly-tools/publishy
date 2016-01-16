'use strict';

const co = require('co');
const checkers = require('./tasks');
const logger = require('../logger');

module.exports = co.wrap(function*(version, cwd, config) {
  for (let i = 0; i < config.checkers.length; i++) {
    const checkerName = config.checkers[i];
    if (!config[checkerName]) continue;
    const checker = checkers[checkerName];
    if (!checker) return Promise.reject(`Can not find the checker named ${checkerName}`);
    logger.line('');
    logger.info(checker.startMsg(version, cwd, config));
    let rst = yield checker.check(version, cwd, config);
    if (!rst.success) {
      const failMsg = checker.failMsg(rst.detail, version, cwd, config);
      if (config[checkerName] === 2) {
        return Promise.reject(new Error(failMsg));
      }
      logger.warn(failMsg);
      continue;
    }
    logger.success(checker.successMsg(version, cwd, config));
  }
});
