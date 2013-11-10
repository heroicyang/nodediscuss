/**
 * Module dependencies
 */
var should = require('should'),
  async = require('async'),
  db = require('../db'),
  models = db.models;
var User = models.User,
  Catalogue = models.Catalogue,
  Topic = models.Topic,
  Comment = models.Comment;
var shared = require('./shared');

describe('Model#Topic', function() {
  beforeEach(shared.createUser);
  beforeEach(shared.createSections);
  beforeEach(shared.createCatalogue);
  beforeEach(shared.createTopic);
  afterEach(shared.removeUsers);
  afterEach(shared.removeSections);
  afterEach(shared.removeCatalogues);
  afterEach(shared.removeTopics);

  describe('Validators', function() {
    describe('topic#title', function() {
      it('length is too short or too long should throw an error', function(done) {
        var titles = ['test', (new Array(100)).join('test')],
          self = this,
          topic;
        async.each(titles, function(title, next) {
          topic = new Topic({
            title: title,
            content: title,
            catalogue: {
              id: self.catalogue.id
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
  });

  describe('Hooks', function() {
    describe('pre/topic.js', function() {
      it('xss sanitize before validation', function(done) {
        var topic = new Topic({
          title: '<script>alert(\'xss\');</script>',
          content: '<p>asdsadsa</p><img src="asd.jpg">',
          catalogue: {
            id: this.catalogue.id
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

      it('validate author id, require a valid author id', function(done) {
        var topic = new Topic({
          title: '<script>alert(\'xss\');</script>',
          content: '<p>asdsadsa</p><img src="asd.jpg">',
          catalogue: {
            id: this.catalogue.id
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
          catalogue: {
            id: this.catalogue.id
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

      it('validate catalogue id, require a valid catalogue id', function(done) {
        var topic = new Topic({
          title: '<script>alert(\'xss\');</script>',
          content: '<p>asdsadsa</p><img src="asd.jpg">',
          catalogue: {
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

      it('validate catalogue id, catalogue must exist', function(done) {
        var topic = new Topic({
          title: '<script>alert(\'xss\');</script>',
          content: '<p>asdsadsa</p><img src="asd.jpg">',
          catalogue: {
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

      it('should increase `topicCount` of author when create new topic', function(done) {
        var topicCountBefore = this.user.topicCount;
        User.findById(this.user.id, function(err, user) {
          should.exist(user);
          user.topicCount.should.eql(topicCountBefore + 1);
          done();
        });
      });

      it('should increase `topicCount` of catalogue when create new topic', function(done) {
        var topicCountBefore = this.catalogue.topicCount;
        Catalogue.findById(this.catalogue.id, function(err, catalogue) {
          should.exist(catalogue);
          catalogue.topicCount.should.eql(topicCountBefore + 1);
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

      it('should decrease `topicCount` of catalogue when remove topic', function(done) {
        var self = this;
        Topic.destroy(this.topic.id, function(err) {
          if (err) {
            return done(err);
          }
          Catalogue.findById(self.catalogue.id, function(err, catalogue) {
            should.exist(catalogue);
            catalogue.topicCount.should.eql(0);
            done();
          });
        });
      });

      it('should remove all comments on this topic', function(done) {
        var self = this;
        async.waterfall([
          function createComments(next) {
            Comment.create([{
              topicId: self.topic.id,
              content: 'comment here...',
              author: {
                id: self.user.id
              }
            }, {
              topicId: self.topic.id,
              content: 'comment here...',
              author: {
                id: self.user.id
              }
            }], function(err) {
              next(err);
            });
          },
          function removeTopic(next) {
            Topic.destroy(self.topic.id, function(err) {
              if (err) {
                return next(err);
              }
              Comment.find({
                topicId: self.topic.id
              }, function(err, comments) {
                if (err) {
                  return next(err);
                }
                comments.should.be.empty;
                comments.should.have.length(0);
                next();
              });
            });
          }
        ], done);
      });
    });
  });

  describe('Methods', function() {
    describe('Topic#edit(topicData, callback)', function() {
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

    describe('Topic#destroy(id, callback)', function() {
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