/**
 * 定义 FavoriteNodeSchema 的 pre-hooks
 * @author heroic
 */

/**
* Module dependencies
*/
var whenNewThen = require('../decorator').whenNewThen;

/**
* Bootstrap
* @param  {Mongoose.Schema} schema
*/
module.exports = exports = function(schema) {
  schema
   .pre('save', true, whenNewThen(incFavoriteNodeCountOfUser))
   .pre('save', true, whenNewThen(incFavoriteUserCountOfNode))
   .pre('remove', true, decFavoriteNodeCountOfUser)
   .pre('remove', true, decFavoriteUserCountOfNode);
};

/**
 * 增加对应用户的 favoriteNodeCount 值
 */
function incFavoriteNodeCountOfUser(next, done) {
  next();

  var User = this.model('User');
  User.findByIdAndUpdate(this.userId, {
    $inc: {
      favoriteNodeCount: 1
    }
  }, done);
}

/**
 * 增加对应节点的 favoriteUserCount 值
 */
function incFavoriteUserCountOfNode(next, done) {
  next();

  var Node = this.model('Node');
  Node.findByIdAndUpdate(this.node.id, {
    $inc: {
      favoriteUserCount: 1
    }
  }, done);
}

/**
 * 减少对应用户的 favoriteNodeCount 值
 */
function decFavoriteNodeCountOfUser(next, done) {
  next();

  var User = this.model('User');
  User.findByIdAndUpdate(this.userId, {
    $inc: {
      favoriteNodeCount: -1
    }
  }, done);
}

/**
 * 减少对应节点的 favoriteUserCount 值
 */
function decFavoriteUserCountOfNode(next, done) {
  next();

  var Node = this.model('Node');
  Node.findByIdAndUpdate(this.node.id, {
    $inc: {
      favoriteUserCount: -1
    }
  }, done);
}