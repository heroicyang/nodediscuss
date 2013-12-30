/**
 * test/models/middlewares/section.test.js
 * 对节点组数据模型的中间件逻辑进行测试
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  _ = require('lodash'),
  should = require('should');
var models = require('../../db').models;
var User = models.User,
  Section = models.Section,
  Tag = models.Tag;
var data = require('../../fixtures/data.json');

describe('models/middlewares/section.js', function() {
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

  it('modified name or sort should update the corresponding tags', function(done) {
    var self = this;
    async.auto({
      updateSectionName: function(next) {
        self.section.name = 'Modified';
        self.section.save(function(err, section) {
          next(err, section);
        });
      },
      // 测试覆盖到既没修改节点组名称也没修改节点组序号的情况
      updateTest: ['updateSectionName', function(next, results) {
        var section = results.updateSectionName;
        section.save(function(err) {
          next(err);
        });
      }],
      check: ['updateSectionName', function(next) {
        Tag.findById(self.tag.id, function(err, tag) {
          if (err) {
            return next(err);
          }
          should.exist(tag);
          tag.section.name.should.eql('Modified');
          next(null);
        });
      }]
    }, done);
  });

  it('remove section should remove all the corresponding tags', function(done) {
    this.section.remove(function(err) {
      if (err) {
        throw err;
      }
      Tag.count(function(err, count) {
        if (err) {
          throw err;
        }
        count.should.eql(0);
        done();
      });
    });
  });
});