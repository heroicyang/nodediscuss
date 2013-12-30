/**
 * test/models/middlewares/user.test.js
 * 对用户模型中间件的逻辑进行测试
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

describe('models/middlewares/user.js', function() {
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

  it('if no nickname then set the default before validate', function(done) {
    var user = new User({
      email: 'foo@bar.com',
      username: 'heroictest',
      password: '12323213'
    });
    user.validate(function(err) {
      if (err) {
        throw err;
      }
      should.exist(user.nickname);
      user.nickname.should.eql(user.username);
      done();
    });
  });

  it('update user\'s topics when updated the nickname', function(done) {
    var self = this;
    async.waterfall([
      function updateUser(next) {
        self.user.nickname = 'Heroic Yang';
        self.user.save(function(err) {
          next(err);
        });
      },
      function getTopic(next) {
        Topic.findById(self.topic.id, function(err, topic) {
          if (err) {
            return next(err);
          }
          should.exist(topic);
          topic.author.nickname.should.eql('Heroic Yang');
          next(null);
        });
      }
    ], done);
  });

  it('update user\'s comments when updated the nickname', function(done) {
    var self = this;
    async.waterfall([
      function updateUser(next) {
        self.user.nickname = 'Heroic';
        self.user.save(function(err) {
          next(err);
        });
      },
      function getComment(next) {
        Comment.findById(self.comment.id, function(err, comment) {
          if (err) {
            return next(err);
          }
          should.exist(comment);
          comment.author.nickname.should.eql('Heroic');
          next(null);
        });
      }
    ], done);
  });
});