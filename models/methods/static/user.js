/**
 * 为 UserSchema 定义静态方法（Model类方法）
 * @author heroic
 */

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
 * 检查用户名/E-mail和密码是否匹配
 * @param  {Object}   userData  合法的user json对象，必须包含以下属性
 *  - username/email  用户名或者邮箱
 *  - password        密码
 * @param  {Function} callback 回调函数
 *  - err       MongooseError
 *  - user      用户不存在返回 null；存在则返回该用户信息
 *  - matched   用户不存在时不会传入该参数。匹配通过则返回 true，否则返回 false
 * @return {null}
 */
exports.check = function(userData, callback) {
  this.findOne()
    .or([{
      username: userData.username
    }, {
      email: userData.email
    }])
    .exec(function(err, user) {
      if (err) {
        return callback(err);
      }
      if (!user) {
        return callback(null, null);
      }

      callback(null, user, user.authenticate(userData.password));
    });
};

/**
 * 激活用户
 * @param  {Object}   userData   合法的user json对象，必须包含以下属性
 *  - username/email  用户名或者邮箱
 * @param  {Function} callback   回调函数
 *  - err       MongooseError
 * @return {null}
 */
exports.activate = function(userData, callback) {
  this.findOne()
    .or([{
      username: userData.username
    }, {
      email: userData.email
    }])
    .exec(function(err, user) {
      if (err) {
        return callback(err);
      }
      user.update({
        state: {
          activated: true
        }
      }, function(err) {
        callback(err);
      });
    });
};

/**
 * 修改用户密码
 * @param  {Object}   userData   合法的user json对象，必须包含以下属性
 *  - username/email   用户名或者邮箱
 *  - oldPassword      当前密码
 *  - newPassword      新密码
 *  - newPassword2     再次确认的新密码
 * @param  {Function} callback    回调函数
 *  - err    MongooseError
 *  - user   最新的 user 对象
 * @return {null}
 */
exports.changePassword = function(userData, callback) {
  var username = userData.username,
    email = userData.email,
    oldPassword = userData.oldPassword,
    newPassword = userData.newPassword,
    newPassword2 = userData.newPassword2;

  if (newPassword !== newPassword2) {
    return callback(new Error('Your new passwords do not match.'));
  }

  this.findOne()
    .or([{
      username: username
    }, {
      email: email
    }])
    .exec(function(err, user) {
      if (err) {
        return callback(err);
      }
      if (!user.authenticate(oldPassword)) {
        return callback(new Error('Your password is incorrect.'));
      }

      user.password = newPassword;
      user.save(function(err, user) {
        callback(err, user);
      });
    });
};