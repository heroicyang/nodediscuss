/**
 * Module dependencies
 */
var should = require('should'),
  async = require('async'),
  db = require('../db'),
  models = db.models;
var User = models.User,
  Node = models.Node,
  Topic = models.Topic;

describe('Model#Topic', function() {
  var user, node;
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
      }
    ], done);
  });

  describe('Validators', function() {
    describe('topic#title', function() {
      it('length is too short or too long should throw an error', function(done) {
        var titles = ['test', (new Array(100)).join('test')],
          topic;
        async.each(titles, function(title, next) {
          topic = new Topic({
            title: title,
            content: title,
            node: {
              id: node.id
            },
            author: {
              id: user.id
            }
          });
          topic.validate(function(err) {
            should.exist(err);
            next();
          });
        }, done);
      });
    });
  });

  describe('Hooks', function() {
    describe('pre/topic.js', function() {
      var topicId;
      beforeEach(function(done) {
        Topic.create({
          title: '<script>alert(\'xss\');</script>',
          content: '<p>asdsadsa</p><img src="asd.jpg">',
          node: {
            id: node.id
          },
          author: {
            id: user.id
          }
        }, function(err, topic) {
          if (err) {
            throw err;
          }
          topicId = topic.id;
          done();
        });
      });

      it('xss sanitize before validation', function(done) {
        var topic = new Topic({
          title: '<script>alert(\'xss\');</script>',
          content: '<p>asdsadsa</p><img src="asd.jpg">',
          node: {
            id: node.id
          },
          author: {
            id: user.id
          }
        });
        topic.validate(function() {
          topic.title.should.eql('[removed]alert&#40;\'xss\'&#41;;[removed]');
          done();
        });
      });

      it('validate author id, require a valid author id', function(done) {
        var topic = new Topic({
          title: '<script>alert(\'xss\');</script>',
          content: '<p>asdsadsa</p><img src="asd.jpg">',
          node: {
            id: node.id
          },
          author: {
            id: '1234'
          }
        });
        topic.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });

      it('validate author id, author must exist', function(done) {
        var topic = new Topic({
          title: '<script>alert(\'xss\');</script>',
          content: '<p>asdsadsa</p><img src="asd.jpg">',
          node: {
            id: node.id
          },
          author: {
            id: '123456789012345678901234'
          }
        });
        topic.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });

      it('validate node id, require a valid node id', function(done) {
        var topic = new Topic({
          title: '<script>alert(\'xss\');</script>',
          content: '<p>asdsadsa</p><img src="asd.jpg">',
          node: {
            id: '1234'
          },
          author: {
            id: user.id
          }
        });
        topic.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });

      it('validate node id, node must exist', function(done) {
        var topic = new Topic({
          title: '<script>alert(\'xss\');</script>',
          content: '<p>asdsadsa</p><img src="asd.jpg">',
          node: {
            id: '123456789012345678901234'
          },
          author: {
            id: user.id
          }
        });
        topic.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });

      it('should increase `topicCount` of author when create new topic', function(done) {
        var topicCountBefore = user.topicCount;
        User.findById(user.id, function(err, user) {
          should.exist(user);
          user.topicCount.should.eql(topicCountBefore + 1);
          done();
        });
      });

      it('should increase `topicCount` of node when create new topic', function(done) {
        var topicCountBefore = node.topicCount;
        Node.findById(node.id, function(err, node) {
          should.exist(node);
          node.topicCount.should.eql(topicCountBefore + 1);
          done();
        });
      });

      it('should decrease `topicCount` of author when remove topic', function(done) {
        Topic.destroy(topicId, function(err) {
          if (err) {
            return done(err);
          }
          User.findById(user.id, function(err, user) {
            should.exist(user);
            user.topicCount.should.eql(0);
            done();
          });
        });
      });

      it('should decrease `topicCount` of node when remove topic', function(done) {
        Topic.destroy(topicId, function(err) {
          if (err) {
            return done(err);
          }
          Node.findById(node.id, function(err, node) {
            should.exist(node);
            node.topicCount.should.eql(0);
            done();
          });
        });
      });
    });
  });

  describe('Methods', function() {
    var topicId;
    beforeEach(function(done) {
      Topic.create({
        title: 'this is a test topic...',
        content: 'this is a test topic...',
        node: {
          id: node.id
        },
        author: {
          id: user.id
        }
      }, function(err, topic) {
        if (err) {
          throw err;
        }
        topicId = topic.id;
        done();
      });
    });
    describe('Topic#edit(topicData, callback)', function() {
      it('edit topic', function(done) {
        Topic.edit({
          id: topicId,
          title: 'topic title has been modified...'
        }, function(err, topic) {
          should.exist(topic);
          topic.title.should.eql('topic title has been modified...');
          done();
        });
      });
    });

    describe('Topic#destroy(topicId, callback)', function() {
      it('topic removed', function(done) {
        Topic.destroy(topicId, function(err) {
          if (err) {
            return done(err);
          }
          
          Topic.findById(topicId, function(err, topic) {
            should.not.exist(topic);
            done();
          });
        });
      });
    });
  });
});