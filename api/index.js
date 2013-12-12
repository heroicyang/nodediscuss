/**
 * 导出所有的 api
 * @author  heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash'),
  async = require('async');

/** 导出各种 api ，方便控制层调用 */
module.exports = exports = {
  user: require('./user'),
  section: require('./section'),
  tag: require('./tag'),
  topic: require('./topic'),
  comment: require('./comment'),
  favoriteTopic: require('./favorite_topic'),
  favoriteTag: require('./favorite_tag'),
  relation: require('./relation'),
  notification: require('./notification'),
  page: require('./page')
};

/**
 * 包装 api 中的方法来响应 http 请求
 * @param  {Function} apiMethod  需要调用的 api 方法
 * @return {Function}           request handler
 */
exports.requestHandler = function(apiMethod) {
  return function(req, res, next) {
    var options = _.extend(req.body, req.query, req.params);
    
    async.waterfall([
      function call(next) {
        if (apiMethod.length === 1) {
          apiMethod.call(req, function(err, result) {
            next(err, result);
          });
        } else {
          apiMethod.call(req, options, function(err, result) {
            next(err, result);
          });
        }
      }
    ], function(err, result) {
      if (err) {
        return next(err);
      }
      res.json({
        success: true,
        data: result || {}
      });
    });
  };
};