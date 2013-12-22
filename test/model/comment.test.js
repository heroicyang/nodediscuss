/**
 * Module dependencies
 */
var should = require('should'),
  async = require('async'),
  db = require('../db'),
  models = db.models;
var Topic = models.Topic,
  Comment  = models.Comment,
  Notification = models.Notification;
var shared = require('./shared');

describe('Model#Comment', function() {
  beforeEach(shared.createUser);
  beforeEach(shared.createSections);
  beforeEach(shared.createTag);
  beforeEach(shared.createTopic);
  beforeEach(shared.createComment);
  afterEach(shared.removeUsers);
  afterEach(shared.removeSections);
  afterEach(shared.removeTags);
  afterEach(shared.removeTopics);
  afterEach(shared.removeComments);
  afterEach(shared.removeNotifications);

  describe('Validators', function() {
    describe('Comment#refId', function() {
      it('refId is required', function(done) {
        var comment = new Comment({
          content: 'this is a test comment...',
          author: {
            id: this.user.id
          }
        });
        comment.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });

      it('refId must be a valid `ObjectId` string', function(done) {
        var comment = new Comment({
          refId: '1234',
          content: 'this is a test comment...',
          author: {
            id: this.user.id
          }
        });
        comment.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });
    });

    describe('Comment#content', function() {
      it('content is required', function(done) {
        var comment = new Comment({
          refId: this.topic.id,
          author: {
            id: this.user.id
          }
        });
        comment.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });

      it('content can not be repeated', function(done) {
        var comment = new Comment({
          refId: this.topic.id,
          content: this.comment.content,
          author: {
            id: this.anotherUser.id
          }
        });
        comment.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });
    });

    describe('Comment#author.id', function() {
      it('`author.id` is required', function(done) {
        var comment = new Comment({
          refId: this.topic.id,
          content: 'this is a test comment...'
        });
        comment.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });

      it('`author.id` must be a valid `ObjectId` string', function(done) {
        var comment = new Comment({
          refId: this.topic.id,
          content: 'this is a test comment...',
          author: {
            id: '1234'
          }
        });
        comment.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });

      it('`author.id` record must exist in the database', function(done) {
        var comment = new Comment({
          refId: this.topic.id,
          content: 'this is a test comment...',
          author: {
            id: '123456789012345678901234'
          }
        });
        comment.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });
    });
  });

  describe('middlewares', function() {
    it('xss sanitize before validation', function(done) {
      var comment = new Comment({
        refId: this.topic.id,
        content: '<script>alert(\'xss\');</script>',
        author: {
          id: this.user.id
        }
      });
      comment.validate(function() {
        comment.content.should.eql('[removed]alert&#40;\'xss\'&#41;;[removed]');
        done();
      });
    });

    it('comment floor should equals the `commentCount` of topic', function(done) {
      var self = this;
      Topic.findById(this.topic.id, function(err, topic) {
        should.exist(topic);
        self.comment.floor.should.eql(topic.commentCount);
        done();
      });
    });

    it('should increase `commentCount` of topic when create', function(done) {
      Topic.findById(this.topic.id, function(err, topic) {
        should.exist(topic);
        topic.commentCount.should.eql(1);
        done();
      });
    });

    it('should update `lastCommentUser` of topic when create', function(done) {
      var self = this;
      Topic.findById(this.topic.id, function(err, topic) {
        should.exist(topic);
        should.exist(topic.lastCommentUser);
        topic.lastCommentUser.username.should.eql(self.anotherUser.username);
        topic.lastCommentedAt.should.eql(self.comment.createdAt);
        done();
      });
    });

    it('should notify topic author when create comment', function(done) {
      Notification.findOne({
        masterId: this.user.id,
        topicId: this.topic.id
      }, function(err, notification) {
        if (err) {
          return done(err);
        }
        should.exist(notification);
        done();
      });
    });

    it('should notify comment author when reply comment', function(done) {
      var self = this;
      async.waterfall([
        function replyComment(next) {
          Comment.create({
            refId: self.topic.id,
            commentIds: [self.comment.id],
            content: 'this is a reply comment...',
            author: {
              id: self.user.id
            }
          }, function(err) {
            next(err);
          });
        },
        function findNotification(next) {
          Notification.findOne({
            masterId: self.anotherUser.id,
            masterCommentId: self.comment.id
          }, function(err, notification) {
            if (err) {
              return next(err);
            }
            should.exist(notification);
            done();
          });
        }
      ], done);
    });
  });

  describe('Methods', function() {
    describe('Comment.destroy(id, callback)', function() {
      it('delete a comment, but only marked for deletion', function(done) {
        var self = this;
        Comment.destroy(this.comment.id, function(err) {
          if (err) {
            return done(err);
          }
          Comment.findById(self.comment.id, function(err, comment) {
            if (err) {
              return done(err);
            }
            should.exist(comment);
            comment.deleted.should.be.true;
            done();
          });
        });
      });
    });
  });
});