/**
 * Module dependencies
 */
var models = require('../db').models;

var User = models.User,
  Section = models.Section,
  Tag = models.Tag,
  Topic = models.Topic,
  Comment = models.Comment,
  FavoriteTag = models.FavoriteTag,
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

exports.createSections = function(callback) {
  var self = this;
  Section.create([{
    name: 'Node.js'
  }, {
    name: 'Web 开发'
  }, {
    name: '社区活动'
  }], function(err) {
    if (err) {
      return callback(err);
    }
    self.sections = Array.prototype.slice.call(arguments, 1);
    callback();
  });
};

exports.removeSections = function(callback) {
  Section.remove(callback);
};

exports.createTag = function(callback) {
  var self = this;
  Tag.create({
    name: 'Express',
    section: {
      id: this.sections[0].id,
      name: this.sections[0].name
    }
  }, function(err, tag) {
    if (err) {
      return callback(err);
    }
    self.tag = tag;
    callback();
  });
};

exports.createTags = function(callback) {
  var self = this;
  Tag.create([{
    name: 'Connect',
    section: {
      id: this.sections[0].id,
      name: this.sections[0].name
    }
  }, {
    name: 'Mongoose',
    section: {
      id: this.sections[0].id,
      name: this.sections[0].name
    }
  }, {
    name: 'Mongodb',
    section: {
      id: this.sections[1].id,
      name: this.sections[1].name
    }
  }, {
    name: 'Redis',
    section: {
      id: this.sections[1].id,
      name: this.sections[1].name
    }
  }, {
    name: '京 JS',
    section: {
      id: this.sections[2].id,
      name: this.sections[2].name
    }
  }], function(err) {
    if (err) {
      return callback(err);
    }
    self.tags = Array.prototype.slice.call(arguments, 1);
    callback();
  });
};

exports.removeTags = function(callback) {
  Tag.remove(callback);
};

exports.createTopic = function(callback) {
  var self = this;
  Topic.create({
    title: 'this is a test topic...',
    content: 'this is a test topic...',
    tag: {
      id: this.tag.id
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

exports.createComment = function(callback) {
  var self = this;
  Comment.create({
    topicId: this.topic.id,
    content: 'this is a test comment',
    author: {
      id: this.user.id
    }
  }, function(err, comment) {
    if (err) {
      return callback(err);
    }
    self.comment = comment;
    callback();
  });
};

exports.removeComments = function(callback) {
  Comment.remove(callback);
};

exports.createFavoriteTag = function(callback) {
  FavoriteTag.create({
    userId: this.user.id,
    tag: {
      id: this.tag.id,
      name: this.tag.name
    }
  }, callback);
};

exports.removeFavoriteTags = function(callback) {
  FavoriteTag.remove(callback);
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