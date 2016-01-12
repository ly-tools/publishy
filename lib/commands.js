'use strict';
const execSync = require('child_process').execSync;
const co = require('co');
const cmd = co.wrap(function*(command, cwd) {
  try {
    execSync(command, {
      stdio: 'inherit',
      cwd: cwd
    });
    return true;
  } catch (e) {
    return false;
  }
});
module.exports = [{
  startMsg: 'Running test',
  name: 'runTest',
  run: cwd => cmd('npm run test', cwd)
}, {
  startMsg: 'Running prepublish hook',
  name: 'runPrepublish',
  run: cwd => cmd('npm run prepublish', cwd)
}];
