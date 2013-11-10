/**
 * Module dependencies
 */
var should = require('should'),
  db = require('../db'),
  models = db.models;
var User = models.User,
  Tag = models.Tag,
  FavoriteTag = models.FavoriteTag;
var shared = require('./shared');

describe('Model#FavoriteTag', function() {
  beforeEach(shared.createUser);
  beforeEach(shared.createSections);
  beforeEach(shared.createTag);
  beforeEach(shared.createFavoriteTag);
  afterEach(shared.removeUsers);
  afterEach(shared.removeSections);
  afterEach(shared.removeTags);
  afterEach(shared.removeFavoriteTags);

  describe('Hooks', function() {
    describe('pre/favorite_tag.js', function() {
      it('should increase `favoriteTagCount` of user when favorite a tag', function(done) {
        User.findById(this.user.id, function(err, user) {
          if (err) {
            return done(err);
          }
          user.favoriteTagCount.should.eql(1);
          done();
        });
      });

      it('should increase `favoriteCount` of tag when favorite a tag', function(done) {
        Tag.findById(this.tag.id, function(err, tag) {
          if (err) {
            return done(err);
          }
          tag.favoriteCount.should.eql(1);
          done();
        });
      });

      it('should decrease `favoriteTagCount` of user when cancel a tag favorite', function(done) {
        var self = this;
        FavoriteTag.destroy(this.user.id, this.tag.id, function(err) {
          if (err) {
            return done(err);
          }
          User.findById(self.user.id, function(err, user) {
            if (err) {
              return done(err);
            }
            user.favoriteTagCount.should.eql(0);
            done();
          });
        });
      });

      it('should decrease `favoriteCount` of tag when cancel a tag favorite', function(done) {
        var self = this;
        FavoriteTag.destroy(this.user.id, this.tag.id, function(err) {
          if (err) {
            return done(err);
          }
          Tag.findById(self.tag.id, function(err, tag) {
            if (err) {
              return done(err);
            }
            tag.favoriteCount.should.eql(0);
            done();
          });
        });
      });
    });
  });

  describe('Methods', function() {
    describe('FavoriteTag#destroy(userId, tagId, callback)', function() {
      it('cancel a user\'s favorite tag', function(done) {
        var self = this;
        FavoriteTag.destroy(this.user.id, this.tag.id, function(err) {
          if (err) {
            return done(err);
          }
          FavoriteTag.findOne({
            userId: self.user.id,
            'tag.id': self.tag.id
          }, function(err, favoriteTag) {
            if (err) {
              return done(err);
            }
            should.not.exist(favoriteTag);
            done();
          });
        });
      });
    });
  });
});