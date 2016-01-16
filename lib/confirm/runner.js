'use strict';

const inquirer = require('inquirer');

module.exports = version => {
  return new Promise(resolve => {
    inquirer.prompt({
      type: 'confirm',
      name: 'continue',
      message: `Are you sure to publish version ${version}?`,
      'default': true
    }, answer => resolve(answer.continue));
  });
};
