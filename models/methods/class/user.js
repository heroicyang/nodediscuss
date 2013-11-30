/**
 * User 类方法
 * @author heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * 根据 username 查询用户，由于 username 不能重复，所以只返回单一记录
 * @param  {String}   username 
 * @param  {Function} callback  查询后的回调函数
 *  - err  MongooseError
 *  - user 符合条件的用户，如无则返回 null 
 * @return {Mongoose.Query}
 */
exports.findOneByUsername = function(username, callback) {
  return this.findOne({
    username: username
  }, callback);
};

/**
 * 根据 email 查询用户，由于 email 不能重复，所以只返回单一记录
 * @param  {String}   email 
 * @param  {Function} callback  查询后的回调函数
 *  - err  MongooseError
 *  - user 符合条件的用户，如无则返回 null 
 * @return {Mongoose.Query}
 */
exports.findOneByEmail = function(email, callback) {
  return this.findOne({
    email: email
  }, callback);
};

/**
 * 修改用户密码
 * @param  {Object}   userData
 *  - id             required  用户 id
 *  - newPassword    required  新密码
 * @param  {Function} callback 
 *  - err
 *  - user   最新的 user 对象
 */
exports.changePassword = function(userData, callback) {
  var id = userData.id || userData._id,
    newPassword = userData.newPassword;

  this.findById(id)
    .exec(function(err, user) {
      if (err) {
        return callback(err);
      }
      if (!user) {
        return callback(null, user);
      }

      user.password = newPassword;
      user.save(function(err, user) {
        callback(err, user);
      });
    });
};

/**
 * 修改用户信息
 * @param  {Object}   userData
 *  - id    required  用户 id
 * @param  {Function} callback
 *  - err
 *  - user   修改后的 user 对象
 */
exports.edit = function(userData, callback) {
  var id = userData.id || userData._id;

  this.findById(id)
    .exec(function(err, user) {
      if (err) {
        return callback(err);
      }
      if (!user || _.isEmpty(userData)) {
        return callback(null, user);
      }

      _.extend(user, userData);
      user.save(callback);
    });
};

/**
 * 检查用户名是否存在
 * @param  {String}   username  用户名
 * @param  {Function} callback
 *  - err
 *  - exist  true: 存在，false: 不存在
 */
exports.isUsernameExist = function(username, callback) {
  this.findOneByUsername(username, function(err, user) {
    if (err) {
      return callback(err);
    }
    callback(null, !!user);
  });
};

/**
 * 检查用户名是否存在
 * @param  {String}   email     E-mail
 * @param  {Function} callback
 *  - err
 *  - exist  true: 存在，false: 不存在
 */
exports.isEmailExist = function(email, callback) {
  this.findOneByEmail(email, function(err, user) {
    if (err) {
      return callback(err);
    }
    callback(null, !!user);
  });
};