/**
 * 评论相关的控制逻辑
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  _ = require('lodash'),
  api = require('../../api'),
  NotFoundError = require('../../utils/error').NotFoundError;

/**
 * 发表评论
 */
exports.create = function(req, res, next) {
  var data = req.body,
    topicId = data.topicId;
  _.extend(data, {
    fkId: topicId,
    author: {
      id: req.currentUser.id
    }
  });

  data.content = data.content.replace(/#(\d+)楼\s?/g, function(group, p1) {
    return _.template('[#<%= floor %>楼](/topic/<%= topicId %>#comment-<%= floor %>) ', {
      floor: p1,
      topicId: topicId
    });
  }).replace(/@([a-zA-Z0-9\-_]+\s?)/g, function(group, p1) {
    return _.template('[@<%= username %>](/user/<%= username %>) ', {
      username: p1
    });
  });

  api.comment.create(data, function(err) {
    if (err) {
      req.session.redirectPath = '/topic/' + topicId;
      return next(err);
    }
    res.redirect('/topic/' + topicId);
  });
};

/** 获取评论 */
exports.load = function(req, res, next) {
  var id = req.params.id;
  api.comment.get({
    id: id
  }, function(err, comment) {
    if (err) {
      return next(err);
    }
    if (!comment || comment.deleted) {
      return next(new NotFoundError('该评论不存在。'));
    }
    req.comment = comment;
    next();
  });
};