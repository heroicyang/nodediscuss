/**
 * 后台管理首页
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  nconf = require('nconf');
var api = require('../../api');

exports.index = function(req, res, next) {
  async.parallel({
    recentTopics: function(next) {
      api.Topic.query({
        pageSize: nconf.get('pagination:pageSize')
      }, function(err, count, topics) {
        if (err) {
          return next(err);
        }
        next(null, topics);
      });
    },
    userCount: function(next) {
      api.User.getCount(next);
    },
    topicCount: function(next) {
      api.Topic.getCount(next);
    },
    commentCount: function(next) {
      api.Comment.getCount(next);
    },
    pageCount: function(next) {
      api.Page.getCount(next);
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    res.render('admin/dashboard', results);
  });
};