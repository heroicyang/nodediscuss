/**
 * 导出 API 接口
 * @author  heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash');
var models = require('../models');

module.exports = exports = models.api;

/**
 * 使用 api 中的方法响应 http 请求
 * @param  {Function} apiMethod  需要调用的 api 方法
 * @return {Function}    request handler
 */
exports.requestHandler = function(apiMethod) {
  return function(req, res, next) {
    var options = _.extend(req.body, req.query, req.params);
    
    apiMethod.call(null, options, function(err) {
      if (err) {
        return next(err);
      }

      var results = _.toArray(arguments).slice(1);
      // 按照约定，只有 `query` 方法除 `err` 外会传入两个参数: `count`, `docs`
      if (results.length === 2) {
        results = {
          count: results[0],
          data: results[1]
        };
      } else {
        results = {
          data: results[0]
        };
      }

      res.send(JSON.stringify({
        success: true,
        response: results
      }));
    });
  };
};