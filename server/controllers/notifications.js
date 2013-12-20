/**
 * 通知中心相关的控制逻辑
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  _ = require('lodash');
var config = require('../../config'),
  api = require('../api');

/** 通知中心提醒列表 */
exports.index = function(req, res, next) {
  var pageIndex = parseInt(req.query.pageIndex, 10);
  var pagination = {
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  };

  async.waterfall([
    function queryNotifications(next) {
      api.Notification.query({
        conditions: {
          masterId: req.currentUser.id
        },
        pageIndex: pageIndex,
        pageSize: config.pagination.pageSize
      }, function(err, count, notifications) {
        if (err) {
          return next(err);
        }
        pagination.totalCount = count;
        next(null, notifications);
      });
    },
    function populateRelated(notifications, next) {
      async.map(notifications, function(notification, next) {
        async.parallel({
          user: function(next) {
            api.User.get({
              _id: notification.userId
            }, next);
          },
          topic: function(next) {
            if (!notification.topicId) {
              return next(null, null);
            }
            api.Topic.get({
              _id: notification.topicId
            }, next);
          },
          comment: function(next) {
            if (!notification.commentId) {
              return next(null, null);
            }
            api.Comment.get({
              _id: notification.commentId
            }, next);
          }
        }, function(err, results) {
          if (err) {
            return next(err);
          }
          _.extend(notification, results);
          next(null, notification);
        });
      }, next);
    }
  ], function(err, notifications) {
    if (err) {
      return next(err);
    }
    req.breadcrumbs('通知中心');
    res.render('notifications', {
      notifications: notifications,
      pagination: pagination
    });
  });
};

/** 将未读提醒全部标记为已读 */
exports.read = function(req, res, next) {
  api.Notification.read({
    masterId: req.currentUser.id,
    read: false
  }, function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/notifications');
  });
};