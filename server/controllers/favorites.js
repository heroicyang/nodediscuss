/**
 * 用户收藏列表相关的控制逻辑
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  _ = require('lodash'),
  nconf = require('nconf');
var api = require('../api');

/** 话题收藏列表 */
exports.topics = function(req, res, next) {
  var pageIndex = parseInt(req.query.pageIndex, 10);
  var pagination = {
    pageIndex: pageIndex,
    pageSize: nconf.get('pagination:pageSize')
  };

  api.Topic.query({
    conditions: {
      favoriteUsers: req.currentUser.id
    },
    pageIndex: pageIndex,
    pageSize: nconf.get('pagination:pageSize')
  }, function(err, count, topics) {
    if (err) {
      return next(err);
    }

    pagination.totalCount = count;
    req.breadcrumbs('话题收藏');
    res.render('favorite/topics', {
      topics: topics,
      pagination: pagination
    });
  });
};

/** 节点收藏及节点下面的话题列表 */
exports.tags = function(req, res, next) {
  var pageIndex = parseInt(req.query.pageIndex, 10);
  var pagination = {
    pageIndex: pageIndex,
    pageSize: nconf.get('pagination:pageSize')
  };

  async.waterfall([
    function queryFavoriteTags(next) {
      api.Tag.query({
        conditions: {
          favoriteUsers: req.currentUser.id
        },
        notPaged: true
      }, next);
    },
    function queryTopics(tags, next) {
      var tagIds = _.pluck(tags, '_id');
      api.Topic.query({
        conditions: {
          'tag.id': {
            $in: tagIds
          }
        },
        pageIndex: pageIndex,
        pageSize: nconf.get('pagination:pageSize')
      }, function(err, count, topics) {
        if (err) {
          return next(err);
        }
        pagination.totalCount = count;
        next(null, {
          tags: tags,
          topics: topics
        });
      });
    }
  ], function(err, results) {
    if (err) {
      return next(err);
    }
    req.breadcrumbs('节点收藏');
    res.render('favorite/tags', _.extend(results, {
      pagination: pagination
    }));
  });
};