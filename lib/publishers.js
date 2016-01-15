'use strict';

const co = require('co');
const logger = require('./logger');
const cmd = require('./cmd');

module.exports = {
  git: co.wrap(function*(version, cwd, tag, config) {
    const run = cmd(cwd);
    logger.info(`Publishing to git:`);
    yield run(`git tag -a ${tag} -m ${version}`, cwd);
    yield run(`git push ${config.remote} ${tag}`, cwd);
    logger.success(`Publish successed`);
  }),
  npm: co.wrap(function*(version, cwd, tag, config) {
    const run = cmd(cwd);
    logger.info(`Publishing to ${config.npm}:`);
    yield run(`${config.npm} publish`, cwd);
    logger.success(`Publish to ${config.npm} successed`);
  })
};
