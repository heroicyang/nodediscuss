/**
 * 通知中心相关的控制逻辑
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  _ = require('lodash'),
  api = require('../../api');

/** 通知中心页面 */
exports.list = function(req, res, next) {
  async.waterfall([
    function queryNotifications(next) {
      api.notification.query({
        query: {
          masterId: req.currentUser.id
        }
      }, function(err, results) {
        if (err) {
          return next(err);
        }
        next(null, _.extend(results.notifications, {
          totalCount: results.totalCount
        }));
      });
    },
    function populateRelated(notifications, next) {
      async.map(notifications, function(notification, next) {
        async.parallel({
          user: function(next) {
            api.user
              .get({
                id: notification.userId
              }, function(err, user) {
                next(err, user);
              });
          },
          topic: function(next) {
            if (!notification.topicId) {
              return next(null, null);
            }
            api.topic
              .get({
                id: notification.topicId
              }, function(err, topic) {
                next(err, topic);
              });
          },
          masterComment: function(next) {
            if (!notification.masterCommentId) {
              return next(null, null);
            }
            api.comment
              .get({
                id: notification.masterCommentId
              }, function(err, comment) {
                next(err, comment);
              });
          },
          comment: function(next) {
            if (!notification.commentId) {
              return next(null, null);
            }
            api.comment
              .get({
                id: notification.commentId
              }, function(err, comment) {
                next(err, comment);
              });
          }
        }, function(err, results) {
          if (err) {
            return next(err);
          }
          _.extend(notification, results);
          next(null, notification);
        });
      }, function(err, notifications) {
        next(err, notifications);
      });
    }
  ], function(err, notifications) {
    if (err) {
      return next(err);
    }
    req.breadcrumbs('通知中心');
    res.render('notifications', {
      notifications: notifications
    });
  });
};

/** 将未读提醒标记为已读 */
exports.read = function(req, res, next) {

};