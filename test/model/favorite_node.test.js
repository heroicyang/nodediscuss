/**
 * Module dependencies
 */
var should = require('should'),
  db = require('../db'),
  models = db.models;
var User = models.User,
  Node = models.Node,
  FavoriteNode = models.FavoriteNode;
var shared = require('./shared');

describe('Model#FavoriteNode', function() {
  beforeEach(shared.createUser);
  beforeEach(shared.createNode);
  beforeEach(shared.createFavoriteNode);
  afterEach(shared.removeUsers);
  afterEach(shared.removeNodes);
  afterEach(shared.removeFavoriteNodes);

  describe('Hooks', function() {
    describe('pre/favorite_node.js', function() {
      it('should increase `favoriteNodeCount` of user when favorite a node', function(done) {
        User.findById(this.user.id, function(err, user) {
          if (err) {
            return done(err);
          }
          user.favoriteNodeCount.should.eql(1);
          done();
        });
      });

      it('should increase `favoriteUserCount` of node when favorite a node', function(done) {
        Node.findById(this.node.id, function(err, node) {
          if (err) {
            return done(err);
          }
          node.favoriteUserCount.should.eql(1);
          done();
        });
      });

      it('should decrease `favoriteNodeCount` of user when favorite a node', function(done) {
        var self = this;
        FavoriteNode.destroy(this.user.id, this.node.id, function(err) {
          if (err) {
            return done(err);
          }
          User.findById(self.user.id, function(err, user) {
            if (err) {
              return done(err);
            }
            user.favoriteNodeCount.should.eql(0);
            done();
          });
        });
      });

      it('should decrease `favoriteUserCount` of node when favorite a node', function(done) {
        var self = this;
        FavoriteNode.destroy(this.user.id, this.node.id, function(err) {
          if (err) {
            return done(err);
          }
          Node.findById(self.node.id, function(err, node) {
            if (err) {
              return done(err);
            }
            node.favoriteUserCount.should.eql(0);
            done();
          });
        });
      });
    });
  });

  describe('Methods', function() {
    describe('FavoriteNode#destroy(userId, nodeId, callback)', function() {
      it('cancel a user\'s favorite node', function(done) {
        var self = this;
        FavoriteNode.destroy(this.user.id, this.node.id, function(err) {
          if (err) {
            return done(err);
          }
          FavoriteNode.findOne({
            userId: self.user.id,
            'node.id': self.node.id
          }, function(err, favoriteNode) {
            if (err) {
              return done(err);
            }
            should.not.exist(favoriteNode);
            done();
          });
        });
      });
    });
  });
});