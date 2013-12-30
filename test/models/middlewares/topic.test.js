/**
 * test/models/middlewares/topic.test.js
 * 对话题模型中间件的逻辑进行测试
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
  Topic = models.Topic,
  Comment = models.Comment;
var data = require('../../fixtures/data.json');

describe('models/middlewares/topic.js', function() {
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

  before(function createComments(done) {
    var self = this;
    var comments = _.map(data.comments, function(comment) {
      comment.author = { id: self.user.id };
      comment.refId = self.topic.id;
      return comment;
    });
    Comment.create(comments, function(err, comment) {
      if (err) {
        throw err;
      }
      self.comment = comment;
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

  after(function(done) {
    Comment.remove(done);
  });

  it('increase user\'s topicCount when create topic', function(done) {
    var self = this;
    async.auto({
      user: function(next) {
        User.findById(self.user.id, function(err, user) {
          next(err, user);
        });
      },
      createTopic: function(next) {
        Topic.create({
          title: 'Test...Test...',
          author: { id: self.user.id },
          tag: { id: self.tag.id }
        }, function(err, topic) {
          next(err, topic);
        });
      },
      updateTopic: ['createTopic', function(next, results) {
        var topic = results.createTopic;
        topic.content = 'This is a test topic...';
        topic.save(function(err) {
          next(err);
        });
      }],
      check: ['user', 'updateTopic', function(next, results) {
        User.findById(self.user.id, function(err, user) {
          if (err) {
            return next(err);
          }
          user.topicCount.should.eql(results.user.topicCount + 1);
          next(null);
        });
      }]
    }, done);
  });

  it('increase tag\'s topicCount when create topic', function(done) {
    var self = this;
    async.auto({
      tag: function(next) {
        Tag.findById(self.tag.id, function(err, tag) {
          next(err, tag);
        });
      },
      createTopic: function(next) {
        Topic.create({
          title: 'Test...Test...',
          author: { id: self.user.id },
          tag: { id: self.tag.id }
        }, function(err, topic) {
          next(err, topic);
        });
      },
      updateTopic: ['createTopic', function(next, results) {
        var topic = results.createTopic;
        topic.content = 'This is a test topic...';
        topic.save(function(err) {
          next(err);
        });
      }],
      check: ['tag', 'updateTopic', function(next, results) {
        Tag.findById(self.tag.id, function(err, tag) {
          if (err) {
            return next(err);
          }
          tag.topicCount.should.eql(results.tag.topicCount + 1);
          next(null);
        });
      }]
    }, done);
  });

  it('decrease user\'s topicCount when remove topic', function(done) {
    var self = this;
    async.auto({
      user: function(next) {
        User.findById(self.user.id, function(err, user) {
          next(err, user);
        });
      },
      removeTopic: function(next) {
        self.topic.remove(function(err) {
          next(err);
        });
      },
      check: ['user', 'removeTopic', function(next, results) {
        User.findById(self.user.id, function(err, user) {
          if (err) {
            return next(err);
          }
          user.topicCount.should.eql(results.user.topicCount - 1);
          next(null);
        });
      }]
    }, done);
  });

  it('decrease tag\'s topicCount when remove topic', function(done) {
    var self = this;
    async.auto({
      tag: function(next) {
        Tag.findById(self.tag.id, function(err, tag) {
          next(err, tag);
        });
      },
      removeTopic: function(next) {
        self.topic.remove(function(err) {
          next(err);
        });
      },
      check: ['tag', 'removeTopic', function(next, results) {
        Tag.findById(self.tag.id, function(err, tag) {
          if (err) {
            return next(err);
          }
          tag.topicCount.should.eql(results.tag.topicCount - 1);
          next(null);
        });
      }]
    }, done);
  });
});