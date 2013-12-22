/**
 * Module dependencies
 */
var should = require('should'),
  db = require('../db'),
  models = db.models;
var Notification = models.Notification,
  constants = models.constants;
var shared = require('./shared');

describe('Model#Notification', function() {
  beforeEach(shared.createUser);
  afterEach(shared.removeUsers);
  afterEach(shared.removeNotifications);

  describe('Validators', function() {
    describe('Notification#masterId', function() {
      it('masterId is required', function(done) {
        var notification = new Notification({
          userId: this.user.id,
          type: constants.NOTIFICATION_TYPE.COMMENT
        });
        notification.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });

      it('masterId must be a valid `ObjectId` string', function(done) {
        var comment = new Notification({
          masterId: '1234',
          userId: this.user.id,
          type: constants.NOTIFICATION_TYPE.COMMENT
        });
        comment.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });
    });

    describe('Notification#userId', function() {
      it('userId is required', function(done) {
        var notification = new Notification({
          masterId: this.user.id,
          type: constants.NOTIFICATION_TYPE.COMMENT
        });
        notification.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });

      it('userId must be a valid `ObjectId` string', function(done) {
        var comment = new Notification({
          masterId: this.user.id,
          userId: '1234',
          type: constants.NOTIFICATION_TYPE.COMMENT
        });
        comment.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });
    });

    describe('Notification#type', function() {
      it('type is required', function(done) {
        var notification = new Notification({
          masterId: this.user.id,
          userId: this.user.id
        });
        notification.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });

      it('invalid type', function(done) {
        var comment = new Notification({
          masterId: this.user.id,
          userId: this.user.id,
          type: '1234'
        });
        comment.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });

      it('valid type', function(done) {
        var comment = new Notification({
          masterId: this.user.id,
          userId: this.user.id,
          type: constants.NOTIFICATION_TYPE.COMMENT
        });
        comment.validate(function(err) {
          should.not.exist(err);
          done();
        });
      });
    });

    describe('Notification#topicId', function() {
      it('topicId must be a valid `ObjectId` string', function(done) {
        var comment = new Notification({
          masterId: this.user.id,
          userId: this.user.id,
          topicId: '1234',
          type: constants.NOTIFICATION_TYPE.COMMENT
        });
        comment.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });
    });

    describe('Notification#masterCommentId', function() {
      it('masterCommentId must be a valid `ObjectId` string', function(done) {
        var comment = new Notification({
          masterId: this.user.id,
          userId: this.user.id,
          masterCommentId: '1234',
          type: constants.NOTIFICATION_TYPE.COMMENT
        });
        comment.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          done();
        });
      });
    });

    describe('Notification#commentId', function() {
      it('commentId must be a valid `ObjectId` string', function(done) {
        var comment = new Notification({
          masterId: this.user.id,
          userId: this.user.id,
          commentId: '1234',
          type: constants.NOTIFICATION_TYPE.COMMENT
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