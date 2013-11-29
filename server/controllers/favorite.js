/**
 * 用户收藏列表相关的控制逻辑
 * @author heroic
 */

/**
 * Module dependencies
 */
var api = require('../../api');

/** 话题收藏列表页面 */
exports.topics = function(req, res, next) {
  api.favorite.topic.query({
    userId: req.currentUser.id
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    req.breadcrumbs('话题收藏');
    res.render('favorite_topics', results);
  });
};

/** 节点收藏页面 */
exports.tags = function(req, res, next) {
  api.favorite.tag.query({
    userId: req.currentUser.id
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    req.breadcrumbs('节点收藏');
    res.render('favorite_tags', results);
  });
};