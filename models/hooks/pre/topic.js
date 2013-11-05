/**
 * 为 TopicSchema 定义 pre-hooks
 * @author heroic
 */

/**
* Module dependencies
*/
var sanitize = require('validator').sanitize,
  _ = require('lodash'),
  async = require('async'),
  ObjectId = require('mongoose').Types.ObjectId,
  whenNewThen = require('../decorator').whenNewThen;

/**
* Bootstrap
* @param  {Mongoose.Schema} schema
*/
module.exports = exports = function(schema) {
  schema
   .pre('validate', processTopicData)
   .pre('validate', true, validateAuthor)
   .pre('validate', true, validateNode)
   .pre('save', true, whenNewThen(increaseTopicCountOfUser))
   .pre('save', true, whenNewThen(increaseTopicCountOfNode))
   .pre('remove', true, decreaseTopicCountOfUser)
   .pre('remove', true, decreaseTopicCountOfNode)
   .pre('remove', true, removeComments)
   .pre('remove', true, removeFormFavorites);
};

/**
 * 处理输入的话题数据，XSS 防范
 */
function processTopicData(next) {
  this.title = sanitize(this.title).xss();
  this.content = sanitize(this.content).xss();
  next();
}

/**
 * 验证提供的作者是否存在于数据库的 user collection 中
 * 如果存在则将 topic 的 author 属性值覆写，保存成数据库中最新的副本信息
 */
function validateAuthor(next, done) {
  next();

  var User = this.model('User'),
    self = this,
    authorId;
  try {
    authorId = new ObjectId(this.author.id);
  } catch (e) {
    self.invalidate('author.id', 'Invalid author id!', self.author.id);
    return done();
  }

  User.findById(authorId, function(err, user) {
    if (err) {
      return done(err);
    }

    if (!user) {
      self.invalidate('author.id', 'Author does not exist.', self.author.id);
    } else {
      _.extend(self.author, {
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar
      });
    }
    done();
  });
}

/**
 * 验证提供的节点是否存在于数据库的  node collection 中
 * 如果存在则将 topic 的 node 属性值覆写，保存成数据库中最新的副本信息
 */
function validateNode(next, done) {
  next();

  var Node = this.model('Node'),
    self = this,
    nodeId;
  try {
    nodeId = new ObjectId(this.node.id);
  } catch (e) {
    self.invalidate('node.id', 'Invalid node id!', self.node.id);
    return done();
  }

  Node.findById(nodeId, function(err, node) {
    if (err) {
      return done(err);
    }

    if (!node) {
      self.invalidate('node.id', 'Node does not exist.', self.node.id);
    } else {
      _.extend(self.node, {
        name: node.name
      });
    }
    done();
  });
}

/**
 * 更新 user 的 topicCount 属性，每发布一条 topic 则递增
 */
function increaseTopicCountOfUser(next, done) {
  next();

  var User = this.model('User');
  User.findByIdAndUpdate(this.author.id, {
    $inc: {
      topicCount: 1
    }
  }, done);
}

/**
 * 更新 node 的 topicCount 属性，每发布一条 topic 则递增
 */
function increaseTopicCountOfNode(next, done) {
  next();

  var Node = this.model('Node');
  Node.findByIdAndUpdate(this.node.id, {
    $inc: {
      topicCount: 1
    }
  }, done);
}

/**
 * 删除 topic 时减少 user 的 topicCount 值
 */
function decreaseTopicCountOfUser(next, done) {
  next();

  var User = this.model('User');
  User.findByIdAndUpdate(this.author.id, {
    $inc: {
      topicCount: -1
    }
  }, done);
}

/**
 * 删除 topic 时减少 node 的 topicCount 值
 */
function decreaseTopicCountOfNode(next, done) {
  next();

  var Node = this.model('Node');
  Node.findByIdAndUpdate(this.node.id, {
    $inc: {
      topicCount: -1
    }
  }, done);
}

/**
 * 删除 topic 时删除其对应的 comments
 */
function removeComments(next, done) {
  next();

  var Comment = this.model('Comment');
  Comment.remove({
    topicId: this.id
  }, done);
}

/**
 * 删除 topic 时，把该 topic 从别人的收藏里面移除
 */
function removeFormFavorites(next, done) {
  next();

  var FavoriteTopic = this.model('FavoriteTopic');
  FavoriteTopic.find({
    topicId: this.id
  }, function(err, favoriteTopics) {
    if (err) {
      return done(err);
    }
    // Why do?
    // 在删除 FavoriteTopic 时需要执行它的中间件(pre-hooks)，
    // 用以减少对应 user 中的 topicFavoriteCount 值,
    // 所以需要调用 Model 的实例对象的 remove 方法，而不是 Model.remove
    // 不过数据量大的话或许这里会存在性能问题，导致长时间没有响应客户端
    async.each(favoriteTopics, function(favoriteTopic, next) {
      favoriteTopic.remove(next);
    }, done);
  });
}