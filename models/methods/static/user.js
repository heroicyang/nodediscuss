/**
 * 为 UserSchema 定义静态方法（Model类方法）
 * @author heroic
 */

/**
 * 根据 username 查询用户，由于 username 不能重复，所以只返回单一记录
 * @param  {String}   username 
 * @param  {Function} callback  查询成功之后的回调函数
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
 * @param  {Function} callback  查询成功之后的回调函数
 *  - err  MongooseError
 *  - user 符合条件的用户，如无则返回 null 
 * @return {Mongoose.Query}
 */
exports.findOneByEmail = function(email, callback) {
  return this.findOne({
    email: email
  }, callback);
};