'use strict';
const fs = require('fs');
const path = require('path');
const co = require('co');

module.exports = co.wrap(function*(dir) {
  let pkg;
  try {
    pkg = fs.readFileSync(path.join(dir, 'package.json'), 'utf-8');
  } catch (e) {
    if (e.message.indexOf('ENOENT') !== -1)
      return Promise.reject(new Error(`Can not find package.json in ${dir}`));
    return Promise.reject(e);
  }
  try {
    pkg = JSON.parse(pkg);
  } catch (e) {
    return Promise.reject(new Error(`Can not parse package.json in ${dir}`));
  }
  return pkg;
});
