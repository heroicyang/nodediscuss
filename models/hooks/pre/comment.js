/**
 * 定义 CommentSchema 的 pre-hooks
 * @author heroic
 */

/**
 * Module dependencies
 */
var sanitize = require('validator').sanitize,
  _ = require('lodash'),
  async = require('async'),
  ObjectId = require('mongoose').Types.ObjectId,
  constants = require('../../constants'),
  when = require('../when');

/**
* Bootstrap
* @param  {Mongoose.Schema} schema
*/
module.exports = exports = function(schema) {
  schema
    .pre('validate', processCommentData)
    .pre('validate', true, validateContent)
    .pre('validate', true, validateAuthor)
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
          .not('commentId')  // 有 commentId 则代表是回复某条评论，由下一个中间件来负责
          .then(notifyTopicAuthor))
    .pre('save', true,
        when('isNew')
          .not('onPage')  // 当评论 Page 时则不必通知，Page 中暂时不提供回复评论的功能
          .and('commentId')  // 有 commentId 才代表是回复某条评论
          .then(notifyCommentAuthor));
};

/**
 * 处理输入的评论内容，XSS 防范
 */
function processCommentData(next) {
  this.content = sanitize(this.content).xss();
  next();
}

/**
 * 检查评论内容，禁止重复评论
 */
function validateContent(next, done) {
  next();

  var Comment = this.model(this.constructor.modelName),
    self = this;
  Comment.find({
    topicId: this.topicId,
    'author.id': this.author.id
  }, function(err, comments) {
    if (err) {
      return done(err);
    }

    var repeated = false;
    if (comments.length) {
      _.each(comments, function(comment) {
        if (comment.content === self.content) {
          repeated = true;
          return;
        }
      });
    }

    if (repeated) {
      self.invalidate('content', 'Comment can not be repeated.', self.content);
    }
    done();
  });
}

/**
 * 验证提供的评论者是否存在于数据库的 user collection 中
 * 并且将最新的 user 部分信息保存到 comment 的 author 属性
 */
function validateAuthor(next, done) {
  next();

  var User = this.model('User'),
    self = this,
    authorId;
  try {
    authorId = new ObjectId(this.author.id);
  } catch (e) {
    self.invalidate('author.id', 'Invalid author id!', self.author.id);
    return done();
  }

  User.findById(authorId, function(err, user) {
    if (err) {
      return done(err);
    }

    if (!user) {
      self.invalidate('author.id', 'Author does not exist.', self.author.id);
    } else {
      _.extend(self.author, {
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar
      });
    }
    done();
  });
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
        nickname: this.author.nickname,
        commentedAt: this.createdAt
      }
    }
  }, done);
}

/**
 * 如果评论是针对 Page 的，则更新对应 Page 的 commentCount 属性
 */
function increaseCommentCountOfPage(next, done) {
  next();

  var Page = this.model('Page');
  Page.findByIdAndUpdate(this.topic, {
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
        topicId: self.topicId
      }, next);
    }
  ], done);
}

/**
 * 给原评论作者发送通知
 */
function notifyCommentAuthor(next, done) {
  next();

  var self = this;
  async.waterfall([
    function findCommentAuthor(next) {
      var Comment = self.model('Comment');
      Comment.findById(self.commentId, function(err, comment) {
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
        commentId: self.commentId
      }, next);
    }
  ], done);
}