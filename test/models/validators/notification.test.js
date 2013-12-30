/**
 * test/models/validators/notification.test.js
 * 对提醒数据的验证逻辑进行测试
 * @author heroic
 */

/**
 * Module dependencies
 */
var should = require('should');
var models = require('../../db').models;
var Notification = models.Notification;

describe('models/validators/notification.js', function() {
  it('invalid master user id should throw ValidationError', function(done) {
    var notification = new Notification({
      masterId: '123asdas',
      userId: '52a486511db59f0a12000004',
      type: '1'
    });
    notification.validate(function(err) {
      should.exist(err);
      err.name.should.eql('ValidationError');
      done();
    });
  });

  it('invalid user id should throw ValidationError', function(done) {
    var notification = new Notification({
      masterId: '52a486511db59f0a12000004',
      userId: '123asdas',
      type: '1'
    });
    notification.validate(function(err) {
      should.exist(err);
      err.name.should.eql('ValidationError');
      done();
    });
  });

  it('if provide the topic id it should be valid', function(done) {
    var notification = new Notification({
      masterId: '52a486511db59f0a12000004',
      userId: '52a486511db59f0a12000004',
      type: '1',
      topicId: '123asdasd'
    });
    notification.validate(function(err) {
      should.exist(err);
      err.name.should.eql('ValidationError');
      done();
    });
  });

  it('if provide the master comment id it should be valid', function(done) {
    var notification = new Notification({
      masterId: '52a486511db59f0a12000004',
      userId: '52a486511db59f0a12000004',
      type: '1',
      topicId: '52a486511db59f0a12000004',
      masterCommentId: '123sadasd'
    });
    notification.validate(function(err) {
      should.exist(err);
      err.name.should.eql('ValidationError');
      done();
    });
  });

  it('if provide the comment id it should be valid', function(done) {
    var notification = new Notification({
      masterId: '52a486511db59f0a12000004',
      userId: '52a486511db59f0a12000004',
      type: '1',
      topicId: '52a486511db59f0a12000004',
      masterCommentId: '52a486511db59f0a12000004',
      commentId: '123sdasd'
    });
    notification.validate(function(err) {
      should.exist(err);
      err.name.should.eql('ValidationError');
      done();
    });
  });
});