/**
 * test/models/methods/class/notification.test.js
 * 测试 Notification 的类方法
 * @author heroic
 */

/**
 * Module dependencies
 */
var models = require('../../../db').models;
var User = models.User,
  Notification = models.Notification;
var data = require('../../../fixtures/data.json');

describe('models/methods/class/notification.js', function() {
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

  before(function createNotification(done) {
    var self = this;
    Notification.create({
      masterId: this.user.id,
      userId: this.user1.id,
      type: models.constants.NOTIFICATION_TYPE.FOLLOW
    }, function(err, notification) {
      if (err) {
        throw err;
      }
      self.notification = notification;
      done();
    });
  });

  after(function(done) {
    Notification.remove(done);
  });

  after(function(done) {
    User.remove(done);
  });

  it('Notification.query(options, callback): query notifications', function(done) {
    Notification.query({}, function(err, count, notifications) {
      if (err) {
        throw err;
      }
      count.should.be.a.Number;
      notifications.should.be.an.Array;
      count.should.eql(notifications.length);
      count.should.be.above(0);
      done();
    });
  });

  it('Notification.getCount(conditions, callback): get notification count', function(done) {
    Notification.getCount({
      read: true
    }, function(err, count) {
      if (err) {
        throw err;
      }
      count.should.be.a.Number;
      count.should.eql(0);
      done();
    });
  });

  it('Notification.read(conditions, callback): read notifications', function(done) {
    Notification.read({
      _id: this.notification.id
    }, function(err) {
      if (err) {
        throw err;
      }
      Notification.getCount({
        read: true
      }, function(err, count) {
        if (err) {
          throw err;
        }
        count.should.eql(1);
        done();
      });
    });
  });
});