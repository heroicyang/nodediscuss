/**
 * 话题列表相关的控制逻辑
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  _ = require('lodash'),
  api = require('../../api');

/** 话题列表页面 */
exports.list = function(req, res, next) {
  var filter = req.params.type;
  var error = _.extend(req.flash('err'), {
    global: true
  });

  var conditions = {},
    sort;
  switch(filter) {
  case 'excellent':
    conditions.excellent = true;
    break;
  case 'no-comment':
    conditions.commentCount = {
      $lte: 0
    };
    break;
  case 'latest':
    break;
  default:
    sort = {
      createdAt: -1,
      lastCommentedAt: -1
    };
  }

  async.parallel({
    topics: function(next) {
      api.topic.query({
        query: conditions,
        sort: sort
      }, function(err, results) {
        next(err, _.extend(results.topics, {
          totalCount: results.totalCount
        }));
      });
    },
    tags: function(next) {
      var q = api.tag.query();
      q.execQuery(function(err, tags) {
        next(err, _.groupBy(tags, function(tag) {
          return tag.section.name;
        }));
      });
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    req.breadcrumbs('社区');
    res.render('topics', _.extend(results, {
      path: '/topics',
      filterType: filter,
      err: error
    }));
  });
};