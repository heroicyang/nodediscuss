/**
 * test/models/methods/class/relation.test.js
 * 测试 Relation 的类方法
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  should = require('should');
var models = require('../../../db').models;
var User = models.User,
  Relation = models.Relation;
var data = require('../../../fixtures/data.json');

describe('models/methods/class/relation.js', function() {
  before(function createUsers(done) {
    var self = this;
    User.create(data.users, function(err, user, user1) {
      if (err) {
        throw err;
      }
      self.user = user;
      self.user1 = user1;
      done();
    });
  });

  after(function(done) {
    User.remove(done);
  });

  after(function(done) {
    Relation.remove(done);
  });

  it('Relation.query(options, callback): query friends id', function(done) {
    async.parallel([
      function(next) {
        Relation.query({}, function(err, count, friendIds) {
          if (err) {
            return next(err);
          }
          count.should.be.a.Number;
          friendIds.should.be.an.Array;
          count.should.eql(friendIds.length);
          count.should.eql(0);
          next(null);
        });
      },
      function(next) {
        Relation.query({
          notPaged: true
        }, function(err, count, friendIds) {
          if (err) {
            return next(err);
          }
          count.should.be.a.Number;
          friendIds.should.be.an.Array;
          count.should.eql(friendIds.length);
          count.should.eql(0);
          next(null);
        });
      }
    ], done);
  });

  it('Relation.add(data, callback): follow a user', function(done) {
    var self = this;
    Relation.add({
      userId: this.user.id,
      targetId: this.user1.id
    }, function(err, result) {
      if (err) {
        throw err;
      }
      should.exist(result);
      result.friendId.should.eql(self.user1.id);
      result.followed.should.be.ok;
      done();
    });
  });

  it('Relation.destroy(data, callback): unfollow a user', function(done) {
    var self = this;
    async.parallel([
      function(next) {
        Relation.destroy({
          userId: self.user.id,
          targetId: self.user1.id
        }, function(err, result) {
          if (err) {
            return next(err);
          }
          should.exist(result);
          result.friendId.should.eql(self.user1.id);
          result.followed.should.not.be.ok;
          next(null);
        });
      },
      function(next) {
        Relation.destroy({
          userId: self.user1.id,
          targetId: self.user.id
        }, function(err, result) {
          if (err) {
            return next(err);
          }
          should.not.exist(result);
          next(null);
        });
      }
    ], done);
  });

  it('Relation.check(options, callback): check relation', function(done) {
    var self = this;
    async.waterfall([
      function follow(next) {
        Relation.add({
          userId: self.user.id,
          targetId: self.user1.id
        }, function(err) {
          next(err);
        });
      },
      function check(next) {
        Relation.check({
          userId: self.user.id,
          targetId: self.user1.id
        }, function(err, followed) {
          if (err) {
            return next(err);
          }
          followed.should.be.ok;
          next(null);
        });
      }
    ], done);
  });
});