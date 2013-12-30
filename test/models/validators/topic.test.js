/**
 * test/models/validators/topic.test.js
 * @author heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash'),
  async = require('async'),
  should = require('should');
var models = require('../../db').models;
var Section = models.Section,
  Tag = models.Tag,
  User = models.User,
  Topic = models.Topic;
var data = require('../../fixtures/data.json');

describe('models/validators/topic.js', function() {
  before(function createUsers(done) {
    var self = this;
    User.create(data.users, function(err, user) {
      if (err) {
        throw err;
      }
      self.user = user;
      done();
    });
  });

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
    User.remove(done);
  });

  after(function(done) {
    Tag.remove(done);
  });

  after(function(done) {
    Section.remove(done);
  });

  it('title length must be less than 100 characters', function(done) {
    var titles = [
      'valid title',
      (new Array(100)).join('invalid title')
    ];
    var self = this;
    
    async.parallel([
      function(next) {
        var topic = new Topic({
          title: titles[0],
          author: { id: self.user.id },
          tag: { id: self.tag.id }
        });
        topic.validate(function(err) {
          should.not.exist(err);
          next(null);
        });
      },
      function(next) {
        var topic = new Topic({
          title: titles[1],
          author: { id: self.user.id },
          tag: { id: self.tag.id }
        });
        topic.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          next(null);
        });
      }
    ], done);
  });

  it('invalid tag id should throw ValidationError', function(done) {
    var topic = new Topic({
      title: 'this is a test topic',
      author: { id: this.user.id },
      tag: { id: '123asdasd' }
    });
    topic.validate(function(err) {
      should.exist(err);
      err.name.should.eql('ValidationError');
      done();
    });
  });

  it('tag does not exist should throw ValidationError', function(done) {
    var topic = new Topic({
      title: 'this is a test topic',
      author: { id: this.user.id },
      tag: {
        id: '52a486511db59f0a12000004'
      }
    });
    topic.validate(function(err) {
      should.exist(err);
      err.name.should.eql('ValidationError');
      done();
    });
  });

  it('invalid author id should throw ValidationError', function(done) {
    var topic = new Topic({
      title: 'this is a test topic',
      author: { id: '123asdasd' },
      tag: { id: this.tag.id }
    });
    topic.validate(function(err) {
      should.exist(err);
      err.name.should.eql('ValidationError');
      done();
    });
  });

  it('author does not exist should throw ValidationError', function(done) {
    var topic = new Topic({
      title: 'this is a test topic',
      author: {
        id: '52a486511db59f0a12000004'
      },
      tag: { id: this.tag.id }
    });
    topic.validate(function(err) {
      should.exist(err);
      err.name.should.eql('ValidationError');
      done();
    });
  });
});