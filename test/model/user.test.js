/**
 * Module dependencies
 */
var should = require('should'),
  async = require('async'),
  db = require('../db'),
  models = db.models;
var User = models.User;
var shared = require('./shared');

describe('Model#User', function() {
  beforeEach(shared.createUser);
  afterEach(shared.removeUsers);

  describe('Validators', function() {
    describe('User#email', function() {
      it('email is required', function(done) {
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

      it('a valid email required', function(done) {
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
        User.create({
          email: 'me@heroicyang.com',
          username: 'heroicyang',
          password: '111111'
        }, function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });
    });

    describe('User#username', function() {
      it('username is required', function(done) {
        var user = new User({
          email: 'heroicyang@gmail.com',
          username: '',
          password: '111111'
        });
        user.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });

      it('non-alphanumeric username is invalid', function(done) {
        var user = new User({
          email: 'heroicyang@gmail.com',
          username: 'heroic*=&^',
          password: '111111'
        });
        user.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });

      it('length must be in the specified range', function(done) {
        var usernames = ['hero', 'heroicyang1234567'],
          user;
        async.each(usernames, function(username, next) {
          user = new User({
            email: 'heroicyang@gmail.com',
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
        User.create({
          email: 'heroicyang@gmail.com',
          username: 'heroic',
          password: '111111'
        }, function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });
    });

    describe('User#password', function() {
      it('password is required', function(done) {
        User.create({
          email: 'heroicyang@gmail.com',
          username: 'heroicyang',
          password: ''
        }, function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });

      it('length must be in the specified range', function(done) {
        var passwords = ['hero', 'heroicyang1234567heroicyang1234567'],
          user;
        async.each(passwords, function(password, next) {
          user = new User({
            email: 'heroicyang@gmail.com',
            username: 'heroicyang',
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

    describe('User#website', function() {
      it('a valid website required', function(done) {
        var user = new User({
          email: 'heroicyang@gmail.com',
          username: 'heroicyang',
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

  describe('moddlewares', function() {
    it('processing user data before validation', function(done) {
      var user = new User({
        email: 'heroicyang@gmail.com',
        username: 'heroicyang',
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

  describe('Methods', function() {
    describe('User#authenticate(plainText)', function() {
      it('correct password should return true', function(done) {
        var success = this.user.authenticate('111111'),
          failure = this.user.authenticate('123');
        success.should.be.true;
        failure.should.be.false;
        done();
      });
    });

    describe('User.edit(userData, callback)', function() {
      it('edit user', function(done) {
        User.edit({
          id: this.user.id,
          nickname: 'Heroic Yang',
          website: 'heroicyang.com'
        }, function(err, user) {
          should.exist(user);
          user.nickname.should.eql('Heroic Yang');
          user.website.should.eql('http://heroicyang.com');
          done();
        });
      });
    });
  });
});