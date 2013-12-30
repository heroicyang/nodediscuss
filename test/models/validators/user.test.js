/**
 * test/models/validators/user.test.js
 * 对用户数据的验证逻辑进行测试
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  should = require('should');
var models = require('../../db').models;
var User = models.User;
var data = require('../../fixtures/data.json');

describe('models/validators/user.js', function() {
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

  it('invalid email should throw ValidationError', function(done) {
    var user = new User({
      email: 'heroic',
      username: 'test1234',
      password: '123123132'
    });
    user.validate(function(err) {
      should.exist(err);
      err.name.should.eql('ValidationError');
      done();
    });
  });

  it('exists email should throw ValidationError', function(done) {
    var user = new User({
      email: this.user.email,
      username: 'test1234',
      password: '123123123'
    });
    user.validate(function(err) {
      should.exist(err);
      err.name.should.eql('ValidationError');
      done();
    });
  });

  it('username length must be more than 6 characters', function(done) {
    var user = new User({
      email: 'foo@bar.com',
      username: 'foo',
      password: '123123213'
    });
    user.validate(function(err) {
      should.exist(err);
      err.name.should.eql('ValidationError');
      done();
    });
  });

  it('username length must be less than 16 characters', function(done) {
    var user = new User({
      email: 'foo@bar.com',
      username: (new Array(16)).join('foo'),
      password: '123123213'
    });
    user.validate(function(err) {
      should.exist(err);
      err.name.should.eql('ValidationError');
      done();
    });
  });

  it('exists username should throw ValidationError', function(done) {
    var user = new User({
      email: 'foo@bar.com',
      username: this.user.username,
      password: '123123123'
    });
    user.validate(function(err) {
      should.exist(err);
      err.name.should.eql('ValidationError');
      done();
    });
  });

  it('password length must be more than 6 characters', function(done) {
    var user = new User({
      email: 'foo@bar.com',
      username: 'foobar',
      password: '123'
    });
    user.validate(function(err) {
      should.exist(err);
      err.name.should.eql('ValidationError');
      done();
    });
  });

  it('password length must be less than 31 characters', function(done) {
    var user = new User({
      email: 'foo@bar.com',
      username: 'foobar',
      password: (new Array(33)).join('1')
    });
    user.validate(function(err) {
      should.exist(err);
      err.name.should.eql('ValidationError');
      done();
    });
  });

  it('if provide the website it should be valid', function(done) {
    async.parallel([
      function(next) {
        var user = new User({
          email: 'foo@bar.com',
          username: 'foobar',
          password: '123456',
          website: 'asdasd'
        });
        user.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          next();
        });
      },
      function(next) {
        var user = new User({
          email: 'foo@bar.com',
          username: 'foobar',
          password: '123456',
          website: ''
        });
        user.validate(function(err) {
          should.not.exist(err);
          next();
        });
      }
    ], done);
  });
});