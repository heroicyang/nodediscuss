/**
 * 定义 RelationSchema 的 pre-hooks
 * @author heroic
 */

/**
 * Module dependencies
 */
var constants = require('../../constants');

/** Exports hooks */
module.exports = exports = function(schema) {
  // 添加关注时
  schema
    .pre('save', true, function(next, done) {
      next();
      // 更新用户的关注数
      var User = this.model('User');
      User.findByIdAndUpdate(this.userId, {
        $inc: {
          followingCount: 1
        }
      }, done);
    })
    .pre('save', true, function(next, done) {
      next();
      // 更新被关注用户的粉丝数
      var User = this.model('User');
      User.findByIdAndUpdate(this.followId, {
        $inc: {
          followerCount: 1
        }
      }, done);
    })
    .pre('save', true, function(next, done) {
      next();
      // 给被关注用户发送提醒
      var Notification = this.model('Notification');
      Notification.create({
        masterId: this.followId,
        userId: this.userId,
        type: constants.NOTIFICATION_TYPE.FOLLOW
      }, done);
    });

  // 取消关注时
  schema
    .pre('remove', true, function(next, done) {
      next();
      // 更新用户的关注数
      var User = this.model('User');
      User.findByIdAndUpdate(this.userId, {
        $inc: {
          followingCount: -1
        }
      }, done);
    })
    .pre('remove', true, function(next, done) {
      next();
      // 更新被关注用户的粉丝数
      var User = this.model('User');
      User.findByIdAndUpdate(this.followId, {
        $inc: {
          followerCount: -1
        }
      }, done);
    });
};