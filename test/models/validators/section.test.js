/**
 * test/models/validators/section.test.js
 * 对节点组数据的验证逻辑进行测试
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  should = require('should');
var models = require('../../db').models;
var Section = models.Section;
var data = require('../../fixtures/data.json');

describe('models/validators/section.js', function() {
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

  after(function(done) {
    Section.remove(done);
  });

  it('exists name should throw ValidationError', function(done) {
    var self = this;
    async.parallel([
      function(next) {
        var section = new Section({
          name: self.section.name
        });
        section.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          next(null);
        });
      },
      function(next) {
        var section = new Section({
          name: 'hello'
        });
        section.validate(function(err) {
          should.not.exist(err);
          next(null);
        });
      }
    ], done);
  });
});