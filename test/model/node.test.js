/**
 * Module dependencies
 */
var should = require('should'),
  db = require('../db'),
  models = db.models;
var Node = models.Node;
var shared = require('./shared');

describe('Model#Node', function() {
  beforeEach(shared.createNodes);
  afterEach(shared.removeNodes);

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