/**
 * test/models/methods/class/tag.test.js
 * 测试 Tag 的类方法
 * @author heroic
 */

/**
* Module dependencies
*/
var async = require('async'),
  _ = require('lodash'),
  should = require('should');
var models = require('../../../db').models;
var User = models.User,
  Section = models.Section,
  Tag = models.Tag;
var data = require('../../../fixtures/data.json');

describe('models/methods/class/tag.js', function() {
  before(function createUsers(done) {
    var self = this;
    User.create(data.users[0], function(err, user) {
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
    Tag.create(tags, function(err, tag, tag1) {
      if (err) {
        throw err;
      }
      self.tag = tag;
      self.tag1 = tag1;
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

  it('Tag.query(options, callback): query tags', function(done) {
    Tag.query({}, function(err, count, tags) {
      if (err) {
        throw err;
      }
      count.should.be.a.Number;
      tags.should.be.an.Array;
      count.should.eql(tags.length);
      count.should.be.above(0);
      done();
    });
  });

  it('Tag.add(tagData, callback): add new tag', function(done) {
    Tag.add({
      slug: 'test',
      name: 'Test',
      section: { id: this.section.id }
    }, function(err, tag) {
      if (err) {
        throw err;
      }
      should.exist(tag);
      done();
    });
  });

  it('Tag.edit(tagData, callback): edit tag data', function(done) {
    var self = this;
    async.parallel([
      function(next) {
        var tag = {
          id: self.tag.id,
          name: 'Test1'
        };
        Tag.edit(tag, next);
      },
      function(next) {
        self.tag.name = 'Test2';
        Tag.edit(self.tag, next);
      }
    ], done);
  });

  it('Tag.get(conditions, callback): find one tag', function(done) {
    var self = this;
    Tag.get({
      _id: this.tag.id
    }, function(err, tag) {
      if (err) {
        throw err;
      }
      should.exist(tag);
      tag.id.should.eql(self.tag.id);
      done();
    });
  });

  it('Tag.getCount(conditions, callback): get tag count', function(done) {
    Tag.getCount({}, function(err, count) {
      if (err) {
        throw err;
      }
      count.should.be.a.Number;
      count.should.be.above(0);
      done();
    });
  });

  it('Tag.destroy(conditions, callback): remove a tag', function(done) {
    Tag.destroy({
      _id: this.tag1.id
    }, function(err, tag) {
      if (err) {
        throw err;
      }
      Tag.findById(tag.id, function(err, tag) {
        if (err) {
          throw err;
        }
        should.not.exist(tag);
        done();
      });
    });
  });

  it('Tag.getFavoritedState(options, callback): check whether someone favorited the tag', function(done) {
    Tag.getFavoritedState({
      userId: this.user.id,
      tagId: this.tag.id
    }, function(err, favorited) {
      if (err) {
        throw err;
      }
      favorited.should.not.be.ok;
      done();
    });
  });
});