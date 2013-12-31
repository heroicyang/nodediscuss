/**
 * test/models/middlewares/relation.test.js
 * 对关系链数据模型的中间件逻辑进行测试
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  should = require('should');
var models = require('../../db').models;
var User = models.User,
  Relation = models.Relation,
  Notification = models.Notification;
var data = require('../../fixtures/data.json');

describe('models/middlewares/relation.js', function() {
  before(function(done) {
    var self = this;
    User.create(data.users, function(err, user1, user2) {
      if (err) {
        throw err;
      }
      self.user1 = user1;
      self.user2 = user2;
      done();
    });
  });

  after(function(done) {
    Notification.remove(done);
  });

  after(function(done) {
    Relation.remove(done);
  });

  after(function(done) {
    User.remove(done);
  });

  it('increase master\'s followingCount when follow a user', function(done) {
    var self = this;
    async.auto({
      master: function(next) {
        User.findById(self.user1.id, next);
      },
      follow: function(next) {
        Relation.create({
          userId: self.user1.id,
          friendId: self.user2.id
        }, next);
      },
      check: ['master', 'follow', function(next, results) {
        User.findById(self.user1.id, function(err, user) {
          if (err) {
            return next(err);
          }
          user.followingCount.should.eql(results.master.followingCount + 1);
          next(null);
        });
      }]
    }, done);
  });

  it('increase the followerCount when the user is followed', function(done) {
    var self = this;
    async.auto({
      user: function(next) {
        User.findById(self.user2.id, next);
      },
      follow: function(next) {
        Relation.create({
          userId: self.user1.id,
          friendId: self.user2.id
        }, next);
      },
      check: ['user', 'follow', function(next, results) {
        User.findById(self.user2.id, function(err, user) {
          if (err) {
            return next(err);
          }
          user.followerCount.should.eql(results.user.followerCount + 1);
          next(null);
        });
      }]
    }, done);
  });

  it('send notification when the user is followed', function(done) {
    var self = this;
    async.waterfall([
      function follow(next) {
        Relation.create({
          userId: self.user1.id,
          friendId: self.user2.id
        }, next);
      },
      function check(relation, next) {
        Notification.findOne({
          masterId: relation.friendId,
          userId: relation.userId
        }, function(err, notification) {
          if (err) {
            return next(err);
          }
          should.exist(notification);
          next(null);
        });
      }
    ], done);
  });

  it('decrease master\'s followingCount when unfollow a user', function(done) {
    var self = this;
    async.auto({
      master: function(next) {
        User.findById(self.user1.id, next);
      },
      unfollow: function(next) {
        Relation.findOne({
          userId: self.user1.id,
          friendId: self.user2.id
        }, function(err, relation) {
          if (err) {
            return next(err);
          }
          relation.remove(next);
        });
      },
      check: ['master', 'unfollow', function(next, results) {
        User.findById(self.user1.id, function(err, user) {
          if (err) {
            return next(err);
          }
          user.followingCount.should.eql(results.master.followingCount - 1);
          next(null);
        });
      }]
    }, done);
  });

  it('decrease the followerCount when the user is unfollowed', function(done) {
    var self = this;
    async.auto({
      user: function(next) {
        User.findById(self.user2.id, next);
      },
      follow: function(next) {
        Relation.findOne({
          userId: self.user1.id,
          friendId: self.user2.id
        }, function(err, relation) {
          if (err) {
            return next(err);
          }
          relation.remove(next);
        });
      },
      check: ['user', 'follow', function(next, results) {
        User.findById(self.user2.id, function(err, user) {
          if (err) {
            return next(err);
          }
          user.followerCount.should.eql(results.user.followerCount - 1);
          next(null);
        });
      }]
    }, done);
  });
});