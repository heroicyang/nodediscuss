/**
 * 提醒系统相关的控制逻辑
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  _ = require('lodash'),
  api = require('../../api');

exports.index = function(req, res, next) {
  async.waterfall([
    function queryNotifications(next) {
      api.notification.query({
        conditions: { masterId: req.user.id }
      }, function(err, notifications) {
        next(err, notifications);
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
    req.breadcrumbs('提醒系统');
    res.render('notifications', {
      notifications: notifications
    });
  });
};