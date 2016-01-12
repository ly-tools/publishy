'use strict';

const _ = require('lodash');

module.exports = [{
  name: 'checkVersion',
  startMsg: version => `Checking that should on version ${version}`,
  getParams: (version, cwd) => [version, cwd],
  check: require('./checkVersion'),
  failMsg: (detail, version) => `Should on version ${version}, but current on version ${detail}`,
  successMsg: () => `On the right version`
}, {
  name: 'checkBranch',
  startMsg: (version, cwd, config) => {
    const branch = _.template(config.branchFormat)({
      version: version
    });
    return `Checking that should on branch ${branch}`;
  },
  getParams: (version, cwd, config) => {
    const branch = _.template(config.branchFormat)({
      version: version
    });
    return [branch, cwd];
  },
  check: require('check-branch'),
  failMsg: (detail, version, cwd, config) => {
    const branch = _.template(config.branchFormat)({
      version: version
    });
    return `Should on branch ${branch}, but current on branch ${detail}`;
  },
  successMsg: () => `On the right branch`
}, {
  name: 'checkCommitted',
  startMsg: () => `Checking no uncommitted changes`,
  getParams: (version, cwd) => [cwd],
  check: require('check-committed'),
  failMsg: detail => {
    detail = detail.map(change => `${change.code} ${change.file}`).join('\n');
    return `Found uncommitted changes, please run 'git commit':\n${detail})}`;
  },
  successMsg: `All changes had been committed`
}, {
  name: 'checkTracked',
  startMsg: () => `Checking no untracked file or folder`,
  getParams: (version, cwd) => [cwd],
  check: require('check-tracked'),
  failMsg: detail => `Found untracked files or folders, please run 'git add --all' before publish:\n${detail.join('\n')})}`,
  successMsg: `All files had been tracked`
}, {
  name: 'checkDepVersion',
  startMsg: () => `Checking versions of dependencies`,
  getParams: (version, cwd) => [cwd],
  check: require('check-dep-version'),
  failMsg: detail => {
    detail = detail.map(dep => `${dep.name} current:${dep.version} expected:${dep.expected}`).join('\n');
    return `Found that these dependencies did not match versions in package.json:\n${detail}`;
  },
  successMsg: () => `All dependencies have right versions`
}, {
  name: 'checkChangelog',
  startMsg: version => `Checking changelog of version ${version}`,
  getParams: (version, cwd) => [cwd],
  check: require('check-changelog'),
  failMsg: (detail, version) => `Can not found any changelog of version ${version}`,
  successMsg: `Changelog check passed`
}, {
  name: 'checkTaggable',
  startMsg: (version, cwd, config) => {
    const tag = _.template(config.tagFormat)({
      version: version
    });
    return `Checking that tag ${tag} can be used`;
  },
  getParams: (version, cwd, config) => {
    const tag = _.template(config.tagFormat)({
      version: version
    });
    return [tag, cwd];
  },
  check: require('check-taggable'),
  failMsg: (detail, version, cwd, config) => {
    const tag = _.template(config.tagFormat)({
      version: version
    });
    return `Tag ${tag} already exists`;
  },
  successMsg: () => `Tag can be used`
}];
