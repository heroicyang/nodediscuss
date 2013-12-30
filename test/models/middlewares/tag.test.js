/**
 * test/models/middlewares/tag.test.js
 * 对节点模型的中间件逻辑进行测试
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
  Tag = models.Tag,
  Topic = models.Topic;
var data = require('../../fixtures/data.json');

describe('models/middlewares/tag.js', function() {
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

  before(function createTopics(done) {
    var self = this;
    var topics = _.map(data.topics, function(topic) {
      topic.author = { id: self.user.id };
      topic.tag = { id: self.tag.id };
      return topic;
    });
    Topic.create(topics, function(err, topic) {
      if (err) {
        throw err;
      }
      self.topic = topic;
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

  after(function(done) {
    Topic.remove(done);
  });

  it('if no slug, process the name and set as default slug before validate', function(done) {
    var tag = new Tag({
      name: 'mongoosejs',
      section: { id: this.section.id }
    });
    tag.validate(function(err) {
      if (err) {
        throw err;
      }
      should.exist(tag.slug);
      tag.slug.should.eql('mongoosejs');
      done();
    });
  });

  it('modified slug or name should update the corresponding topics', function(done) {
    var self = this;
    async.auto({
      updateTagNameAndSlug: function(next) {
        self.tag.name = 'Modified';
        self.tag.slug = 'modified';
        self.tag.save(function(err, tag) {
          next(err, tag);
        });
      },
      // 测试覆盖到既没修改节点地址也没修改节点名称的情况
      updateDescribe: ['updateTagNameAndSlug', function(next, results) {
        var tag = results.updateTagNameAndSlug;
        tag.describe = 'test...';
        tag.save(function(err) {
          next(err);
        });
      }],
      check: ['updateTagNameAndSlug', function(next) {
        Topic.findById(self.topic.id, function(err, topic) {
          if (err) {
            return next(err);
          }
          should.exist(topic);
          topic.tag.name.should.eql('Modified');
          topic.tag.slug.should.eql('modified');
          next(null);
        });
      }]
    }, done);
  });

  it('remove tag should remove all the corresponding topics', function(done) {
    this.tag.remove(function(err) {
      if (err) {
        throw err;
      }
      Topic.count(function(err, count) {
        if (err) {
          throw err;
        }
        count.should.eql(0);
        done();
      });
    });
  });
});