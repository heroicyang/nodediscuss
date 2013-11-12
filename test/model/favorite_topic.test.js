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
  beforeEach(shared.createSections);
  beforeEach(shared.createTag);
  beforeEach(shared.createTopic);
  beforeEach(shared.createFavoriteTopic);
  afterEach(shared.removeUsers);
  afterEach(shared.removeSections);
  afterEach(shared.removeTags);
  afterEach(shared.removeTopics);
  afterEach(shared.removeFavoriteTopics);

  describe('Validators', function() {
    describe('FavoriteTopic#userId', function() {
      it('userId is required', function(done) {
        var favoriteTopic = new FavoriteTopic({
          topic: {
            id: this.topic.id
          }
        });
        favoriteTopic.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });

      it('userId must be a Mongoose.Schema.ObjectId value to string', function(done) {
        var favoriteTopic = new FavoriteTopic({
          userId: '1234',
          topic: {
            id: this.topic.id
          }
        });
        favoriteTopic.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });
    });

    describe('FavoriteTopic#topicId', function() {
      it('topicId is required', function(done) {
        var favoriteTopic = new FavoriteTopic({
          userId: {
            id: this.user.id
          }
        });
        favoriteTopic.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });

      it('topicId must be a Mongoose.Schema.ObjectId value to string', function(done) {
        var favoriteTopic = new FavoriteTopic({
          topicId: '1234',
          userId: {
            id: this.user.id
          }
        });
        favoriteTopic.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });
    });
  });

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

      it('should increase `favoriteCount` of topic when favorite a topic', function(done) {
        Topic.findById(this.topic.id, function(err, topic) {
          if (err) {
            return done(err);
          }
          topic.favoriteCount.should.eql(1);
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

      it('should decrease `favoriteCount` of topic when cancel a topic favorite', function(done) {
        var self = this;
        FavoriteTopic.destroy(this.user.id, this.topic.id, function(err) {
          if (err) {
            return done(err);
          }
          Topic.findById(self.topic.id, function(err, topic) {
            if (err) {
              return done(err);
            }
            topic.favoriteCount.should.eql(0);
            done();
          });
        });
      });
    });
  });

  describe('Methods', function() {
    describe('FavoriteTopic.destroy(userId, topicId, callback)', function() {
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