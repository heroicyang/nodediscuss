/**
 * Module dependencies
 */
var should = require('should'),
  async = require('async'),
  db = require('../db'),
  models = db.models;
var User = models.User;

describe('Model#User', function() {
  beforeEach(function(done) {
    User.remove(done);
  });

  describe('Validators', function() {
    describe('user#email', function() {
      it('email required', function(done) {
        var user = new User({
          email: '',
          username: 'heroic',
          password: '111111'
        });
        user.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });

      it('invalid email should throw an error', function(done) {
        var user = new User({
          email: 'heroic@email',
          username: 'heroic',
          password: '111111'
        });
        user.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });

      it('email is unique', function(done) {
        async.waterfall([
          function createUser(next) {
            var user = new User({
              email: 'me@heroicyang.com',
              username: 'heroic',
              password: '111111'
            });
            user.save(function(err) {
              next(err);
            });
          },
          function createAnother(next) {
            var user = new User({
              email: 'me@heroicyang.com',
              username: 'heroicyang',
              password: '111111'
            });
            user.save(function(err) {
              should.exist(err);
              err.name.should.eql('ValidationError');
              next(null);
            });
          }
        ], done);
      });
    });

    describe('user#username', function() {
      it('username required', function(done) {
        var user = new User({
          email: 'me@heroicyang.com',
          username: '',
          password: '111111'
        });
        user.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });

      it('non-alphanumeric username shoud throw an error', function(done) {
        var user = new User({
          email: 'me@heroicyang.com',
          username: 'heroic*=&^',
          password: '111111'
        });
        user.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });

      it('length is too short or too long should throw an error', function(done) {
        var usernames = ['hero', 'heroicyang1234567'],
          user;
        async.each(usernames, function(username, next) {
          user = new User({
            email: 'me@heroicyang.com',
            username: username,
            password: '111111'
          });
          user.validate(function(err) {
            should.exist(err);
            err.name.should.eql('ValidationError');
            next(null);
          });
        }, done);
      });

      it('username is unique', function(done) {
        async.waterfall([
          function createUser(next) {
            var user = new User({
              email: 'me@heroicyang.com',
              username: 'heroic',
              password: '111111'
            });
            user.save(function(err) {
              next(err);
            });
          },
          function createAnother(next) {
            var user = new User({
              email: 'heroicyang@gmail.com',
              username: 'heroic',
              password: '111111'
            });
            user.save(function(err) {
              should.exist(err);
              err.name.should.eql('ValidationError');
              next(null);
            });
          }
        ], done);
      });
    });

    describe('user#password', function() {
      it('length is too short or too long should throw an error', function(done) {
        var passwords = ['hero', 'heroicyang1234567heroicyang1234567'],
          user;
        async.each(passwords, function(password, next) {
          user = new User({
            email: 'me@heroicyang.com',
            username: 'heroic',
            password: password
          });
          user.validate(function(err) {
            should.exist(err);
            err.name.should.eql('ValidationError');
            next(null);
          });
        }, done);
      });
    });

    describe('user#website', function() {
      it('invalid website should throw an error', function(done) {
        var user = new User({
          email: 'me@heroicyang.com',
          username: 'heroic',
          password: '111111',
          website: 'asdasdsadasdasd'
        });
        user.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });
    });
  });

  describe('Hooks', function() {
    describe('pre/user.js', function() {
      it('processing user data before validation', function(done) {
        var user = new User({
          email: 'me@heroicyang.com',
          username: 'heroic',
          password: '111111',
          tagline: '<script>alert(\'xss\');</script>'
        });
        user.validate(function() {
          user.nickname.should.eql(user.username);
          user.tagline.should.eql('[removed]alert&#40;\'xss\'&#41;;[removed]');
          done();
        });
      });
    });
  });

  describe('Methods', function() {
    describe('user#authenticate(plainText)', function() {
      it('correct password should return true', function(done) {
        var user = new User({
          email: 'me@heroicyang.com',
          username: 'heroic',
          password: '111111'
        });
        var success = user.authenticate('111111'),
          failure = user.authenticate('123');
        success.should.be.true;
        failure.should.be.false;
        done();
      });
    });

    describe('User#findOneByUsername(username, callback)', function() {
      beforeEach(function(done) {
        var user = new User({
          email: 'me@heroicyang.com',
          username: 'heroic',
          password: '111111'
        });
        user.save(done);
      });

      it('should return the user if the username matches', function(done) {
        User.findOneByUsername('heroic', function (err, user) {
          should.exist(user);
          user.username.should.eql('heroic');
          done();
        });
      });

      it('should return null if the username does not match', function(done) {
        User.findOneByUsername('heroicyang', function (err, user) {
          should.not.exist(user);
          done();
        });
      });
    });

    describe('User#findOneByEmail(email, callback)', function() {
      beforeEach(function(done) {
        var user = new User({
          email: 'me@heroicyang.com',
          username: 'heroic',
          password: '111111'
        });
        user.save(done);
      });

      it('should return the user if the email matches', function(done) {
        User.findOneByEmail('me@heroicyang.com', function (err, user) {
          should.exist(user);
          user.username.should.eql('heroic');
          user.email.should.eql('me@heroicyang.com');
          done();
        });
      });

      it('should return null if the email does not match', function(done) {
        User.findOneByEmail('heroicyang@gmail.com', function (err, user) {
          should.not.exist(user);
          done();
        });
      });
    });

    describe('User#check(userData, callback)', function() {
      beforeEach(function(done) {
        User.create({
          email: 'me@heroicyang.com',
          username: 'heroic',
          password: '111111'
        }, done);
      });

      it('should return null when the user does not exist', function(done) {
        User.check({
          username: 'heroicyang',
          password: '111111'
        }, function(err, user, status) {
          should.not.exist(user);
          (status === undefined).should.be.true;
          done();
        });
      });

      it('should return true when the user matches', function(done) {
        User.check({
          username: 'heroic',
          password: '111111'
        }, function(err, user, status) {
          should.exist(user);
          status.should.be.true;
          done();
        });
      });

      it('should return false when the user does not match', function(done) {
        User.check({
          username: 'heroic',
          password: '123456'
        }, function(err, user, status) {
          should.exist(user);
          status.should.be.false;
          done();
        });
      });
    });

    describe('User#activate(userData, callback)', function() {
      it('activate the user', function(done) {
        async.waterfall([
          function createUser(next) {
            User.create({
              email: 'me@heroicyang.com',
              username: 'heroic',
              password: '111111'
            }, function(err) {
              next(err);
            });
          },
          function activateUser(next) {
            User.activate({
              username: 'heroic'  // or { email: 'me@heroicyang.com' }
            }, function(err) {
              next(err);
            });
          },
          function getUserState(next) {
            User.findOneByUsername('heroic', function(err, user) {
              should.exist(user);
              user.state.activated.should.be.true;
              next(null);
            });
          }
        ], done);
      });
    });
  });
});