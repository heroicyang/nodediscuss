/**
 * 定义 User 的实例方法
 * @author heroic
 */

/**
 * Module dependencies
 */
var crypto = require('crypto');

/**
 * 验证给定的明文密码是否与该用户的数据库密码一致
 * @param  {String} plainText   明文密码
 * @return {Boolean}
 */
exports.authenticate = function(plainText) {
  return this.encryptPassword(plainText) === this.passwordHashed;
};

/**
 * 为密码的加密过程“加盐”
 * @return {String}   随机字串
 */
exports.makeSalt = function() {
  return Math.round((new Date().valueOf() * Math.random())) + '';
};

/**
 * 密码加密
 * @param  {String} password
 * @return {String}          加密后的密码
 */
exports.encryptPassword = function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

/**
 * 激活用户
 * @param  {Function} callback 回调函数
 *  - err   MongooseError
 */
exports.activate = function(callback) {
  this.update({
    state: {
      activated: true
    }
  }, callback);
};