/**
 * 定义 CommentSchema 的 pre-hooks
 * @author heroic
 */

/**
 * Module dependencies
 */
var sanitize = require('validator').sanitize,
  async = require('async'),
  constants = require('../../constants');

/** Exports hooks */
module.exports = exports = function(schema) {
  // 在验证之前先处理输入的数据
  schema
    .pre('validate', function(next) {
      this.content = sanitize(this.content).xss();
      next();
    });

  // 创建评论时会更新其对应的话题或页面
  schema
    .pre('save', true, function(next, done) {
      next();
      // 增加对应话题的评论数量，更新对应话题的最后评论用户和最后评论时间
      // 当是评论页面时就跳过该处理
      if (this.onPage) {
        return done();
      }

      var Topic = this.model('Topic');
      Topic.findByIdAndUpdate(this.fkId, {
        $inc: {
          commentCount: 1
        },
        $set: {
          lastCommentUser: {
            username: this.author.username,
            nickname: this.author.nickname
          },
          lastCommentedAt: this.createdAt
        }
      }, done);
    })
    .pre('save', true, function(next, done) {
      next();
      // 当是评论页面时则增加对应页面的评论数量
      if (!this.onPage) {
        return done();
      }

      var Page = this.model('Page');
      Page.findByIdAndUpdate(this.fkId, {
        $inc: {
          commentCount: 1
        }
      }, done);
    });

  // 创建评论时会通知对应的话题作者，或者该评论所针对的另外一条(多条)评论的作者
  schema
    .pre('save', true, function(next, done) {
      next();
      // 当评论页面时不做通知
      if (this.onPage) {
        return done();
      }

      // 评论话题或者回复(评论)他人的评论
      var self = this;
      if (this.commentIds.length === 0) {
        async.waterfall([
          function findTopicAuthor(next) {
            var Topic = self.model('Topic');
            Topic.findById(self.fkId, function(err, topic) {
              next(err, topic);
            });
          },
          function createNotification(topic, next) {
            var Notification = self.model('Notification'),
              topicAuthorId = topic.author.id;
            Notification.create({
              masterId: topicAuthorId,
              userId: self.author.id,
              type: constants.NOTIFICATION_TYPE.COMMENT,
              topicId: self.fkId,
              commentId: self.id
            }, next);
          }
        ], done);
      } else {
        // 可以一次回复(评论)多条评论
        async.each(self.commentIds, function(commentId, next) {
          async.waterfall([
            function findCommentAuthor(next) {
              var Comment = self.model('Comment');
              Comment.findById(commentId, function(err, comment) {
                next(err, comment);
              });
            },
            function createNotification(comment, next) {
              var Notification = self.model('Notification'),
                commentAuthorId = comment.author.id;
              Notification.create({
                masterId: commentAuthorId,
                userId: self.author.id,
                type: constants.NOTIFICATION_TYPE.REPLY_COMMENT,
                topicId: self.fkId,
                masterCommentId: commentId,
                commentId: self.id
              }, next);
            }
          ], next);
        }, done);
      }
    });
};