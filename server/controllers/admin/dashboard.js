/**
 * 后台管理首页
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  config = require('../../../config'),
  api = require('../../../api');

exports.index = function(req, res, next) {
  async.parallel({
    recentTopics: function(next) {
      api.topic.query({
        pageSize: config.pagination.pageSize
      }, function(err, results) {
        if (err) {
          return next(err);
        }
        next(null, results.topics);
      });
    },
    userCount: function(next) {
      api.user.count(function(err, count) {
        next(err, count);
      });
    },
    topicCount: function(next) {
      api.topic.count(function(err, count) {
        next(err, count);
      });
    },
    commentCount: function(next) {
      api.comment.count(function(err, count) {
        next(err, count);
      });
    },
    pageCount: function(next) {
      api.page.count(function(err, count) {
        next(err, count);
      });
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    res.render('admin/dashboard', results);
  });
};