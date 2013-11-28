/**
 * Module dependencies
 */
var should = require('should'),
  async = require('async'),
  db = require('../db'),
  models = db.models;
var User = models.User,
  Tag = models.Tag,
  Topic = models.Topic,
  Comment = models.Comment;
var shared = require('./shared');

describe('Model#Topic', function() {
  beforeEach(shared.createUser);
  beforeEach(shared.createSections);
  beforeEach(shared.createTag);
  beforeEach(shared.createTopic);
  afterEach(shared.removeUsers);
  afterEach(shared.removeSections);
  afterEach(shared.removeTags);
  afterEach(shared.removeTopics);

  describe('Validators', function() {
    describe('Topic#title', function() {
      it('title is required', function(done) {
        var topic = new Topic({
          content: 'this is a test topic...',
          tag: {
            id: this.tag.id
          },
          author: {
            id: this.user.id
          }
        });
        topic.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });

      it('length is too short or too long should throw an error', function(done) {
        var titles = ['test', (new Array(100)).join('test')],
          self = this,
          topic;
        async.each(titles, function(title, next) {
          topic = new Topic({
            title: title,
            content: title,
            tag: {
              id: self.tag.id
            },
            author: {
              id: self.user.id
            }
          });
          topic.validate(function(err) {
            should.exist(err);
            next();
          });
        }, done);
      });
    });

    describe('Topic#tag.id', function() {
      it('`tag.id` is required', function(done) {
        var topic = new Topic({
          title: 'this is a test topic...',
          content: 'this is a test topic...',
          author: {
            id: this.user.id
          }
        });
        topic.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });

      it('`tag.id` must be a Mongoose.Schema.ObjectId value to string', function(done) {
        var topic = new Topic({
          title: 'this is a test topic...',
          content: 'this is a test topic...',
          tag: {
            id: '1234'
          },
          author: {
            id: this.user.id
          }
        });
        topic.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });

      it('`tag.id` record must exist in the database', function(done) {
        var topic = new Topic({
          title: 'this is a test topic...',
          content: 'this is a test topic...',
          tag: {
            id: '123456789012345678901234'
          },
          author: {
            id: this.user.id
          }
        });
        topic.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });
    });

    describe('Topic#author.id', function() {
      it('`author.id` is required', function(done) {
        var topic = new Topic({
          title: 'this is a test topic...',
          content: 'this is a test topic...',
          tag: {
            id: this.tag.id
          }
        });
        topic.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });

      it('`author.id` must be a Mongoose.Schema.ObjectId value to string', function(done) {
        var topic = new Topic({
          title: 'this is a test topic...',
          content: 'this is a test topic...',
          tag: {
            id: this.tag.id
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

      it('`author.id` record must exist in the database', function(done) {
        var topic = new Topic({
          title: 'this is a test topic...',
          content: 'this is a test topic...',
          tag: {
            id: this.tag.id
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
    });
  });

  describe('Hooks', function() {
    describe('pre/topic.js', function() {
      it('xss sanitize before validation', function(done) {
        var topic = new Topic({
          title: '<script>alert(\'xss\');</script>',
          content: '<p>asdsadsa</p><img src="asd.jpg">',
          tag: {
            id: this.tag.id
          },
          author: {
            id: this.user.id
          }
        });
        topic.validate(function() {
          topic.title.should.eql('[removed]alert&#40;\'xss\'&#41;;[removed]');
          done();
        });
      });

      it('should increase `topicCount` of author when create new topic', function(done) {
        var topicCountBefore = this.user.topicCount;
        User.findById(this.user.id, function(err, user) {
          should.exist(user);
          user.topicCount.should.eql(topicCountBefore + 1);
          done();
        });
      });

      it('should increase `topicCount` of tag when create new topic', function(done) {
        var topicCountBefore = this.tag.topicCount;
        Tag.findById(this.tag.id, function(err, tag) {
          should.exist(tag);
          tag.topicCount.should.eql(topicCountBefore + 1);
          done();
        });
      });

      it('should decrease `topicCount` of author when remove topic', function(done) {
        var self = this;
        Topic.destroy(this.topic.id, function(err) {
          if (err) {
            return done(err);
          }
          User.findById(self.user.id, function(err, user) {
            should.exist(user);
            user.topicCount.should.eql(0);
            done();
          });
        });
      });

      it('should decrease `topicCount` of tag when remove topic', function(done) {
        var self = this;
        Topic.destroy(this.topic.id, function(err) {
          if (err) {
            return done(err);
          }
          Tag.findById(self.tag.id, function(err, tag) {
            should.exist(tag);
            tag.topicCount.should.eql(0);
            done();
          });
        });
      });
    });
  });

  describe('Methods', function() {
    describe('Topic.edit(topicData, callback)', function() {
      it('edit topic', function(done) {
        Topic.edit({
          id: this.topic.id,
          title: 'topic title has been modified...'
        }, function(err, topic) {
          should.exist(topic);
          topic.title.should.eql('topic title has been modified...');
          done();
        });
      });
    });

    describe('Topic.destroy(id, callback)', function() {
      it('topic removed', function(done) {
        var self = this;
        Topic.destroy(this.topic.id, function(err) {
          if (err) {
            return done(err);
          }
          
          Topic.findById(self.topic.id, function(err, topic) {
            should.not.exist(topic);
            done();
          });
        });
      });
    });
  });
});