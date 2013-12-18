/**
 * CommentSchema middlewares
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async');
var sanitize = require('../sanitize'),
  constants = require('../constants');

module.exports = exports = function(schema) {
  // 执行数据验证之前
  schema
    .pre('validate', function(next) {
      sanitize(this, 'content');
      next();
    });

  // 执行数据保存之前
  schema
    .pre('save', true, function(next, done) {
      next();
      // 当发表评论时应更新对应话题或页面的评论数量
      // 以及设置当前评论的楼层数为话题或页面的评论数量
      var self = this;
      async.parallel({
        topic: function(next) {
          if (self.onPage) { return next(null); }

          var Topic = self.model('Topic');
          Topic.findByIdAndUpdate(self.refId, {
            $inc: {
              commentCount: 1
            },
            $set: {
              lastCommentUser: {
                username: self.author.username,
                nickname: self.author.nickname
              },
              lastCommentedAt: self.createdAt
            }
          }, next);
        },
        page: function(next) {
          if (self.onPage) {
            var Page = self.model('Page');
            Page.findByIdAndUpdate(self.refId, {
              $inc: {
                commentCount: 1
              }
            }, next);
          } else {
            return next(null);
          }
        }
      }, function(err, results) {
        if (err) { return done(err); }
        // 设置当前评论的楼层数
        self.floor = (results.topic && results.topic.commentCount) ||
            (results.page && results.page.commentCount) || 0;
        done();
      });
    })
    .pre('save', true, function(next, done) {
      next();
      // 如果是针对话题发表评论，则需要通过提醒系统通知话题的作者
      // 如果是针对话题的某条（某几条）评论发表评论，则需要通过提醒系统通知这些评论的作者
      // 对于页面中的评论则不做任何处理，也不支持页面中回复别人的评论
      if (this.onPage) { return done(); }

      var self = this;
      if (this.commentIds && this.commentIds.length > 0) {
        async.each(this.commentIds, function(commentId, next) {
          async.waterfall([
            function findCommentAuthor(next) {
              self.model('Comment').findById(commentId, next);
            },
            function createNotification(comment, next) {
              if (!comment) { return next(null); }    // 容错处理，没找到源评论则直接跳出

              var Notification = self.model('Notification'),
                commentAuthorId = comment.author.id;

              // 如果是被回复评论的作者自己发表的评论则不提醒
              if (commentAuthorId === self.author.id) {
                return next(null);
              }

              Notification.create({
                masterId: commentAuthorId,
                userId: self.author.id,
                type: constants.NOTIFICATION_TYPE.REPLY_COMMENT,
                topicId: self.refId,
                masterCommentId: commentId,
                commentId: self.id
              }, next);
            }
          ], next);
        }, done);
      } else {
        async.waterfall([
          function findTopicAuthor(next) {
            self.model('Topic').findById(self.refId, next);
          },
          function createNotification(topic, next) {
            if (!topic) { return next(null); }   // 容错处理，没找到话题则直接跳出

            var Notification = self.model('Notification'),
              topicAuthorId = topic.author.id;

            // 如果是话题作者自己发表的评论则不提醒
            if (topicAuthorId === self.author.id) {
              return next(null);
            }

            Notification.create({
              masterId: topicAuthorId,
              userId: self.author.id,
              type: constants.NOTIFICATION_TYPE.COMMENT,
              topicId: self.refId,
              commentId: self.id
            }, next);
          }
        ], done);
      }
    });
};