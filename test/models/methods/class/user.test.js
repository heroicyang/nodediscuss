/**
 * test/models/methods/class/user.test.js
 * 测试 User 的类方法
 * @author heroic
 */

/**
* Module dependencies
*/
var async = require('async'),
  _ = require('lodash'),
  should = require('should');
var models = require('../../../db').models;
var User = models.User,
  Section = models.Section,
  Tag = models.Tag,
  Topic = models.Topic;
var data = require('../../../fixtures/data.json');

describe('models/methods/class/user.js', function() {
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
    Topic.create(topics, function(err, topic) {
      if (err) {
        throw err;
      }
      self.topic = topic;
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

  it('User.query(options, callback): query users', function(done) {
    User.query({}, function(err, count, users) {
      if (err) {
        throw err;
      }
      count.should.be.a.Number;
      users.should.be.an.Array;
      count.should.eql(users.length);
      count.should.be.above(0);
      done();
    });
  });

  it('User.add(userData, callback): add new user', function(done) {
    User.add(data.users[1], function(err, user) {
      if (err) {
        throw err;
      }
      should.exist(user);
      user.email.should.eql(data.users[1].email);
      done();
    });
  });

  it('User.edit(userData, callback): edit user data', function(done) {
    var self = this;
    async.parallel([
      function(next) {
        self.user.nickname = 'Heroic';
        User.edit(self.user, function(err, user) {
          if (err) {
            return next(err);
          }
          should.exist(user);
          user.nickname.should.eql('Heroic');
          next(null);
        });
      },
      function(next) {
        var user = { id: self.user.id };
        User.edit(user, function(err, user) {
          if (err) {
            return next(err);
          }
          should.exist(user);
          next(null);
        });
      }
    ], done);
  });

  it('User.get(conditions, callback): find one user', function(done) {
    var self = this;
    User.get({
      username: this.user.username
    }, function(err, user) {
      if (err) {
        throw err;
      }
      should.exist(user);
      user.id.should.eql(self.user.id);
      done();
    });
  });

  it('User.getCount(conditions, callback): get user count', function(done) {
    User.getCount({}, function(err, count) {
      if (err) {
        throw err;
      }
      count.should.be.a.Number;
      count.should.be.above(0);
      done();
    });
  });

  it('User.isExist(conditions, callback): check the user exists', function(done) {
    var self = this;
    async.parallel([
      function(next) {
        User.isExist({
          username: self.user.username
        }, function(err, exists) {
          if (err) {
            return next(err);
          }
          exists.should.be.ok;
          next(null);
        });
      },
      function(next) {
        User.isExist({
          email: 'foo@bar.com'
        }, function(err, exists) {
          if (err) {
            return next(err);
          }
          exists.should.not.be.ok;
          next(null);
        });
      }
    ], done);
  });

  it('User.check(userData, callback): check email and password are correct', function(done) {
    var self = this;
    async.parallel([
      function(next) {
        User.check({
          email: self.user.email,
          password: '111111'
        }, function(err, result) {
          if (err) { return next(err); }
          should.exist(result);
          should.exist(result.user);
          result.passed.should.be.ok;
          next(null);
        });
      },
      function(next) {
        User.check({
          email: self.user.email,
          password: '123456'
        }, function(err, result) {
          if (err) { return next(err); }
          should.exist(result);
          should.exist(result.user);
          result.passed.should.not.be.ok;
          next(null);
        });
      },
      function(next) {
        User.check({
          email: 'foo@bar.com',
          password: '111111'
        }, function(err, result) {
          if (err) { return next(err); }
          should.not.exist(result);
          next(null);
        });
      }
    ], done);
  });

  it('User.changeState(options, callback): change the user\'s state', function(done) {
    var self = this;
    User.changeState({
      id: this.user.id,
      state: models.constants.USER_STATE.ACTIVATED
    }, function(err, user) {
      if (err) {
        throw err;
      }
      should.exist(user);
      user.state.should.eql(models.constants.USER_STATE.ACTIVATED);
      user.state.should.not.eql(self.user.state);
      done();
    });
  });

  it('User.setVerified(options, callback): set the user\'s verified', function(done) {
    var self = this;
    User.setVerified({
      id: self.user.id,
      verified: true
    }, function(err, user) {
      if (err) {
        throw err;
      }
      should.exist(user);
      user.verified.should.be.ok;
      self.user.verified.should.not.eql(user.verified);
      done();
    });
  });

  it('User.favoriteTopic(options, callback): favorite a topic', function(done) {
    var self = this;
    async.auto({
      favorite: function(next) {
        User.favoriteTopic({
          id: self.topic.id,
          userId: self.user.id
        }, next);
      },
      checkTopic: ['favorite', function(next) {
        Topic.findById(self.topic.id, function(err, topic) {
          if (err) { return next(err); }
          topic.favoriteUsers.should.contain(self.user.id);
          next(null);
        });
      }],
      checkUser: ['favorite', function(next) {
        User.findById(self.user.id, function(err, user) {
          if (err) { return next(err); }
          user.favoriteTopicCount.should.eql(self.user.favoriteTopicCount + 1);
          next(null);
        });
      }]
    }, done);
  });

  it('User.unfavoriteTopic(options, callback): unfavorite a topic', function(done) {
    var self = this;
    async.auto({
      unfavorite: function(next) {
        User.unfavoriteTopic({
          id: self.topic.id,
          userId: self.user.id
        }, next);
      },
      checkTopic: ['unfavorite', function(next) {
        Topic.findById(self.topic.id, function(err, topic) {
          if (err) { return next(err); }
          topic.favoriteUsers.should.not.contain(self.user.id);
          next(null);
        });
      }],
      checkUser: ['unfavorite', function(next) {
        User.findById(self.user.id, function(err, user) {
          if (err) { return next(err); }
          user.favoriteTopicCount.should.eql(self.user.favoriteTopicCount);
          next(null);
        });
      }]
    }, done);
  });

  it('User.favoriteTag(options, callback): favorite a tag', function(done) {
    var self = this;
    async.auto({
      favorite: function(next) {
        User.favoriteTag({
          slug: self.tag.slug,
          userId: self.user.id
        }, next);
      },
      checkTag: ['favorite', function(next) {
        Tag.findById(self.tag.id, function(err, tag) {
          if (err) { return next(err); }
          tag.favoriteUsers.should.contain(self.user.id);
          next(null);
        });
      }],
      checkUser: ['favorite', function(next) {
        User.findById(self.user.id, function(err, user) {
          if (err) { return next(err); }
          user.favoriteTagCount.should.eql(self.user.favoriteTagCount + 1);
          next(null);
        });
      }]
    }, done);
  });

  it('User.unfavoriteTag(options, callback): unfavorite a tag', function(done) {
    var self = this;
    async.auto({
      unfavorite: function(next) {
        User.unfavoriteTag({
          slug: self.tag.slug,
          userId: self.user.id
        }, next);
      },
      checkTag: ['unfavorite', function(next) {
        Tag.findById(self.tag.id, function(err, tag) {
          if (err) { return next(err); }
          tag.favoriteUsers.should.not.contain(self.user.id);
          next(null);
        });
      }],
      checkUser: ['unfavorite', function(next) {
        User.findById(self.user.id, function(err, user) {
          if (err) { return next(err); }
          user.favoriteTagCount.should.eql(self.user.favoriteTagCount);
          next(null);
        });
      }]
    }, done);
  });
});