/**
 * 权限判断的路由中间件
 * @author heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash'),
  moment = require('moment'),
  api = require('../../api'),
  config = require('../../config'),
  CentralizedError = require('../../utils/error').CentralizedError,
  NotAllowedError = require('../../utils/error').NotAllowedError,
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
  } else {
    if (req.currentUser.state.blocked && req.path !== '/logout') {
      return res.format({
        html: function() {
          res.redirect('/signin');
        },
        json: function() {
          res.send(new NotAllowedError('你的帐号已被锁定无权访问该页面。'));
        },
        text: function() {
          res.send('你的帐号已被锁定无权访问该页面。');
        }
      });
    }
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
        res.redirect('/topic/' + req.comment.refId);
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

/** Wiki 编辑权限 */
exports.isWikiEditor = function(req, res, next) {
  if (req.currentUser.verified ||
        _.contains(config.adminEmails, req.currentUser.email)) {
    return next();
  }

  res.format({
    html: function() {
      res.redirect('/');
    },
    json: function() {
      res.send(new NotAllowedError('你无权访问该页面。'));
    },
    text: function() {
      res.send('你无权访问该页面。');
    }
  });
};

/** 管理员权限 */
exports.isAdmin = function(req, res, next) {
  if (_.contains(config.adminEmails, req.currentUser.email)) {
    return next();
  }

  res.format({
    html: function() {
      res.redirect('/');
    },
    json: function() {
      res.send(new NotAllowedError('你无权访问该页面。'));
    },
    text: function() {
      res.send('你无权访问该页面。');
    }
  });
};

/** 发布话题的限制规则 */
exports.limitedTopic = function(req, res, next) {
  api.user.getLatestTopic({
    id: req.currentUser.id
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