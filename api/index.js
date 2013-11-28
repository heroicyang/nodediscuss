/**
 * 导出所有的 api
 * @author  heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash'),
  async = require('async');

module.exports = exports = {
  user: require('./user'),
  topic: require('./topic'),
  tag: require('./tag'),
  comment: require('./comment'),
  favorite: require('./favorite'),
  notification: require('./notification')
};

/**
 * 将 api 中的方法包装一下来响应 http 请求
 * @param  {Function} apiMethod  需要调用的 api 方法
 * @return {Function}           request handler
 */
exports.requestHandler = function(apiMethod) {
  return function(req, res, next) {
    var options = _.extend(req.body, req.query, req.params);
    if (req.isAuthenticated()) {
      options.userId = req.user.id;
    }
    
    async.waterfall([
      function call(next) {
        if (apiMethod.length === 1) {
          apiMethod.call(null, function(err, result) {
            next(err, result);
          });
        } else {
          apiMethod.call(null, options, function(err, result) {
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