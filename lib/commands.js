'use strict';

const cmd = require('./cmd');
module.exports = [{
  startMsg: 'Running test',
  name: 'runTest',
  run: cwd => cmd('npm run test', cwd)
}, {
  startMsg: 'Running prepublish hook',
  name: 'runPrepublish',
  run: cwd => cmd('npm run prepublish', cwd)
}];
