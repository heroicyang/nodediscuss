/**
 * Module dependencies
 */
var models = require('../db').models;

var User = models.User,
  Catalogue = models.Catalogue,
  Topic = models.Topic,
  Comment = models.Comment,
  FavoriteCatalogue = models.FavoriteCatalogue,
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

exports.createCatalogue = function(callback) {
  var self = this;
  Catalogue.create({
    name: 'Express',
    section: 'Node.js'
  }, function(err, catalogue) {
    if (err) {
      return callback(err);
    }
    self.catalogue = catalogue;
    callback();
  });
};

exports.createCatalogues = function(callback) {
  var self = this;
  Catalogue.create([{
    name: 'Connect',
    section: 'Node.js'
  }, {
    name: 'Mongoose',
    section: 'Node.js'
  }, {
    name: 'Mongodb',
    section: 'Web开发'
  }, {
    name: 'Redis',
    section: 'Web开发'
  }, {
    name: '京 JS',
    section: '社区活动'
  }], function(err) {
    if (err) {
      return callback(err);
    }
    self.catalogues = Array.prototype.slice.call(arguments, 1);
    callback();
  });
};

exports.removeCatalogues = function(callback) {
  Catalogue.remove(callback);
};

exports.createTopic = function(callback) {
  var self = this;
  Topic.create({
    title: 'this is a test topic...',
    content: 'this is a test topic...',
    catalogue: {
      id: this.catalogue.id
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

exports.createFavoriteCatalogue = function(callback) {
  FavoriteCatalogue.create({
    userId: this.user.id,
    catalogue: {
      id: this.catalogue.id,
      name: this.catalogue.name
    }
  }, callback);
};

exports.removeFavoriteCatalogues = function(callback) {
  FavoriteCatalogue.remove(callback);
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