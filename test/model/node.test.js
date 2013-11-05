/**
 * Module dependencies
 */
var should = require('should'),
  async = require('async'),
  db = require('../db'),
  models = db.models;
var User = models.User,
  Node = models.Node,
  Topic = models.Topic;

describe('Model#Node', function() {
  beforeEach(function(done) {
    var nodes = [{
      name: 'Express',
      category: 'Node.js'
    }, {
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
    }];
    Node.create(nodes, done);
  });

  afterEach(function(done) {
    async.parallel([
      function removeUser(next) {
        User.remove(next);
      },
      function removeNode(next) {
        Node.remove(next);
      },
      function removeTopic(next) {
        Topic.remove(next);
      }
    ], done);
  });

  describe('Methods', function() {
    describe('Node#findAllGroupedByCategory(callback)', function() {
      it('should return grouped nodes', function(done) {
        Node.findAllGroupedByCategory(function(err, nodes) {
          should.exist(nodes);
          nodes.should.be.type('object');
          nodes.should.have.property('Node.js');
          nodes.should.have.property('Web开发');
          done();
        });
      });
    });

    describe('Node#findTopNodes([limit], callback)', function() {
      it('default to return the 5 most popular nodes', function(done) {
        Node.findTopNodes(function(err, nodes) {
          should.exist(nodes);
          (5 - nodes.length >= 0).should.be.true;
          done();
        });
      });

      it('should return a specified number of nodes', function(done) {
        Node.findTopNodes(3, function(err, nodes) {
          should.exist(nodes);
          (3 - nodes.length >= 0).should.be.true;
          nodes.should.have.length(3);
          done();
        });
      });
    });
  });
});