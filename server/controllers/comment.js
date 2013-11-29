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
      id: req.currentUser.id
    }
  });

  data.content = data.content.replace(/#(\d+)楼/g, function(group, p1) {
    return _.template('[#<%= floor %>楼](/topic/<%= topicId %>#comment-<%= floor %>) ', {
      floor: p1,
      topicId: topicId
    });
  }).replace(/@([a-zA-Z0-9\-_]+)/g, function(group, p1) {
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

exports.load = function(req, res, next) {
  var id = req.params.id;
};