/**
 * 用户收藏列表相关的控制逻辑
 * @author heroic
 */

/**
 * Module dependencies
 */
var config = require('../../config'),
  api = require('../../api');

/** 话题收藏列表页面 */
exports.topics = function(req, res, next) {
  var pageIndex = parseInt(req.query.pageIndex || 1, 10);
  var pagination = {
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  };

  api.favoriteTopic.query({
    userId: req.currentUser.id,
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    pagination.totalCount = results.totalCount;
    req.breadcrumbs('话题收藏');
    res.render('favorite_topics', {
      topics: results.topics,
      pagination: pagination
    });
  });
};

/** 节点收藏页面 */
exports.tags = function(req, res, next) {
  var pageIndex = parseInt(req.query.pageIndex || 1, 10);
  var pagination = {
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  };

  api.favoriteTag.query({
    userId: req.currentUser.id,
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    pagination.totalCount = results.totalCount;
    req.breadcrumbs('节点收藏');
    res.render('favorite_tags', {
      topics: results.topics,
      tags: results.tags,
      pagination: pagination
    });
  });
};