/**
 * 评论相关的控制逻辑
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  _ = require('lodash'),
  api = require('../../api');

/**
 * 发表评论
 */
exports.create = function(req, res, next) {
  var data = req.body,
    topicId = data.topicId;
  _.extend(data, {
    author: {
      id: req.user.id
    }
  });

  api.comment.create(data, function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/topic/' + topicId);
  });
};