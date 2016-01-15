'use strict';

const co = require('co');
const semver = require('semver');
const loadPkg = require('./loadPkg');

module.exports = co.wrap(function*(version, cwd) {
  const pkg = yield loadPkg(cwd);
  const current = pkg.version;
  if (!semver.valid(version)) return Promise.reject(new Error(`Version ${version} is not valid`));
  return {
    success: version === current,
    detail: current
  };
});
