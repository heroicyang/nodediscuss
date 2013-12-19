/**
 * 话题相关的控制逻辑
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  _ = require('lodash');
var config = require('../../config'),
  api = require('../api');

/** 社区页面话题列表 */
exports.home = function(req, res, next) {
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
      api.Topic.query({
        conditions: conditions,
        sort: sort,
        pageIndex: pageIndex,
        pageSize: config.pagination.pageSize
      }, function(err, count, topics) {
        if (err) {
          return next(err);
        }
        pagination.totalCount = count;
        next(err, topics);
      });
    },
    tags: function(next) {
      api.Tag.query({
        notPaged: true
      }, function(err, tags) {
        if (err) {
          return next(err);
        }
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
    res.render('topic/list', _.extend(results, {
      pagination: pagination,
      url: '/topics',
      filterType: filter,
      err: error
    }));
  });
};

/** 用户发布的话题列表 */
exports.createdByUser = function(req, res, next) {
  var pageIndex = parseInt(req.query.pageIndex || 1, 10);
  var pagination = {
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  };

  api.Topic.query({
    conditions: {
      'author.id': req.user.id
    },
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  }, function(err, count, topics) {
    if (err) {
      return next(err);
    }

    pagination.totalCount = count;
    
    req.breadcrumbs(req.user.nickname, '/user/' + req.user.username);
    req.breadcrumbs('全部话题');
    res.render('user/topics', _.extend({
      hiddenAvatar: true,
      topics: topics,
      pagination: pagination
    }));
  });
};

/** 关注的用户所发布的话题列表 */
exports.createdByFriends = function(req, res, next) {
  var pageIndex = parseInt(req.query.pageIndex || 1, 10);
  var pagination = {
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  };

  async.waterfall([
    function queryFriendIds(next) {
      api.Relation.query({
        conditions: {
          userId: req.currentUser.id
        },
        notPaged: true
      }, function(err, count, friendIds) {
        next(err, friendIds);
      });
    },
    function queryTopics(friendIds, next) {
      api.Topic.query({
        conditions: {
          'author.id': {
            $in: friendIds
          }
        },
        pageIndex: pageIndex,
        pageSize: config.pagination.pageSize
      }, function(err, count, topics) {
        if (err) {
          return next(err);
        }
        pagination.totalCount = count;
        next(null, topics);
      });
    }
  ], function(err, topics) {
    if (err) {
      return next(err);
    }

    req.breadcrumbs('我关注的人发布的最新话题');
    res.render('user/topics', {
      topics: topics,
      pagination: pagination
    });
  });
};