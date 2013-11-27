/**
 * 权限拦截器
 * @author heroic
 */

/**
 * Module dependencies
 */
var UnauthorizedError = require('../utils/error').UnauthorizedError,
  api = require('../api');

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

/** 只允许话题作者执行后续操作 */
exports.isTopicAuthor = function(req, res, next) {
  var topicId = req.body.id || req.params.id,
    method = req.method.toLowerCase();

  api.topic.get({
    id: topicId
  }, function(err, topic) {
    if (err) {
      return next(err);
    }
    if (!topic) {
      err = new Error('该话题不存在!');
      err.code = 404;
      return next(err);
    }
    if (!req.isAuthenticated() || topic.author.id !== req.user.id) {
      if ('get' === method) {
        return res.redirect('/topic/' + topicId);
      }
      return next(new Error('你没有权限编辑该话题!'));
    }
    req.topic = topic;
    next();
  });
};