/**
 * 权限拦截中间件
 * @author heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash'),
  moment = require('moment');
var api = require('../api'),
  config = require('../../config');
var error = require('../../utils/error'),
  CentralizedError = error.CentralizedError,
  NotAllowedError = error.NotAllowedError;

/** 登录后不允许访问 */
exports.loginNotAllowed = function(req, res, next) {
  if (req.isAuthenticated()) {
    req.flash('redirectPath', '/');
    return next(new NotAllowedError('登录状态下你无权访问该页面。'));
  }
  next();
};

/** 需要登录后才能访问 */
exports.loginRequired = function(req, res, next) {
  if (!req.isAuthenticated()) {
    req.flash('redirectPath', '/signin');
    return next(new NotAllowedError('未登录状态下你无权访问该页面。'));
  } else {
    // 此种情况主要是应对在保持登录期间帐号被锁定的情况
    if (req.currentUser.state === api.constants.USER_STATE.BLOCKED &&
          req.path !== '/logout') {
      return next(new NotAllowedError('你的帐号已被锁定无权访问该页面。'));
    }
  }
  next();
};

/** 需要话题作者权限才能访问 */
exports.topicAuthorRequired = function(req, res, next) {
  if (req.topic.author.id !== req.currentUser.id) {
    req.flash('redirectPath', '/topic/' + req.topic.id);
    return next(new NotAllowedError('你无权访问该页面。'));
  }
  next();
};

/** 需要评论的作者才能继续操作 */
exports.commentAuthorRequired = function(req, res, next) {
  if (req.comment.author.id !== req.currentUser.id) {
    req.flash('redirectPath', '/topic/' + req.comment.refId);
    return next(new NotAllowedError('你无权访问该页面。'));
  }
  next();
};

/** 需要 Wiki 创建、编辑权限 */
exports.wikiEditorRequired = function(req, res, next) {
  if (req.currentUser.verified ||
        _.contains(config.adminEmails, req.currentUser.email)) {
    return next();
  }

  req.flash('redirectPath', '/wiki');
  next(new NotAllowedError('你无权访问该页面。'));
};

/** 管理员权限 */
exports.adminRequired = function(req, res, next) {
  if (_.contains(config.adminEmails, req.currentUser.email)) {
    return next();
  }

  req.flash('redirectPath', '/');
  next(new NotAllowedError('你无权访问该页面。'));
};

/** 发布话题的限制规则 */
exports.topicThrottling = function(req, res, next) {
  api.Topic.get({
    'author.id': req.currentUser.id
  }, function(err, topic) {
    if (err) {
      return next(err);
    }
    if (!topic) {
      return next();
    }

    // 如果当前用户注册未满一周，则必须间隔 1 小时才能继续发布
    if (moment().add('days', -7).toDate() < req.currentUser.createdAt) {
      if (moment().add('hours', -1).toDate() < topic.createdAt) {
        return next(new CentralizedError('由于你是新注册用户，话题发布频率受限，必须间隔 1 小时'));
      }
      return next();
    }

    // 如果是普通用户，则必须间隔 10 分钟才能继续发布
    if (!req.currentUser.verified &&
          !_.contains(config.adminEmails, req.currentUser.email)) {
      if (moment().add('minutes', -10).toDate() < topic.createdAt) {
        return next(new CentralizedError('发布话题过于频繁，请稍后再试'));
      }
      return next();
    }

    next();
  });
};