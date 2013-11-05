/**
 * 定义 CommentSchema 的 pre-hooks
 * @author heroic
 */

/**
 * Module dependencies
 */
var sanitize = require('validator').sanitize,
  _ = require('lodash'),
  ObjectId = require('mongoose').Types.ObjectId;

/**
* Bootstrap
* @param  {Mongoose.Schema} schema
*/
module.exports = exports = function(schema) {
  schema
    .pre('validate', processCommentData)
    .pre('validate', true, validateAauthor);
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
function validateAauthor(next, done) {
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