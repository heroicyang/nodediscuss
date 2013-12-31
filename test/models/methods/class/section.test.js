/**
 * test/models/methods/class/section.test.js
 * 测试 Section 的类方法
 * @author heroic
 */

/**
* Module dependencies
*/
var async = require('async'),
  should = require('should');
var models = require('../../../db').models;
var User = models.User,
  Section = models.Section;
var data = require('../../../fixtures/data.json');

describe('models/methods/class/section.js', function() {
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

  after(function(done) {
    User.remove(done);
  });

  after(function(done) {
    Section.remove(done);
  });

  it('Section.query(options, callback): query sections', function(done) {
    Section.query({}, function(err, count, sections) {
      if (err) {
        throw err;
      }
      count.should.be.a.Number;
      sections.should.be.an.Array;
      count.should.eql(sections.length);
      count.should.be.above(0);
      done();
    });
  });

  it('Section.add(sectionData, callback): add new section', function(done) {
    Section.add({
      name: 'Test'
    }, function(err, section) {
      if (err) {
        throw err;
      }
      should.exist(section);
      done();
    });
  });

  it('Section.edit(sectionData, callback): edit section data', function(done) {
    var self = this;
    async.parallel([
      function(next) {
        var section = {
          id: self.section.id,
          name: 'Test1'
        };
        Section.edit(section, next);
      },
      function(next) {
        self.section.name = 'Test2';
        Section.edit(self.section, next);
      }
    ], done);
  });

  it('Section.get(conditions, callback): find one section', function(done) {
    var self = this;
    Section.get({
      _id: this.section.id
    }, function(err, section) {
      if (err) {
        throw err;
      }
      should.exist(section);
      section.id.should.eql(self.section.id);
      done();
    });
  });

  it('Section.getCount(conditions, callback): get section count', function(done) {
    Section.getCount({}, function(err, count) {
      if (err) {
        throw err;
      }
      count.should.be.a.Number;
      count.should.be.above(0);
      done();
    });
  });

  it('Section.destroy(conditions, callback): remove a section', function(done) {
    Section.destroy({
      _id: this.section.id
    }, function(err, section) {
      if (err) {
        throw err;
      }
      Section.findById(section.id, function(err, section) {
        if (err) {
          throw err;
        }
        should.not.exist(section);
        done();
      });
    });
  });
});