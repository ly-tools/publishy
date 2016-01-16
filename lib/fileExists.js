'use strict';
const fs = require('fs');

module.exports = file => {
  try {
    let stat = fs.statSync(file);
    return stat.isFile();
  } catch (e) {
    return false;
  }
};
