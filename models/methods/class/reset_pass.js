/**
 * ResetPass 类方法
 * @author heroic
 */

/**
* Module dependencies
*/
var _ = require('lodash');
var mailer = require('../../../mailer');

/**
 * 新增一条密码重置记录，并向用户发送密码重置邮件
 * @param {Object}   userData
 *  - email   required    用户用于登录的电子邮箱
 * @param {Function} callback
 */
exports.add = function(userData, callback) {
  var email = userData.email;
  this.create({
    email: email
  }, function(err, resetPass) {
    if (err) {
      return callback(err);
    }
    mailer.sendResetPassMail(resetPass, function(err) {
      callback(err);
    });
  });
};

/**
 * 根据条件获取最近一条密码重置记录
 * @param  {Object}   conditions   查询条件
 * @param  {Function} callback
 *  - err
 *  - resetPass
 */
exports.get = function(conditions, callback) {
  this.findOne(conditions, null, { createdAt: -1 }, callback);
};

/**
 * 设置密码重置记录的有效状态
 * @param {Object}   options
 *  - id         required   密码重置记录 id
 *  - available  optional   有效状态。 true 代表有效，false 代表无效
 * @param {Function} callback
 *  - err
 *  - resetPass
 */
exports.setAvailable = function(options, callback) {
  options = options || {};
  var id = options.id || options._id,
    available = _.isUndefined(options.available) ? false : options.available;
  this.findByIdAndUpdate(id, {
    available: available
  }, function(err, resetPass) {
    callback(err, resetPass);
  });
};