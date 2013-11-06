/**
 * Module dependencies
 */
var models = require('../db').models;

var User = models.User,
  Node = models.Node,
  Topic = models.Topic,
  Comment = models.Comment,
  FavoriteNode = models.FavoriteNode,
  FavoriteTopic = models.FavoriteTopic;

exports.createUser = function(callback) {
  var self = this;
  User.create({
    email: 'me@heroicyang.com',
    username: 'heroic',
    password: '111111'
  }, function(err, user) {
    if (err) {
      return callback(err);
    }
    self.user = user;
    callback();
  });
};

exports.removeUsers = function(callback) {
  User.remove(callback);
};

exports.createNode = function(callback) {
  var self = this;
  Node.create({
    name: 'Express',
    category: 'Node.js'
  }, function(err, node) {
    if (err) {
      return callback(err);
    }
    self.node = node;
    callback();
  });
};

exports.createNodes = function(callback) {
  var self = this;
  Node.create([{
    name: 'Connect',
    category: 'Node.js'
  }, {
    name: 'Mongoose',
    category: 'Node.js'
  }, {
    name: 'Mongodb',
    category: 'Web开发'
  }, {
    name: 'Redis',
    category: 'Web开发'
  }, {
    name: '京 JS',
    category: '社区活动'
  }], function(err) {
    if (err) {
      return callback(err);
    }
    self.nodes = Array.prototype.slice.call(arguments, 1);
    callback();
  });
};

exports.removeNodes = function(callback) {
  Node.remove(callback);
};

exports.createTopic = function(callback) {
  var self = this;
  Topic.create({
    title: 'this is a test topic...',
    content: 'this is a test topic...',
    node: {
      id: this.node.id
    },
    author: {
      id: this.user.id
    }
  }, function(err, topic) {
    if (err) {
      return callback(err);
    }
    self.topic = topic;
    callback();
  });
};

exports.removeTopics = function(callback) {
  Topic.remove(callback);
};

exports.removeComments = function(callback) {
  Comment.remove(callback);
};

exports.createFavoriteNode = function(callback) {
  FavoriteNode.create({
    userId: this.user.id,
    node: {
      id: this.node.id,
      name: this.node.name
    }
  }, callback);
};

exports.removeFavoriteNodes = function(callback) {
  FavoriteNode.remove(callback);
};

exports.createFavoriteTopic = function(callback) {
  FavoriteTopic.create({
    userId: this.user.id,
    topicId: this.topic.id
  }, callback);
};

exports.removeFavoriteTopics = function(callback) {
  FavoriteTopic.remove(callback);
};