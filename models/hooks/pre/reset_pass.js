/**
 * ResetPassSchema pre-hooks
 * @author heroic
 */

/** Exports hooks */
module.exports = exports = function(schema) {
  schema
    .pre('save', true, function(next, done) {
      next();

      // 将之前的重置记录都作废掉
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