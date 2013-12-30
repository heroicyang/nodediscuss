/**
 * test/models/validators/reset_pass.test.js
 * 对密码重置数据的验证逻辑进行测试
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
 should = require('should');
var models = require('../../db').models;
var User = models.User,
  ResetPass = models.ResetPass;
var data = require('../../fixtures/data.json');

describe('models/validators/reset_pass.js', function() {
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
    ResetPass.remove(done);
  });

  after(function(done) {
    User.remove(done);
  });

  it('invalid email should throw ValidationError', function(done) {
    var resetPass = new ResetPass({
      email: 'heroic'
    });
    resetPass.validate(function(err) {
      should.exist(err);
      err.name.should.eql('ValidationError');
      done();
    });
  });

  it('user does not exist should throw ValidationError', function(done) {
    var self = this;
    async.parallel([
      function(next) {
        var resetPass = new ResetPass({
          email: 'foo@bar.com'
        });
        resetPass.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          next(null);
        });
      },
      function(next) {
        var resetPass = new ResetPass({
          email: self.user.email
        });
        resetPass.validate(function(err) {
          should.not.exist(err);
          next(null);
        });
      }
    ], done);
  });

  it('within 24 hours over two times should throw ValidationError', function(done) {
    var self = this;
    async.auto({
      first: function(next) {
        var resetPass = new ResetPass({
          email: self.user.email
        });
        resetPass.save(function(err) {
          next(err);
        });
      },
      second: function(next) {
        var resetPass = new ResetPass({
          email: self.user.email
        });
        resetPass.save(function(err) {
          next(err);
        });
      },
      third: ['first', 'second', function(next) {
        var resetPass = new ResetPass({
          email: self.user.email
        });
        resetPass.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          next(null);
        });
      }]
    }, done);
  });
});