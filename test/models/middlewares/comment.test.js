/**
 * test/models/middlewares/comment.test.js
 * 对评论数据模型的中间件逻辑进行测试
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
  Page = models.Page,
  Comment = models.Comment,
  Notification = models.Notification;
var data = require('../../fixtures/data.json');

describe('models/middlewares/comment.js', function() {
  before(function createUsers(done) {
    var self = this;
    User.create(data.users, function(err, user, user1) {
      if (err) {
        throw err;
      }
      self.user = user;
      self.user1 = user1;
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

  before(function createPages(done) {
    var self = this;
    var pages = _.map(data.pages, function(page) {
      page.contributors = [self.user.id];
      return page;
    });

    Page.create(pages, function(err, page) {
      if (err) {
        throw err;
      }
      self.page = page;
      done();
    });
  });

  before(function createComments(done) {
    var self = this;
    _.extend(data.comments[0], {
      author: { id: self.user1.id },
      refId: self.topic.id
    });
    _.extend(data.comments[1], {
      author: { id: self.user1.id },
      refId: self.page.id,
      onPage: true
    });
    // 为了测试话题作者自己发表评论时不会给他发送提醒
    data.comments[2] = _.extend({}, data.comments[1], {
      author: { id: self.user.id },
      refId: self.topic.id
    });

    Comment.create(data.comments, function(err, comment, comment1, comment2) {
      if (err) {
        throw err;
      }
      self.commentTopic = comment;
      self.commentPage = comment1;
      self.commentByAuthor = comment2;
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
    Page.remove(done);
  });

  after(function(done) {
    Comment.remove(done);
  });

  after(function(done) {
    Notification.remove(done);
  });

  it('comment a topic should update the commentCount and lastCommentUser', function(done) {
    var self = this;
    Topic.findById(this.topic.id, function(err, topic) {
      if (err) {
        throw err;
      }
      topic.commentCount.should.eql(self.topic.commentCount + 1);
      should.not.exist(self.topic.lastCommentUser.username);
      should.exist(topic.lastCommentUser.username);
      done();
    });
  });

  it('comment a page should update the commentCount', function(done) {
    var self = this;
    Page.findById(this.page.id, function(err, page) {
      if (err) {
        throw err;
      }
      page.commentCount.should.eql(self.page.commentCount + 1);
      done();
    });
  });

  it('set topic\'s or page\'s commentCount as comment floor when create', function(done) {
    var self = this;
    async.parallel([
      function commentTopic(next) {
        Topic.findById(self.topic.id, function(err, topic) {
          if (err) {
            return next(err);
          }
          self.commentTopic.floor.should.eql(topic.commentCount);
          next(null);
        });
      },
      function commentPage(next) {
        Page.findById(self.page.id, function(err, page) {
          if (err) {
            return next(err);
          }
          self.commentPage.floor.should.eql(page.commentCount);
          next(null);
        });
      }
    ], done);
  });

  it('send notification to the topic author when someone comment a topic', function(done) {
    Notification.findOne({
      masterId: this.topic.author.id,
      userId: this.commentTopic.author.id,
      topicId: this.topic.id,
      commentId: this.commentTopic.id
    }, function(err, notification) {
      if (err) {
        throw err;
      }
      should.exist(notification);
      done();
    });
  });

  it('don\'t send notification when author comment the topic', function(done) {
    Notification.findOne({
      masterId: this.topic.author.id,
      userId: this.commentByAuthor.author.id,
      topicId: this.topic.id,
      commentId: this.commentByAuthor.id
    }, function(err, notification) {
      if (err) {
        throw err;
      }
      should.not.exist(notification);
      done();
    });
  });

  it('send notification to the comment author when someone reply a comment', function(done) {
    var self = this;
    var masterComment = this.commentTopic;
    async.waterfall([
      function replyComment(next) {
        Comment.create({
          refId: self.topic.id,
          content: 'reply test...',
          author: { id: self.user.id },
          commentIds: [masterComment.id]
        }, next);
      },
      function check(replyComment, next) {
        Notification.findOne({
          masterId: masterComment.author.id,
          userId: replyComment.author.id,
          topicId: self.topic.id,
          masterCommentId: masterComment.id,
          commentId: replyComment.id
        }, function(err, notification) {
          if (err) {
            return next(err);
          }
          should.exist(notification);
          next();
        });
      }
    ], done);
  });

  it('don\'t send notification when comment author reply the comment', function(done) {
    var self = this;
    var masterComment = this.commentTopic;
    async.waterfall([
      function replyComment(next) {
        Comment.create({
          refId: self.topic.id,
          content: 'reply test...',
          author: { id: self.user1.id },
          commentIds: [masterComment.id]
        }, next);
      },
      function check(replyComment, next) {
        Notification.findOne({
          masterId: masterComment.author.id,
          userId: replyComment.author.id,
          topicId: self.topic.id,
          masterCommentId: masterComment.id,
          commentId: replyComment.id
        }, function(err, notification) {
          if (err) {
            return next(err);
          }
          should.not.exist(notification);
          next();
        });
      }
    ], done);
  });
});