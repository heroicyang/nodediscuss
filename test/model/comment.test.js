/**
 * Module dependencies
 */
var should = require('should'),
  async = require('async'),
  db = require('../db'),
  models = db.models;
var User = models.User,
  Node = models.Node,
  Topic = models.Topic,
  Comment  = models.Comment;

describe('Model#Comment', function() {
  var user, node, topic;
  beforeEach(function(done) {
    async.parallel([
      function createUser(next) {
        User.create({
          email: 'heroicyang@gmail.com',
          username: 'heroicyang',
          password: '111111'
        }, function(err, u) {
          if (err) {
            return next(err);
          }
          user = u;
          next();
        });
      },
      function createNode(next) {
        Node.create({
          name: 'Express',
          category: 'Node.js'
        }, function(err, n) {
          if (err) {
            return next(err);
          }
          node = n;
          next();
        });
      }
    ], done);
  });

  beforeEach(function(done) {
    Topic.create({
      title: 'this is a test topic...',
      content: 'this is a test topic...',
      author: {
        id: user.id
      },
      node: {
        id: node.id
      }
    }, function(err, t) {
      if (err) {
        return done(err);
      }
      topic = t;
      done();
    });
  });

  afterEach(function(done) {
    async.parallel([
      function removeUser(next) {
        User.remove(next);
      },
      function removeNode(next) {
        Node.remove(next);
      },
      function removeTopic(next) {
        Topic.remove(next);
      },
      function removeComment(next) {
        Comment.remove(next);
      }
    ], done);
  });

  describe('Hooks', function() {
    describe('pre/comment.js', function() {
      it('xss sanitize before validation', function(done) {
        var comment = new Comment({
          topicId: topic.id,
          content: '<script>alert(\'xss\');</script>',
          author: {
            id: user.id
          }
        });
        comment.validate(function() {
          comment.content.should.eql('[removed]alert&#40;\'xss\'&#41;;[removed]');
          done();
        });
      });

      it('validate author id, require a valid author id', function(done) {
        var comment = new Comment({
          topicId: topic.id,
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
          topicId: topic.id,
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
    });
  });
});