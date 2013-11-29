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
exports.follow = function(args, callback) {
  var userId = args.userId,
    followId = args.followId;
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
exports.follow = function(args, callback) {
  var userId = args.userId,
    followId = args.followId;
  Relation.destroy(userId, followId, callback);
};

/**
 * 检查用户是否关注了某个用户
 * @param  {Object}   args
 *  - userId    当前用户 id
 *  - followId  对方用户 id
 * @param  {Function} callback
 *  - err    MongooseError
 *  - followed  true: 已关注，false: 未关注
 */
exports.check = function(args, callback) {
  var userId = args.userId,
    followId = args.followId;
  Relation.findOne({
    userId: userId,
    followId: followId
  }, function(err, relation) {
    if (err) {
      return callback(err);
    }
    callback(null, !!relation);
  });
};