/**
 * Module dependencies
 */
var should = require('should'),
  db = require('../db'),
  models = db.models;
var Topic = models.Topic,
  Comment  = models.Comment;
var shared = require('./shared');

describe('Model#Comment', function() {
  beforeEach(shared.createUser);
  beforeEach(shared.createNode);
  beforeEach(shared.createTopic);
  afterEach(shared.removeUsers);
  afterEach(shared.removeNodes);
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

      it('should increase `commentCount` of topic when create new comment', function(done) {
        var commentCountBefore = this.topic.commentCount,
          self = this;
        Comment.create({
          topicId: this.topic.id,
          content: 'this is a comment...',
          author: {
            id: this.user.id
          }
        }, function(err) {
          if (err) {
            return done(err);
          }
          Topic.findById(self.topic.id, function(err, topic) {
            should.exist(topic);
            topic.commentCount.should.eql(commentCountBefore + 1);
            done();
          });
        });
      });

      it('should update `lastCommentUser` of topic when create new comment', function(done) {
        var self = this;
        Comment.create({
          topicId: this.topic.id,
          content: 'this is a comment...',
          author: {
            id: this.user.id
          }
        }, function(err) {
          if (err) {
            return done(err);
          }
          Topic.findById(self.topic.id, function(err, topic) {
            should.exist(topic);
            should.exist(topic.lastCommentUser);
            topic.lastCommentUser.username.should.eql(self.user.username);
            done();
          });
        });
      });
    });
  });
});