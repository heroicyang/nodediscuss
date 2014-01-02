/**
 * 评论相关的控制逻辑
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  nconf = require('nconf');
var api = require('../api');
var NotFoundError = require('../utils/error').NotFoundError;

/** 用户发表的评论列表 */
exports.createdByUser = function(req, res, next) {
  var pageIndex = parseInt(req.query.pageIndex, 10);
  var pagination = {
    pageIndex: pageIndex,
    pageSize: nconf.get('pagination:pageSize')
  };

  api.Comment.query({
    conditions: {
      'author.id': req.user._id,
      deleted: false
    },
    pageIndex: pageIndex,
    pageSize: nconf.get('pagination:pageSize')
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

/** 发表评论 */
exports.create = function(req, res, next) {
  var data = req.body;
  data.refId = data.topicId;
  data.author = {
    id: req.currentUser.id
  };

  api.Comment.add(data, function(err) {
    if (err) {
      req.flash('redirectPath', '/topic/' + data.topicId);
      return next(err);
    }
    res.redirect('/topic/' + data.topicId);
  });
};

/** 获取单个评论数据的路由中间件 */
exports.load = function(req, res, next) {
  api.Comment.get({
    _id: req.params.id
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