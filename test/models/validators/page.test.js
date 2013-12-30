/**
 * test/models/validators/page.test.js
 * 对页面数据的验证逻辑进行测试
 * @author heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash'),
  async = require('async'),
  should = require('should');
var models = require('../../db').models;
var User = models.User,
  Page = models.Page;
var data = require('../../fixtures/data.json');

describe('models/validators/page.js', function() {
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

  it('exists slug should throw ValidationError', function(done) {
    var page = new Page({
      slug: this.page.slug,
      title: 'Page Test',
      content: 'This is a test page.',
      contributors: [this.user.id]
    });
    page.validate(function(err) {
      should.exist(err);
      err.name.should.eql('ValidationError');
      done();
    });
  });

  it('title length must be less than 100 characters', function(done) {
    var titles = [
      'valid title',
      (new Array(100)).join('invalid title')
    ];
    var self = this;
    
    async.parallel([
      function(next) {
        var page = new Page({
          slug: 'test',
          title: titles[0],
          content: 'This is a test page.',
          contributors: [self.user.id]
        });
        page.validate(function(err) {
          should.not.exist(err);
          next(null);
        });
      },
      function(next) {
        var page = new Page({
          slug: 'test',
          title: titles[1],
          content: 'This is a test page.',
          contributors: [self.user.id]
        });
        page.validate(function(err) {
          should.exist(err);
          err.name.should.eql('ValidationError');
          next(null);
        });
      }
    ], done);
  });
});