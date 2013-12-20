/**
 * 评论相关的控制逻辑
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  _ = require('lodash');
var api = require('../api'),
  config = require('../../config');
var NotFoundError = require('../../utils/error').NotFoundError;

/** 用户发表的评论列表 */
exports.createdByUser = function(req, res, next) {
  var pageIndex = parseInt(req.query.pageIndex, 10);
  var pagination = {
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  };

  api.Comment.query({
    conditions: {
      'author.id': req.user._id,
      deleted: false
    },
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  }, function(err, count, comments) {
    if (err) {
      return next(err);
    }
    pagination.totalCount = count;

    async.map(comments, function(comment, next) {
      api.Topic.get({
        _id: comment.refId
      }, function(err, topic) {
        if (err) {
          return next(err);
        }
        comment.topic = topic || { deleted: true };
        next(null, comment);
      });
    }, function(err, comments) {
      if (err) {
        return next(err);
      }

      req.breadcrumbs(req.user.nickname, '/user/' + req.user.username);
      req.breadcrumbs('全部评论');
      res.render('user/comments', {
        comments: comments,
        pagination: pagination
      });
    });
  });
};

/**
 * 发表评论
 */
exports.create = function(req, res, next) {
  var data = req.body,
    topicId = data.topicId;
  _.extend(data, {
    refId: topicId,
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
      req.flash('redirectPath', '/topic/' + topicId);
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