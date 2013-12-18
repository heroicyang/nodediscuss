/**
 * ResetPassSchema middlewares
 * @author heroic
 */

module.exports = exports = function(schema) {
  // 执行数据保存之前
  schema
    .pre('save', true, function(next, done) {
      next();
      // 在创建新的密码找回记录时将之前的重置记录都作废掉
      var ResetPass = this.model('ResetPass');
      ResetPass.update({
        userId: this.userId,
        email: this.email,
        available: true
      }, {
        available: false
      }, {
        multi: true
      }, done);
    });
};