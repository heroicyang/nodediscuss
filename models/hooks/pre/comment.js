/**
 * 定义 CommentSchema 的 pre-hooks
 * @author heroic
 */

/**
 * Module dependencies
 */
var sanitize = require('validator').sanitize,
  async = require('async'),
  constants = require('../../constants'),
  when = require('../when');

/**
* Bootstrap
* @param  {Mongoose.Schema} schema
*/
module.exports = exports = function(schema) {
  schema
    .pre('validate', processCommentData)
    .pre('save', true,
        when('isNew')
          .not('onPage')  // 当评论 Page 时则无需操作 Topic
          .then(updateTopic))
    .pre('save', true,
        when('isNew')
          .and('onPage')  // 当评论 Topic 时则不用更新 Page
          .then(increaseCommentCountOfPage))
    .pre('save', true,
        when('isNew')
          .not('onPage')  // 当评论 Page 时则不必通知，因为 Page 的作者会有多人
          .and(function() {
            return this.commentIds.length === 0;
          })  // 有 commentIds 则代表是回复某条评论，由下一个中间件来负责
          .then(notifyTopicAuthor))
    .pre('save', true,
        when('isNew')
          .not('onPage')  // 当评论 Page 时则不必通知，Page 中暂时不提供回复评论的功能
          .and(function() {
            return this.commentIds.length > 0;
          })  // 有 commentIds 才代表是回复某条评论
          .then(notifyCommentsAuthor))
    .pre('save', true,    // 由于是非物理删除评论，所以仍然是执行的保存操作
        when('deleted')   // 该属性代表评论被删除
          .not('onPage')
          .not('isNew')
          .then(decreaseCommentCountOfTopic))
    .pre('save', true,
        when('deleted')
          .and('onPage')
          .not('isNew')
          .then(decreaseCommentCountOfPage));
};

/**
 * 处理输入的评论内容，XSS 防范
 */
function processCommentData(next) {
  this.content = sanitize(this.content).xss();
  next();
}

/**
 * 每发表新评论则更新其所属的 topic 的相关属性
 * 包括 commentCount 属性和 lastCommentUser 属性
 */
function updateTopic(next, done) {
  next();

  var Topic = this.model('Topic');
  Topic.findByIdAndUpdate(this.topicId, {
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
}

/**
 * 如果评论是针对 Page 的，则更新对应 Page 的 commentCount 属性
 */
function increaseCommentCountOfPage(next, done) {
  next();

  var Page = this.model('Page');
  Page.findByIdAndUpdate(this.topicId, {
    $inc: {
      commentCount: 1
    }
  }, done);
}

/**
 * 给话题作者发送通知
 */
function notifyTopicAuthor(next, done) {
  next();

  var self = this;
  async.waterfall([
    function findTopicAuthor(next) {
      var Topic = self.model('Topic');
      Topic.findById(self.topicId, function(err, topic) {
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
        topicId: self.topicId,
        commentId: self.id
      }, next);
    }
  ], done);
}

/**
 * 给原评论作者发送通知
 */
function notifyCommentsAuthor(next, done) {
  next();

  var self = this;
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
          topicId: self.topicId,
          masterCommentId: commentId,
          commentId: self.id
        }, next);
      }
    ], next);
  }, done);
}

/**
 * 当删除评论时减掉对应话题的评论数
 */
function decreaseCommentCountOfTopic(next, done) {
  next();

  var Topic = this.model('Topic');
  Topic.findByIdAndUpdate(this.topicId, {
    $inc: {
      commentCount: -1
    }
  }, done);
}

/**
 * 当删除评论时减掉对应 Page 的评论数
 */
function decreaseCommentCountOfPage(next, done) {
  next();

  var Page = this.model('Page');
  Page.findByIdAndUpdate(this.topicId, {
    $inc: {
      commentCount: -1
    }
  }, done);
}