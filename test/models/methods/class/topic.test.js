/**
 * test/models/methods/class/topic.test.js
 * 测试 Topic 的类方法
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
  Tag = models.Tag,
  Topic = models.Topic;
var data = require('../../../fixtures/data.json');

describe('models/methods/class/topic.js', function() {
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
    Topic.create(topics, function(err, topic, topic1) {
      if (err) {
        throw err;
      }
      self.topic = topic;
      self.topic1 = topic1;
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

  it('Topic.query(options, callback): query topics', function(done) {
    Topic.query({}, function(err, count, topics) {
      if (err) {
        throw err;
      }
      count.should.be.a.Number;
      topics.should.be.an.Array;
      count.should.eql(topics.length);
      count.should.be.above(0);
      done();
    });
  });

  it('Topic.add(topicData, callback): add new topic', function(done) {
    Topic.add({
      title: 'this is a test topic...',
      content: 'this is a test topic.. can mention someone, @heroic',
      tag: { id: this.tag.id },
      author: { id: this.user.id }
    }, function(err, topic) {
      if (err) {
        throw err;
      }
      should.exist(topic);
      done();
    });
  });

  it('Topic.edit(topicData, callback): edit topic data', function(done) {
    var self = this;
    async.parallel([
      function(next) {
        var topic = {
          id: self.topic.id,
          title: 'just update the title..'
        };
        Topic.edit(topic, next);
      },
      function(next) {
        self.topic.content = 'update the topic content...';
        Topic.edit(self.topic, next);
      }
    ], done);
  });

  it('Topic.get(conditions, callback): find one topic', function(done) {
    var self = this;
    Topic.get({
      _id: this.topic.id
    }, function(err, topic) {
      if (err) {
        throw err;
      }
      should.exist(topic);
      topic.id.should.eql(self.topic.id);
      done();
    });
  });

  it('Topic.getCount(conditions, callback): get topic count', function(done) {
    Topic.getCount({}, function(err, count) {
      if (err) {
        throw err;
      }
      count.should.be.a.Number;
      count.should.be.above(0);
      done();
    });
  });

  it('Topic.destroy(conditions, callback): remove a topic', function(done) {
    Topic.destroy({
      _id: this.topic1.id
    }, function(err, topic) {
      if (err) {
        throw err;
      }
      Topic.findById(topic.id, function(err, topic) {
        if (err) {
          throw err;
        }
        should.not.exist(topic);
        done();
      });
    });
  });

  it('Topic.setExcellent(options, callback): set the topic\'s excellent state', function(done) {
    Topic.setExcellent({
      id: this.topic.id,
      excellent: true
    }, function(err, topic) {
      if (err) {
        throw err;
      }
      topic.excellent.should.be.ok;
      done();
    });
  });

  it('Topic.setTop(options, callback): set the topic\'s top state', function(done) {
    Topic.setTop({
      id: this.topic.id,
      top: true
    }, function(err, topic) {
      if (err) {
        throw err;
      }
      topic.top.should.be.ok;
      done();
    });
  });

  it('Topic.incViews(options, callback): increase the topic\'s views', function(done) {
    var self = this;
    Topic.incViews({
      _id: this.topic.id
    }, function(err, topic) {
      if (err) {
        throw err;
      }
      topic.views.should.eql(self.topic.views + 1);
      done();
    });
  });

  it('Topic.getFavoritedState(options, callback): check whether someone favorited the topic', function(done) {
    Topic.getFavoritedState({
      userId: this.user.id,
      topicId: this.topic.id
    }, function(err, favorited) {
      if (err) {
        throw err;
      }
      favorited.should.not.be.ok;
      done();
    });
  });
});