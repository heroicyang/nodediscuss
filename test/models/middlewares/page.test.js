/**
 * test/model/middlewares/page.test.js
 * 对页面数据模型的中间件逻辑进行测试
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  _ = require('lodash');
var models = require('../../db').models;
var User = models.User,
  Page = models.Page;
var data = require('../../fixtures/data.json');

describe('models/middlewares/page.js', function() {
  before(function createUsers(done) {
    var self = this;
    User.create(data.users, function(err, user) {
      if (err) {
        throw err;
      }
      self.user = user;
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

  it('increase page\'s version when update', function(done) {
    var self = this;
    async.auto({
      page: function(next) {
        Page.findById(self.page.id, next);
      },
      update: function(next) {
        self.page.content = 'Update page test...';
        self.page.save(function(err) {
          next(err);
        });
      },
      check: ['page', 'update', function(next, results) {
        Page.findById(self.page.id, function(err, page) {
          if (err) {
            return next(err);
          }
          page.version.should.eql(results.page.version + 1);
          next(null);
        });
      }]
    }, done);
  });
});