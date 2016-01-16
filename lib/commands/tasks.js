'use strict';

const cmd = require('../cmd');
module.exports = {
  runTest: {
    startMsg: 'Running test',
    run: cwd => cmd('npm run test', cwd)
  },
  runPrepublish: {
    startMsg: 'Running prepublish',
    run: cwd => cmd('npm run prepublish', cwd)
  }
};
