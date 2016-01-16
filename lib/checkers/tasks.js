'use strict';

const _ = require('lodash');

module.exports = {
  checkVersion: {
    startMsg: version => `Checking that project should on version ${version}`,
    check: (version, cwd) => require('./checkVersion')(version, cwd),
    failMsg: (detail, version) => `Should on version ${version}, but current on version ${detail}`,
    successMsg: () => `On the correct version`
  },
  checkBranch: {
    startMsg: (version, cwd, config) => {
      const branch = _.template(config.branchFormat)({
        version: version
      });
      return `Checking that should on branch ${branch}`;
    },
    check: (version, cwd, config) => {
      const branch = _.template(config.branchFormat)({
        version: version
      });
      const checker = require('check-branch');
      return checker(branch, cwd);
    },
    failMsg: (detail, version, cwd, config) => {
      const branch = _.template(config.branchFormat)({
        version: version
      });
      return `Should on branch ${branch}, but current on branch ${detail}`;
    },
    successMsg: () => `On the correct branch`
  },
  checkCommitted: {
    startMsg: () => `Checking that all changes have been committed`,
    check: (version, cwd) => require('check-committed')(cwd),
    failMsg: detail => {
      detail = detail.map(change => `${change.code} ${change.file}`).join('\n');
      return `Found uncommitted changes, please run 'git commit':\n${detail}`;
    },
    successMsg: () => `All changes have been committed`
  },
  checkTracked: {
    startMsg: () => `Checking that all files and directories have been tracked`,
    check: (version, cwd) => require('check-tracked')(cwd),
    failMsg: detail => `Found untracked files or directories, please run 'git add --all' before publish:\n${detail.join('\n')}`,
    successMsg: () => `All files and directories have been tracked`
  },
  checkDepVersion: {
    startMsg: () => `Checking that dependencies are on the correct versions`,
    check: (version, cwd) => require('check-dep-version')(cwd),
    failMsg: detail => {
      detail = detail.map(dep => `${dep.name} current:${dep.version} expected:${dep.expected}`).join('\n');
      return `Found that these dependencies did not match versions in package.json:\n${detail}`;
    },
    successMsg: () => `Dependencies are on the correct versions`
  },
  checkChangelog: {
    name: 'checkChangelog',
    startMsg: version => `Checking changelog of version ${version}`,
    check: (version, cwd) => require('check-changelog')(cwd),
    failMsg: (detail, version) => `Could not find any changelog of version ${version}`,
    successMsg: () => `Changelog found`
  },
  checkTaggable: {
    startMsg: (version, cwd, config) => {
      const tag = _.template(config.tagFormat)({
        version: version
      });
      return `Checking that tag ${tag} can be used`;
    },
    check: (version, cwd, config) => {
      const tag = _.template(config.tagFormat)({
        version: version
      });
      const checker = require('check-taggable');
      return checker(tag, cwd);
    },
    failMsg: (detail, version, cwd, config) => {
      const tag = _.template(config.tagFormat)({
        version: version
      });
      return `Tag ${tag} already exists`;
    },
    successMsg: () => `Tag can be used`
  }
};
