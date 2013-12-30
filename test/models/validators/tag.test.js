/**
 * test/models/validators/tag.test.js
 * @author heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash'),
  should = require('should');
var models = require('../../db').models;
var Section = models.Section,
  Tag = models.Tag;
var data = require('../../fixtures/data.json');

describe('models/validators/tag.js', function() {
  before(function createSections(done) {
    var self = this;
    Section.create(data.sections, function(err, section) {
      if (err) {
        throw err;
      }
      self.section = section;
      done();
    });
  });

  before(function createTags(done) {
    var self = this;
    var tags = _.map(data.tags, function(tag) {
      tag.section = {
        id: self.section.id
      };
      return tag;
    });
    Tag.create(tags, function(err, tag) {
      if (err) {
        throw err;
      }
      self.tag = tag;
      done();
    });
  });

  after(function(done) {
    Tag.remove(done);
  });

  after(function(done) {
    Section.remove(done);
  });
  
  it('exists slug should throw ValidationError', function(done) {
    var tag = new Tag({
      slug: 'node',
      name: 'Node.js',
      section: {
        id: this.section.id
      }
    });
    tag.validate(function(err) {
      should.exist(err);
      err.name.should.eql('ValidationError');
      done();
    });
  });

  it('invalid section id should throw ValidationError', function(done) {
    var tag = new Tag({
      slug: 'express',
      name: 'Express',
      section: {
        id: '123asdsad5'
      }
    });
    tag.validate(function(err) {
      should.exist(err);
      err.name.should.eql('ValidationError');
      done();
    });
  });

  it('section does not exist should throw ValidationError', function(done) {
    var tag = new Tag({
      slug: 'express',
      name: 'Express',
      section: {
        id: '52a486511db59f0a12000004'
      }
    });
    tag.validate(function(err) {
      should.exist(err);
      err.name.should.eql('ValidationError');
      done();
    });
  });
});