/**
 * 定义 UserSchema 的 pre-hooks
 * @author heroic
 */

/**
* Module dependencies
*/
var sanitize = require('validator').sanitize;

/** Exports hooks */
module.exports = exports = function(schema) {
  // 验证之前先处理输入的数据
  schema
    .pre('validate', function(next) {
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
    });
};