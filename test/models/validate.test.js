/**
 * Module dependencies
 */
var validate = require('../../models/validate');

describe('models/validate.js', function() {
  it('work with `isObjectId` method', function() {
    var fail = validate('123').isObjectId(),
      success = validate('123456789012345678901234').isObjectId();
    fail.should.not.be.ok;
    success.should.be.ok;
  });

  it('work with validate facade method', function() {
    var result = validate('me@heroicyang.com').isEmail();
    result.should.be.ok;
  });
});