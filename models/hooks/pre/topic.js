/**
 * 为 TopicSchema 定义 pre-hooks
 * @author heroic
 */

/**
* Module dependencies
*/
var sanitize = require('validator').sanitize,
  _ = require('lodash'),
  ObjectId = require('mongoose').Types.ObjectId;

/**
* Bootstrap
* @param  {Mongoose.Schema} schema
*/
module.exports = exports = function(schema) {
  schema
   .pre('validate', processTopicData)
   .pre('validate', true, validateAuthor)
   .pre('validate', true, validateNode)
   .pre('save', true, increaseTopicCountOfUser)
   .pre('save', true, increaseTopicCountOfNode);
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

  // 只在 topic 创建时才递增数量，更新时则不用
  if (!this.isNew) {
    return done();
  }

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

  // 只在 topic 创建时才递增数量，更新时则不用
  if (!this.isNew) {
    return done();
  }

  var Node = this.model('Node');
  Node.findByIdAndUpdate(this.node.id, {
    $inc: {
      topicCount: 1
    }
  }, done);
}