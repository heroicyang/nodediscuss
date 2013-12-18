/**
 * User 实例方法
 * @author heroic
 */

/**
 * Module dependencies
 */
var crypto = require('crypto');

/**
 * 检查给定的明文密码与数据库密码是否一致
 * @param  {String} plainText   明文密码
 * @return {Boolean}
 */
exports.authenticate = function(plainText) {
  return this.encryptPassword(plainText) === this.passwordHashed;
};

/**
 * 为密码的加密过程提供“加盐”操作
 * @return {String}   随机字串
 */
exports.makeSalt = function() {
  return Math.round((new Date().valueOf() * Math.random())) + '';
};

/**
 * 密码加密
 * @param  {String} password
 * @return {String}   加密后的密码
 */
exports.encryptPassword = function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};