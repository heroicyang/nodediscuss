/**
 * UserSchema middlewares
 * @author heroic
 */

/**
 * Module dependencies
 */
var sanitize = require('../../sanitize');

module.exports = exports = function(schema) {
  // 执行数据验证之前的中间件
  schema
    .pre('validate', function(next) {
      // 对用户输入的字段进行 xss 过滤
      sanitize(this, [
        'email', 'username', 'nickname',
        'tagline', 'bio', 'location',
        'website', 'weibo', 'twitter', 'github'
      ]);

      if (!this.nickname) {
        this.nickname = this.username;
      }
      next();
    });
};