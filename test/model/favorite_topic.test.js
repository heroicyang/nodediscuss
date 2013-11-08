/**
 * Module dependencies
 */
var should = require('should'),
  db = require('../db'),
  models = db.models;
var User = models.User,
  Topic = models.Topic,
  FavoriteTopic = models.FavoriteTopic;
var shared = require('./shared');

describe('Model#FavoriteTopic', function() {
  beforeEach(shared.createUser);
  beforeEach(shared.createCatalogue);
  beforeEach(shared.createTopic);
  beforeEach(shared.createFavoriteTopic);
  afterEach(shared.removeUsers);
  afterEach(shared.removeCatalogues);
  afterEach(shared.removeTopics);
  afterEach(shared.removeFavoriteTopics);

  describe('Hooks', function() {
    describe('pre/favorite_topic.js', function() {
      it('should increase `favoriteTopicCount` of user when favorite a topic', function(done) {
        User.findById(this.user.id, function(err, user) {
          if (err) {
            return done(err);
          }
          user.favoriteTopicCount.should.eql(1);
          done();
        });
      });

      it('should increase `favoriteUserCount` of topic when favorite a topic', function(done) {
        Topic.findById(this.topic.id, function(err, topic) {
          if (err) {
            return done(err);
          }
          topic.favoriteUserCount.should.eql(1);
          done();
        });
      });

      it('should decrease `favoriteTopicCount` of user when cancel a topic favorite', function(done) {
        var self = this;
        FavoriteTopic.destroy(this.user.id, this.topic.id, function(err) {
          if (err) {
            return done(err);
          }
          User.findById(self.user.id, function(err, user) {
            if (err) {
              return done(err);
            }
            user.favoriteTopicCount.should.eql(0);
            done();
          });
        });
      });

      it('should decrease `favoriteUserCount` of topic when cancel a topic favorite', function(done) {
        var self = this;
        FavoriteTopic.destroy(this.user.id, this.topic.id, function(err) {
          if (err) {
            return done(err);
          }
          Topic.findById(self.topic.id, function(err, topic) {
            if (err) {
              return done(err);
            }
            topic.favoriteUserCount.should.eql(0);
            done();
          });
        });
      });
    });
  });

  describe('Methods', function() {
    describe('FavoriteTopic#destroy(userId, topicId, callback)', function() {
      it('cancel a user\'s favorite topic', function(done) {
        var self = this;
        FavoriteTopic.destroy(this.user.id, this.topic.id, function(err) {
          if (err) {
            return done(err);
          }
          FavoriteTopic.findOne({
            userId: self.user.id,
            topicId: self.topic.id
          }, function(err, favoriteTopic) {
            if (err) {
              return done(err);
            }
            should.not.exist(favoriteTopic);
            done();
          });
        });
      });
    });
  });
});