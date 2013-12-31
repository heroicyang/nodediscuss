/**
 * test/models/methods/instance/user.test.js
 * 测试 User 的实例方法
 * @author heroic
 */

/**
 * Module dependencies
 */
var should = require('should');
var models = require('../../../db').models;
var User = models.User;

describe('models/methods/instance/user.js', function() {
  it('User#authenticate(plainText): authenticate user\'s password', function() {
    var user = new User({
      email: 'foo@bar.com',
      username: 'foobar',
      password: '111111'
    });

    user.authenticate('111111').should.be.ok;
    user.authenticate('123456').should.not.be.ok;
  });

  it('User#makeSalt(): generate a random string', function() {
    var user = new User({
      email: 'foo@bar.com',
      username: 'foobar',
      password: '111111'
    });
    should.exist(user.makeSalt());
    user.makeSalt().should.be.a.String;

    var randomStr1 = user.makeSalt();
    var randomStr2 = user.makeSalt();
    randomStr1.should.not.eql(randomStr2);
  });

  it('User#encryptPassword(password): encrypt password', function() {
    var user = new User({
      email: 'foo@bar.com',
      username: 'foobar',
      password: '111111'
    });
    var user1 = new User({
      email: 'foo1@bar.com',
      username: 'foobar1',
      password: '111111'
    });

    var passwordHashed = user.encryptPassword(user.password),
      passwordHashed1 = user1.encryptPassword(user1.password);
    should.exist(passwordHashed);
    passwordHashed.should.not.eql(user.password);
    passwordHashed.should.not.eql(passwordHashed1);
  });
});