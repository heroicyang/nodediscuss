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
  beforeEach(shared.createCatalogue);
  beforeEach(shared.createTopic);
  beforeEach(shared.createComment);
  afterEach(shared.removeUsers);
  afterEach(shared.removeSections);
  afterEach(shared.removeCatalogues);
  afterEach(shared.removeTopics);
  afterEach(shared.removeComments);

  describe('Hooks', function() {
    describe('pre/comment.js', function() {
      it('xss sanitize before validation', function(done) {
        var comment = new Comment({
          topicId: this.topic.id,
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

      it('comment can not be repeated', function(done) {
        var comment = new Comment({
          topicId: this.topic.id,
          content: this.comment.content,
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

      it('validate author id, require a valid author id', function(done) {
        var comment = new Comment({
          topicId: this.topic.id,
          content: '<script>alert(\'xss\');</script>',
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

      it('validate author id, author must exist', function(done) {
        var comment = new Comment({
          topicId: this.topic.id,
          content: '<script>alert(\'xss\');</script>',
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

      it('should increase `commentCount` of topic when comment on topic', function(done) {
        Topic.findById(this.topic.id, function(err, topic) {
          should.exist(topic);
          topic.commentCount.should.eql(1);
          done();
        });
      });

      it('should update `lastCommentUser` of topic when comment on topic', function(done) {
        var self = this;
        Topic.findById(this.topic.id, function(err, topic) {
          should.exist(topic);
          should.exist(topic.lastCommentUser);
          topic.lastCommentUser.username.should.eql(self.user.username);
          done();
        });
      });

      it('should increase `commentCount` of page when comment on page', function(done) {
        // TODO
        done();
      });

      it('should notify topic author when comment on topic', function(done) {
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
              topicId: self.topic.id,
              commentId: self.comment.id,
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
              masterId: self.user.id,
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
      
      it('should decrease `commentCount` of topic when delete a topic comment', function(done) {
        var self = this;
        Comment.destroy(this.comment.id, function(err) {
          if (err) {
            return done(err);
          }
          Topic.findById(self.topic.id, function(err, topic) {
            if (err) {
              return done(err);
            }
            topic.commentCount.should.eql(0);
            done();
          });
        });
      });

      it('should decrease `commentCount` of page when delete a page comment', function(done) {
        // TODO
        done();
      });
    });
  });

  describe('Methods', function() {
    describe('Comment#destroy(id, callback)', function() {
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