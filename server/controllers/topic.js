/**
 * 话题相关的视图控制逻辑
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  _ = require('lodash'),
  api = require('../../api');

exports.index = function(req, res, next) {
  var error = _.extend(req.flash('err'), {
    showInGlobal: true
  });
    
  async.parallel({
    topics: function(next) {
      api.topic.getTopicsByLastCommentedAt(function(err, topics) {
        next(err, topics);
      });
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    var topics = results.topics;
    req.breadcrumbs('社区');
    res.render('topics', {
      err: error,
      topics: topics
    });
  });
};

exports.create = function(req, res, next) {
  var method = req.method.toLowerCase();

  if ('get' === method) {
    req.breadcrumbs('发表新话题');
    return res.render('topic_editor');
  }
};