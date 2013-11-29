/**
 * 权限判断的路由中间件
 * @author heroic
 */

/**
 * Module dependencies
 */
var NotAllowedError = require('../../utils/error').NotAllowedError,
  NotFoundError = require('../../utils/error').NotFoundError;

/** 未登录状态才能访问 */
exports.unLogin = function(req, res, next) {
  if (req.isAuthenticated()) {
    return res.format({
      html: function() {
        res.redirect('/');
      },
      json: function() {
        res.send(new NotAllowedError('登录状态下你无权访问该页面。'));
      },
      text: function() {
        res.send('登录状态下你无权访问该页面。');
      }
    });
  }
  next();
};

/** 登录后才能访问 */
exports.isLogin = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.format({
      html: function() {
        res.redirect('/signin');
      },
      json: function() {
        res.send(new NotAllowedError('未登录状态下你无权访问该页面。'));
      },
      text: function() {
        res.send('未登录状态下你无权访问该页面。');
      }
    });
  }
  next();
};

/** 该话题的作者才能访问 */
exports.isTopicAuthor = function(req, res, next) {
  if (!req.topic) {
    return next(new NotFoundError('该话题不存在。'));
  }
  if (req.topic.author.id !== req.currentUser.id) {
    return res.format({
      html: function() {
        res.redirect('/topic/' + req.topic.id);
      },
      json: function() {
        res.send(new NotAllowedError('你无权访问该页面。'));
      },
      text: function() {
        res.send('你无权访问该页面。');
      }
    });
  }
  next();
};

/** 该评论的作者才能访问 */
exports.isCommentAuthor = function(req, res, next) {
  if (!req.comment) {
    return next(new NotFoundError('该评论不存在。'));
  }
  if (req.comment.author.id !== req.currentUser.id) {
    return res.format({
      html: function() {
        res.redirect('/topic/' + req.comment.topicId);
      },
      json: function() {
        res.send(new NotAllowedError('你无权访问该页面。'));
      },
      text: function() {
        res.send('你无权访问该页面。');
      }
    });
  }
  next();
};