/**
 * 定义 UserSchema 的 pre-hooks
 * @author heroic
 */

/**
* Module dependencies
*/
var sanitize = require('../../sanitize');

module.exports = exports = function(schema) {
  // 验证之前先处理输入的数据
  schema
    .pre('validate', function(next) {
      sanitize(this, [
        'email',
        'username',
        'nickname',
        'tagline',
        'bio',
        'location',
        'website',
        'twitter',
        'github',
        'weibo'
      ]);

      if (!this.nickname) {
        this.nickname = this.username;
      }

      next();
    });
};