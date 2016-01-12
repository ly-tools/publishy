'use strict';

require('should');
require('mocha-sinon');
const program = require('../index');
const uncolor = require('uncolor');

describe('publishy', () => {
  let rst;
  beforeEach(function() {
    this.sinon.stub(console, 'log', function() {
      rst = arguments[0];
    });
  });
  it('should print "test"', () => {
    program.parse([
      'node',
      './bin/cli',
      '-t',
      'file.js'
    ]);
    return uncolor(rst).trim().should.be.eql('test');
  });
});
