/**
 * 权限拦截器
 * @author heroic
 */

/**
 * Module dependencies
 */
var UnauthorizedError = require('../utils/error').UnauthorizedError;

/**
 * 需要登录
 */
exports.authRequired = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.format({
      'text/html': function() {
        res.redirect('/signin');
      },
      'application/json': function() {
        res.send(new UnauthorizedError('你需要先登录后才能继续'));
      }
    });
  }
  next();
};

/**
 * 登录后不能访问，会直接跳转到首页
 */
exports.unreachableWhenAuthorized = function(req, res, next) {
  if (req.isAuthenticated()) {
    return res.format({
      'text/html': function() {
        res.redirect('/');
      },
      'application/json': function() {
        res.send(new UnauthorizedError('登录状态下你不能访问该页面'));
      }
    });
  }
  next();
};