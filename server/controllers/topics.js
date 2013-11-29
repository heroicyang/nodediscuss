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
    sort = { createdAt: -1 };
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
      var q = api.topic.query(conditions);
      q.query = q.query.sort(sort);
      q.paginate(1, 20).exec(function(err, count, topics) {
        next(err, topics);
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