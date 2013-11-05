/**
 * 定义 CommentSchema 的 pre-hooks
 * @author heroic
 */

/**
 * Module dependencies
 */
var sanitize = require('validator').sanitize,
  _ = require('lodash'),
  ObjectId = require('mongoose').Types.ObjectId,
  whenNewThen = require('../decorator').whenNewThen;

/**
* Bootstrap
* @param  {Mongoose.Schema} schema
*/
module.exports = exports = function(schema) {
  schema
    .pre('validate', processCommentData)
    .pre('validate', true, validateAuthor)
    .pre('save', true, whenNewThen(updateTopic));
};

/**
 * 处理输入的评论内容，XSS 防范
 */
function processCommentData(next) {
  this.content = sanitize(this.content).xss();
  next();
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