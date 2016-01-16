# publishy

[![Build Status](https://travis-ci.org/LingyuCoder/publishy.png)](https://travis-ci.org/LingyuCoder/publishy)
[![Dependency Status](https://david-dm.org/LingyuCoder/publishy.svg)](https://david-dm.org/LingyuCoder/publishy)
[![devDependency Status](https://david-dm.org/LingyuCoder/publishy/dev-status.svg)](https://david-dm.org/LingyuCoder/publishy#info=devDependencies)
[![NPM version](http://img.shields.io/npm/v/publishy.svg?style=flat-square)](http://npmjs.org/package/publishy)
[![node](https://img.shields.io/badge/node.js-%3E=_4.0-green.svg?style=flat-square)](http://nodejs.org/download/)
[![License](http://img.shields.io/npm/l/publishy.svg?style=flat-square)](LICENSE)
[![npm download](https://img.shields.io/npm/dm/publishy.svg?style=flat-square)](https://npmjs.org/package/publishy)

Publish modules like a boss

## What does publishy do?

* Run tests
* Run `prepublish` script
* Check that project should on correct version
* Check that project should on correct branch
* Check that all changes have been committed
* Check that all files and directories have been tracked
* Check that dependencies are on the correct versions
* Check that changelog of current version exists
* Check that tag can be used
* Publish to git
* Publish to npm
* Configurable by `.publishrc`

![publishy-demo](http://7q5asf.com1.z0.glb.clouddn.com/publishy-demo.gif)

## Installing

```bash
$ npm install -g publishy
```

## Usage

### Use as a global module

```bash
$ cd your_project
# create default .publishrc file
$ publishy rc

# publish version 1.0.0
$ publishy 1.0.0

# manual
$ publishy -h
Usage: publishy [options] <version>

Options:

  -h, --help       output usage information
  -V, --version    output the version number
  -c, --cwd [cwd]  Project path, default current working directory
```

### Use as a normal module

```javascript
const publishy = require('publishy');
const CWD = process.cwd();

// create .publishrc file
publishy.createRcFile(cwd, {
  // custom configurations
});

// publish version 1.0. in /Users/xxx/myproject with custom configurations
publishy.publish('1.0.0', '/Users/xxx/myproject', {
  // my configurations
});
```

## Default Configurations

**Checking Level**

* `0`: Do not run this checker
* `1`: Only warn if not pass
* `2`: Stop publishing if not pass

```javascript
{
  "checkCommitted": 2, //
  "checkTracked": 2,
  "checkBranch": 2,
  "checkTaggable": 2,
  "checkDepVersion": 2,
  "checkChangelog": 2,
  "checkVersion": 2,
  "runPrepublish": true, // run prepublish script or not
  "runTest": true, // run test or not
  "confirm": true, // confirm before publish or not
  "tagFormat": "<%= version %>", // custom format of tag name
  "branchFormat": "dev/<%= version %>", // custom format of branch name
  "npm": "npm", // npm or tnpm or cnpm
  "remote": "origin", // which remote should new tag be push to
  "type": [ // publish type
    "git", // should create tag and push to git
    "npm" // should run `npm publish`
  ]
}
```

## Custom

### Custom Commands

Commands will be runned before checkers. Commands can be registered like this:

```javascript
const publishy = require('publishy');
const execSync = require('child_process').execSync;
publishy.commands['runRemoveTmp'] = {
  startMsg: 'Removing tmp',
  run: cwd => new Promise(resolve => {
    execSync('rm -rf tmp', {
      cwd: cwd,
      stdio: 'inherit'
    });
    resolve();
  })
};
```

Then in your `.publishrc` file:

```json
{
  "runRemoveTmp": true,
  "commands": [
    "runTest",
    "runPrepublish",
    "runRemoveTmp"
  ]
}
```

### Custom Checkers

Checker can also be added just like the commands:

```javascript
const publishy = require('publishy');
publishy.checkers['checkTmpRemoved'] = {
  /**
   * Name of this checker, it can be configured by .publishrc
   **/
  name: 'checkTmpRemoved',
  /**
   * Message when checking starts
   **/
  startMsg: (version, cwd, config) => `Checking that tmp has been removed`,
  /**
   * Check function, should run a Promise, and resolve an object with success and detail
   * - success: {Boolean} passed or not
   * - detail: {String} if not passed, why. This will passed to failMsg as the first parameter
   **/
  check: (version, cwd, config) => new Promise((resolve, reject) => {
    return {
      success: ifExists(path.join(cwd, 'tmp')),
      detail: 'some reason'
    };
  }),
  /**
   * Message when checking failed
   **/
  failMsg: (detail, version, cwd, config) => `Tmp should be removed, but not because of ${detail}`,
  /**
   * Message when checking successed
   **/
  successMsg: (version, cwd, config) => `Tmp has been removed`
};
```

Then in your `.publishrc` file, you can add it to your checking queue and specific a checking level for it:

```javascript
{
  "checkTmpRemoved": 2,
  "checkers": [
    "checkTmpRemoved",
    "checkVersion",
    "checkBranch",
    "checkCommitted",
    "checkTracked",
    "checkDepVersion",
    "checkChangelog",
    "checkTaggable"
  ]
}
```

### Custom Publisher

You can also reqister new publisher like this:

```javascript
const publishy = require('publishy');
const logger = publishy.logger;
const execSync = require('child_process').execSync;
publishy.publishers['custom'] = (version, cwd, tag, config) => {
  return new Promise(resolve => {
    logger.info(`Custom Publishing:`);
    // custom publishing code
    logger.success(`Publish to ${config.npm} successed`);
    resolve();
  });
};
```

## License

The MIT License (MIT)

Copyright (c) 2015 LingyuCoder

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
