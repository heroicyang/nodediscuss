/**
 * Module dependencies
 */
var should = require('should'),
  db = require('../db'),
  models = db.models;
var User = models.User,
  Catalogue = models.Catalogue,
  FavoriteCatalogue = models.FavoriteCatalogue;
var shared = require('./shared');

describe('Model#FavoriteCatalogue', function() {
  beforeEach(shared.createUser);
  beforeEach(shared.createCatalogue);
  beforeEach(shared.createFavoriteCatalogue);
  afterEach(shared.removeUsers);
  afterEach(shared.removeCatalogues);
  afterEach(shared.removeFavoriteCatalogues);

  describe('Hooks', function() {
    describe('pre/favorite_catalogue.js', function() {
      it('should increase `favoriteCatalogueCount` of user when favorite a catalogue', function(done) {
        User.findById(this.user.id, function(err, user) {
          if (err) {
            return done(err);
          }
          user.favoriteCatalogueCount.should.eql(1);
          done();
        });
      });

      it('should increase `favoriteUserCount` of catalogue when favorite a catalogue', function(done) {
        Catalogue.findById(this.catalogue.id, function(err, catalogue) {
          if (err) {
            return done(err);
          }
          catalogue.favoriteUserCount.should.eql(1);
          done();
        });
      });

      it('should decrease `favoriteCatalogueCount` of user when cancel a catalogue favorite', function(done) {
        var self = this;
        FavoriteCatalogue.destroy(this.user.id, this.catalogue.id, function(err) {
          if (err) {
            return done(err);
          }
          User.findById(self.user.id, function(err, user) {
            if (err) {
              return done(err);
            }
            user.favoriteCatalogueCount.should.eql(0);
            done();
          });
        });
      });

      it('should decrease `favoriteUserCount` of catalogue when cancel a catalogue favorite', function(done) {
        var self = this;
        FavoriteCatalogue.destroy(this.user.id, this.catalogue.id, function(err) {
          if (err) {
            return done(err);
          }
          Catalogue.findById(self.catalogue.id, function(err, catalogue) {
            if (err) {
              return done(err);
            }
            catalogue.favoriteUserCount.should.eql(0);
            done();
          });
        });
      });
    });
  });

  describe('Methods', function() {
    describe('FavoriteCatalogue#destroy(userId, catalogueId, callback)', function() {
      it('cancel a user\'s favorite catalogue', function(done) {
        var self = this;
        FavoriteCatalogue.destroy(this.user.id, this.catalogue.id, function(err) {
          if (err) {
            return done(err);
          }
          FavoriteCatalogue.findOne({
            userId: self.user.id,
            'catalogue.id': self.catalogue.id
          }, function(err, favoriteCatalogue) {
            if (err) {
              return done(err);
            }
            should.not.exist(favoriteCatalogue);
            done();
          });
        });
      });
    });
  });
});