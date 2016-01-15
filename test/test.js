'use strict';

require('should');
const publishy = require('../index');

describe('publishy', () => {
  it('should print "test"', () => {
    return publishy('0.0.2', '/Users/lingyu/github/publishy-test', {});
  });
});
