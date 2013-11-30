/**
 * 用户关系链相关的 API
 * @author heroic
 */

/**
 * Module dependencies
 */
var models = require('../models'),
  Relation = models.Relation;

/**
 * 关注某个用户
 * @param  {Object}   args
 *  - userId    当前用户 id
 *  - followId  要关注的用户 id
 * @param  {Function} callback
 *  - err    MongooseError
 */
exports.create = function(args, callback) {
  var userId = (this.currentUser && this.currentUser.id) || args.userId,
    followId = (this.user && this.user.id) || args.followId;
  Relation.create({
    userId: userId,
    followId: followId
  }, function(err) {
    callback(err);
  });
};

/**
 * 取消关注某个用户
 * @param  {Object}   args
 *  - userId    当前用户 id
 *  - followId  要取消关注的用户 id
 * @param  {Function} callback
 *  - err    MongooseError
 */
exports.remove = function(args, callback) {
  var userId = (this.currentUser && this.currentUser.id) || args.userId,
    followId = (this.user && this.user.id) || args.followId;
  Relation.destroy(userId, followId, callback);
};