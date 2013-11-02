/**
 * 为 UserSchema 定义 pre-hooks
 * @author heroic
 */

/**
* Module dependencies
*/
var sanitize = require('validator').sanitize;

/**
* Bootstrap
* @param  {Mongoose.Schema} schema
*/
module.exports = exports = function(schema) {
  schema
   .pre('validate', processUserData)
   .pre('save', true, doAsyncSimple);
};

/**
 * 处理用户数据的中间件。设置默认值、XSS 防范等
 */
function processUserData(next) {
  this.email = sanitize(this.email).xss();
  this.username = sanitize(this.username).xss();

  if (this.nickname) {
    this.nickname = sanitize(this.nickname).xss();
  } else {
    this.nickname = this.username;
  }

  if (this.tagline) {
    this.tagline = sanitize(this.tagline).xss();
  }
  if (this.bio) {
    this.bio = sanitize(this.bio).xss();
  }
  if (this.location) {
    this.location = sanitize(this.location).xss();
  }
  if (this.website) {
    this.website = sanitize(this.website).xss();
    if (!/(https?|s?ftp|git)/i.test(this.website)) {
      this.website = 'http://' + this.website;
    }
  }
  if (this.twitter) {
    this.twitter = sanitize(this.twitter).xss();
  }
  if (this.github) {
    this.github = sanitize(this.github).xss();
  }

  next();
}

/**
 * 并行执行中间件，占位，可能后面会加入一些逻辑
 */
function doAsyncSimple(next, done) {
  next();
  setTimeout(function() {
    done();
  }, 0);
}