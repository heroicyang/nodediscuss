/**
 * RelationSchema middlewares
 * @author heroic
 */

/**
 * Module dependencies
 */
var constants = require('../constants');

module.exports = exports = function(schema) {
  // 执行数据保存前
  schema
    .pre('save', true, function(next, done) {
      next();
      // 当 follow 某个用户时更新自己的关注数量
      var User = this.model('User');
      User.findByIdAndUpdate(this.userId, {
        $inc: {
          followingCount: 1
        }
      }, done);
    })
    .pre('save', true, function(next, done) {
      next();
      // 当 follow 某个用户时更新该用户的粉丝数量
      var User = this.model('User');
      User.findByIdAndUpdate(this.friendId, {
        $inc: {
          followerCount: 1
        }
      }, done);
    })
    .pre('save', true, function(next, done) {
      next();
      // 当 follow 某个用户时给该用户发送提醒
      var Notification = this.model('Notification');
      Notification.create({
        masterId: this.friendId,
        userId: this.userId,
        type: constants.NOTIFICATION_TYPE.FOLLOW
      }, done);
    });

  // 执行数据删除前
  schema
    .pre('remove', true, function(next, done) {
      next();
      // 当取消 follow 某个用户时更新自己的关注数量
      var User = this.model('User');
      User.findByIdAndUpdate(this.userId, {
        $inc: {
          followingCount: -1
        }
      }, done);
    })
    .pre('remove', true, function(next, done) {
      next();
      // 当取消 follow 某个用户时更新该用户的粉丝数量
      var User = this.model('User');
      User.findByIdAndUpdate(this.friendId, {
        $inc: {
          followerCount: -1
        }
      }, done);
    });
};