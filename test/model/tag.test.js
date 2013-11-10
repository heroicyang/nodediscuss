/**
 * Module dependencies
 */
var should = require('should'),
  db = require('../db'),
  models = db.models;
var Tag = models.Tag;
var shared = require('./shared');

describe('Model#Tag', function() {
  beforeEach(shared.createSections);
  beforeEach(shared.createTags);
  afterEach(shared.removeTags);
  afterEach(shared.removeSections);

  describe('Methods', function() {
    describe('Tag#findAllGroupedBySection(callback)', function() {
      it('should return grouped tags', function(done) {
        Tag.findAllGroupedBySection(function(err, tags) {
          should.exist(tags);
          tags.should.be.type('object');
          tags.should.have.property('Node.js');
          tags.should.have.property('Web 开发');
          done();
        });
      });
    });

    describe('Tag#findTops([limit], callback)', function() {
      it('default to return the 5 most popular tags', function(done) {
        Tag.findTops(function(err, tags) {
          should.exist(tags);
          (5 - tags.length >= 0).should.be.true;
          done();
        });
      });

      it('should return a specified number of tags', function(done) {
        Tag.findTops(3, function(err, tags) {
          should.exist(tags);
          (3 - tags.length >= 0).should.be.true;
          tags.should.have.length(3);
          done();
        });
      });
    });
  });
});