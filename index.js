'use strict';

const _ = require('lodash');
const co = require('co');
const inquirer = require('inquirer');
const commands = require('./lib/commands');
const checkers = require('./lib/checkers');
const publishers = require('./lib/publishers');
const logger = require('./lib/logger');

const DEFAULT_CONFIG = {
  checkCommitted: 2,
  checkTracked: 2,
  checkBranch: 2,
  checkTaggable: 2,
  checkDepVersion: 2,
  checkChangelog: 2,
  checkVersion: 2,
  runPrepublish: true,
  runTest: true,
  confirm: true,
  tagFormat: `<%= version %>`,
  branchFormat: `dev/<%= version %>`,
  npm: 'npm',
  remote: 'origin',
  type: ['git', 'npm']
};

const runCommands = co.wrap(function*(cwd, config) {
  for (let i = 0; i < commands.length; i++) {
    const command = commands[i];
    if (!config[command.name]) continue;
    logger.line('');
    logger.info(command.startMsg);
    let rst = yield command.run(cwd);
    if (!rst) return Promise.reject(new Error('Run command failed'));
  }
});

const runCheckers = co.wrap(function*(version, cwd, config) {
  for (let i = 0; i < checkers.length; i++) {
    const checker = checkers[i];
    if (!config[checker.name]) continue;
    logger.line('');
    logger.info(checker.startMsg(version, cwd, config));
    let rst = yield checker.check(version, cwd, config);
    if (!rst.success) {
      const failMsg = checker.failMsg(rst.detail, version, cwd, config);
      if (config[checker.name] === 2) {
        logger.error(failMsg);
        return Promise.reject(new Error(failMsg));
      }
      logger.warn(failMsg);
      continue;
    }
    logger.success(checker.successMsg(version, cwd, config));
  }
});

const confirm = version => {
  return new Promise(resolve => {
    inquirer.prompt({
      type: 'confirm',
      name: 'continue',
      message: `Are you sure to publish version ${version}?`,
      'default': false
    }, answer => resolve(answer.continue));
  });
};

module.exports = co.wrap(function*(version, cwd, config) {
  config = _.defaults(config, DEFAULT_CONFIG);
  yield runCommands(cwd, config);
  yield runCheckers(version, cwd, config);
  let pub = yield confirm(version);
  if (!pub) {
    logger.error('Publish canceled');
    return;
  }
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
