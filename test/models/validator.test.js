/**
 * Module dependencies
 */
var validator = require('../../models/validator');

describe('models/validator.js', function() {
  it('add `isObjectId` method', function() {
    var fail = validator.isObjectId('123'),
      success = validator.isObjectId('123456789012345678901234');
    fail.should.not.be.ok;
    success.should.be.ok;
  });
});