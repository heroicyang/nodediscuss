/**
 * test/models/validators/comment.test.js
 * 对评论数据的验证逻辑进行测试
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

describe('models/validators/comment.js', function() {
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

  after(function(done) {
    Comment.remove(done);
  });

  it('invalid refId should throw ValidationError', function(done) {
    var self = this;
    async.parallel([
      function(next) {
        var comment = new Comment({
          refId: '123sdad',
          content: 'This is a test comment.',
          author: { id: self.user.id }
        });
        comment.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          next(null);
        });
      },
      function(next) {
        var comment = new Comment({
          refId: self.topic.id,
          content: 'This is a test comment.',
          author: { id: self.user.id }
        });
        comment.validate(function(err) {
          should.not.exist(err);
          next(null);
        });
      }
    ], done);
  });

  it('content can not be repeated', function(done) {
    var self = this;
    async.auto({
      first: function(next) {
        Comment.create({
          refId: self.topic.id,
          content: 'This is a test comment.',
          author: { id: self.user.id }
        }, function(err) {
          next(err);
        });
      },
      second: ['first', function(next) {
        var comment = new Comment({
          refId: self.topic.id,
          content: 'This is a test comment.',
          author: { id: self.user.id }
        });
        comment.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          next(null);
        });
      }],
      third: ['first', function(next) {
        var comment = new Comment({
          refId: self.topic.id,
          content: 'This is another test comment.',
          author: { id: self.user.id }
        });
        comment.validate(function(err) {
          should.not.exist(err);
          next(null);
        });
      }]
    }, done);
  });

  it('invalid author id should throw ValidationError', function(done) {
    var comment = new Comment({
      refId: this.topic.id,
      content: 'This is another test comment.',
      author: { id: '123asdasd' }
    });
    comment.validate(function(err) {
      should.exist(err);
      err.name.should.eql('ValidationError');
      done();
    });
  });

  it('author does not exist should throw ValidationError', function(done) {
    var comment = new Comment({
      refId: this.topic.id,
      content: 'This is another test comment.',
      author: {
        id: '52a486511db59f0a12000004'
      }
    });
    comment.validate(function(err) {
      should.exist(err);
      err.name.should.eql('ValidationError');
      done();
    });
  });
});