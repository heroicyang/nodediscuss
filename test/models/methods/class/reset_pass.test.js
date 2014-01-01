/**
 * test/models/methods/class/reset_pass.test.js
 * 测试 ResetPass 的类方法
 * @author heroic
 */

/**
 * Module dependencies
 */
var should = require('should');
var models = require('../../../db').models;
var User = models.User,
  ResetPass = models.ResetPass;
var data = require('../../../fixtures/data.json');

describe('models/methods/class/reset_pass.js', function() {
  before(function createUsers(done) {
    var self = this;
    User.create(data.users, function(err, user) {
      if (err) {
        throw err;
      }
      self.user = user;
      done();
    });
  });

  after(function(done) {
    User.remove(done);
  });

  after(function(done) {
    ResetPass.remove(done);
  });

  it('ResetPass.add(userData, callback): create password reset record', function(done) {
    ResetPass.add({
      email: this.user.email
    }, function(err, resetPass) {
      if (err) {
        throw err;
      }
      should.exist(resetPass);
      done();
    });
  });

  it('ResetPass.get(conditions, callback): find one password reset record', function(done) {
    ResetPass.get({
      email: this.user.email
    }, function(err, resetPass) {
      if (err) {
        throw err;
      }
      should.exist(resetPass);
      done();
    });
  });

  it('ResetPass.setAvailable(options, callback): set the available state', function(done) {
    ResetPass.add({
      email: this.user.email
    }, function(err, resetPass) {
      if (err) {
        throw err;
      }

      ResetPass.setAvailable({
        id: resetPass.id,
        available: false
      }, function(err, resetPass) {
        if (err) {
          throw err;
        }
        resetPass.available.should.not.be.ok;
        done();
      });
    });
  });
});