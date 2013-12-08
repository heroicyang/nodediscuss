/**
 * 话题列表相关的控制逻辑
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  _ = require('lodash'),
  config = require('../../config'),
  api = require('../../api');

/** 话题列表页面 */
exports.list = function(req, res, next) {
  var filter = req.params.type,
    pageIndex = parseInt(req.query.pageIndex || 1, 10);

  var error = _.extend(req.flash('err'), {
    global: true
  });
  var pagination = {
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  };

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
        sort: sort,
        pageIndex: pageIndex,
        pageSize: config.pagination.pageSize
      }, function(err, results) {
        if (err) {
          return next(err);
        }
        pagination.totalCount = results.totalCount;
        next(err, results.topics);
      });
    },
    tags: function(next) {
      api.tag.query({
        pageSize: Infinity
      }, function(err, results) {
        if (err) {
          return next(err);
        }
        var tags = results.tags;
        next(null, _.groupBy(tags, function(tag) {
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
      pagination: pagination,
      url: '/topics',
      filterType: filter,
      err: error
    }));
  });
};

/** 用户发布的话题列表页面 */
exports.byUser = function(req, res, next) {
  var pageIndex = parseInt(req.query.pageIndex || 1, 10);
  var pagination = {
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  };

  api.topic.query({
    query: {
      'author.id': req.user.id
    },
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    pagination.totalCount = results.totalCount;
    
    req.breadcrumbs(req.user.nickname, '/user/' + req.user.username);
    req.breadcrumbs('全部话题');
    res.render('user_topics', _.extend(results, {
      hiddenAvatar: true,
      pagination: pagination
    }));
  });
};

/** 关注的用户发布的话题列表页面 */
exports.byFollowing = function(req, res, next) {
  var pageIndex = parseInt(req.query.pageIndex || 1, 10);
  var pagination = {
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  };

  async.waterfall([
    function getFollowings(next) {
      api.relation.query({
        query: {
          userId: req.currentUser.id
        },
        pageSize: Infinity
      }, function(err, results) {
        if (err) {
          return next(err);
        }
        var followingIds = _.pluck(results.relations, 'followId');
        next(null, followingIds);
      });
    },
    function getTopics(followingIds, next) {
      api.topic.query({
        query: {
          'author.id': {
            $in: followingIds
          }
        },
        pageIndex: pageIndex,
        pageSize: config.pagination.pageSize
      }, function(err, results) {
        if (err) {
          return next(err);
        }
        pagination.totalCount = results.totalCount;
        next(null, results.topics);
      });
    }
  ], function(err, topics) {
    if (err) {
      return next(err);
    }

    req.breadcrumbs('我关注的人发布的最新话题');
    res.render('user_topics', {
      hiddenAvatar: false,
      topics: topics,
      pagination: pagination
    });
  });
};