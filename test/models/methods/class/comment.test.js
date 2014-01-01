/**
 * test/models/methods/class/comment.test.js
 * 测试 Comment 的类方法
 * @author heroic
 */

/**
* Module dependencies
*/
var _ = require('lodash'),
  should = require('should');
var models = require('../../../db').models;
var User = models.User,
  Section = models.Section,
  Tag = models.Tag,
  Topic = models.Topic,
  Comment = models.Comment;
var data = require('../../../fixtures/data.json');

describe('models/methods/class/comment.js', function() {
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

  before(function createComments(done) {
    var self = this;
    var comments = _.map(data.comments, function(comment) {
      _.extend(comment, {
        author: { id: self.user.id },
        refId: self.topic.id
      });
      return comment;
    });

    Comment.create(comments, function(err, comment, comment1) {
      if (err) {
        throw err;
      }
      self.comment = comment;
      self.comment1 = comment1;
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

  it('Comment.query(options, callback): query comments', function(done) {
    Comment.query({
      refId: this.topic.id
    }, function(err, count, comments) {
      if (err) {
        throw err;
      }
      count.should.be.a.Number;
      comments.should.be.an.Array;
      count.should.eql(comments.length);
      count.should.be.above(0);
      done();
    });
  });

  it('Comment.add(commentData, callback): add new comment', function(done) {
    Comment.add({
      refId: this.topic.id,
      content: '#1楼 @heroic this is a test comment..',
      author: { id: this.user.id }
    }, function(err, comment) {
      if (err) {
        throw err;
      }
      should.exist(comment);
      done();
    });
  });

  it('Comment.get(conditions, callback): find one comment', function(done) {
    var self = this;
    Comment.get({
      _id: this.comment.id
    }, function(err, comment) {
      if (err) {
        throw err;
      }
      should.exist(comment);
      comment.id.should.eql(self.comment.id);
      done();
    });
  });

  it('Comment.getCount(conditions, callback): get comment count', function(done) {
    Comment.getCount({}, function(err, count) {
      if (err) {
        throw err;
      }
      count.should.be.a.Number;
      count.should.be.above(0);
      done();
    });
  });

  it('Comment.destroy(conditions, callback): remove a comment', function(done) {
    Comment.destroy({
      _id: this.comment1.id
    }, function(err, comment) {
      if (err) {
        throw err;
      }
      Comment.findById(comment.id, function(err, comment) {
        if (err) {
          throw err;
        }
        should.exist(comment);
        comment.deleted.should.be.ok;
        done();
      });
    });
  });
});