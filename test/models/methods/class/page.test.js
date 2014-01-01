/**
 * test/models/methods/class/page.test.js
 * 测试 Page 的类方法
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
  Page = models.Page;
var data = require('../../../fixtures/data.json');

describe('models/methods/class/page.js', function() {
  before(function createUsers(done) {
    var self = this;
    User.create(data.users, function(err, user, user1) {
      if (err) {
        throw err;
      }
      self.user = user;
      self.user1 = user1;
      done();
    });
  });

  before(function createPages(done) {
    var self = this;
    var pages = _.map(data.pages, function(page) {
      page.contributors = [self.user.id];
      return page;
    });

    Page.create(pages, function(err, page) {
      if (err) {
        throw err;
      }
      self.page = page;
      done();
    });
  });

  after(function(done) {
    Page.remove(done);
  });

  after(function(done) {
    User.remove(done);
  });

  it('Page.query(options, callback): query pages', function(done) {
    Page.query({}, function(err, count, pages) {
      if (err) {
        throw err;
      }
      count.should.be.a.Number;
      pages.should.be.an.Array;
      count.should.eql(pages.length);
      count.should.be.above(0);
      done();
    });
  });

  it('Page.add(pageData, callback): add new page', function(done) {
    Page.add({
      slug: 'test1234',
      title: 'Test1234',
      content: 'this is a test page..',
      contributors: [this.user.id]
    }, function(err, page) {
      if (err) {
        throw err;
      }
      should.exist(page);
      done();
    });
  });

  it('Page.edit(pageData, callback): edit page data', function(done) {
    var self = this;
    async.parallel([
      function(next) {
        var page = {
          id: self.page.id,
          content: 'update by creator...',
          editorId: self.user.id
        };
        Page.edit(page, function(err, page) {
          if (err) {
            return next(err);
          }
          page.content.should.not.eql(self.page.content);
          next(null);
        });
      },
      function(next) {
        var page = {
          id: self.page.id,
          content: 'update by another user...',
          editorId: self.user1.id
        };
        Page.edit(page, function(err, page) {
          if (err) {
            return next(err);
          }
          page.contributors.should.have.length(2);
          page.contributors.should.contain(self.user1.id);
          next(null);
        });
      },
      function(next) {
        var page = {
          id: '52a486511db59f0a12000004',
          content: 'the page does not exist...',
          editorId: self.user.id
        };
        Page.edit(page, function(err, page) {
          if (err) {
            return next(err);
          }
          should.not.exist(page);
          next(null);
        });
      }
    ], done);
  });

  it('Page.get(conditions, callback): find one page', function(done) {
    var self = this;
    Page.get({
      _id: this.page.id
    }, function(err, page) {
      if (err) {
        throw err;
      }
      should.exist(page);
      page.id.should.eql(self.page.id);
      done();
    });
  });

  it('Page.getCount(conditions, callback): get page count', function(done) {
    Page.getCount({}, function(err, count) {
      if (err) {
        throw err;
      }
      count.should.be.a.Number;
      count.should.be.above(0);
      done();
    });
  });

  it('Page.destroy(conditions, callback): remove a page', function(done) {
    Page.destroy({
      _id: this.page.id
    }, function(err, page) {
      if (err) {
        throw err;
      }
      Page.findById(page.id, function(err, page) {
        if (err) {
          throw err;
        }
        should.not.exist(page);
        done();
      });
    });
  });
});