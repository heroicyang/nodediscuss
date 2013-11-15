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
    },
    tags: function(next) {
      api.tag.getGroupedTags(function(err, tags) {
        next(err, tags);
      });
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    req.breadcrumbs('社区');
    res.render('topics', _.extend({
      err: error
    }, results));
  });
};

exports.create = function(req, res, next) {
  var method = req.method.toLowerCase();

  if ('get' === method) {
    async.waterfall([
      function getTags(next) {
        api.tag.getGroupedTags(function(err, tags) {
          next(err, tags);
        });
      }
    ], function(err, tags) {
      if (err) {
        return next(err);
      }
      req.breadcrumbs('发表新话题');
      res.render('topic_editor', {
        tags: tags,
        err: req.flash('err')
      });
    });
    return ;
  }

  if ('post' === method) {
    var data = req.body;
    _.extend(data, {
      author: {
        id: req.user.id
      }
    });

    api.topic.create(data, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  }
};