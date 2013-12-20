/**
 * 节点相关的控制逻辑
 * @author heroic
 */

/**
 * Module dependencies
 */
var api = require('../../api');
var error = require('../../utils/error'),
  NotFoundError = error.NotFoundError;

/** 获取单个节点数据的路由中间件 */
exports.load = function(req, res, next) {
  api.Tag.get({
    slug: req.params.slug
  }, function(err, tag) {
    if (err) {
      return next(err);
    }
    if (!tag) {
      return next(new NotFoundError('该节点不存在。'));
    }
    req.tag = tag;
    next();
  });
};