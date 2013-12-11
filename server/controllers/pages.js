/**
 * Page controllers
 * @author heroic
 */

/**
 * Module dependencies
 */
var config = require('../../config'),
  api = require('../../api'),
  NotFoundError = require('../../utils/error').NotFoundError;

/** Wiki 列表页面 */
exports.wikis = function(req, res, next) {
  var pageIndex = req.query.pageIndex;
  var pagination = {
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  };

  api.page.query({
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    
    pagination.totalCount = results.totalCount;
    req.breadcrumbs('Wiki');
    res.render('page/wikis', {
      wikis: results.pages,
      pagination: pagination
    });
  });
};

exports.createWiki = function(req, res, next) {
  var method = req.method.toLowerCase();

  if ('get' === method) {
    req.breadcrumbs('Wiki', '/wiki');
    req.breadcrumbs('创建 Wiki');
    res.render('page/wiki_edit', {
      err: req.flash('err')
    });
    return;
  }

  if ('post' === method) {
    var data = req.body;
    data.slug = 'wiki/' + data.slug;
    data.authorId = req.currentUser.id;
    api.page.create(data, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/wiki');
    });
  }
};

exports.get = function(req, res, next) {
  var slug = req.params[0],
    isWiki = false;

  if (slug.indexOf('wiki/') !== -1) {
    isWiki = true;
  }

  api.page.get({
    slug: slug
  }, function(err, page) {
    if (err) {
      return next(err);
    }
    if (!page) {
      return next(new NotFoundError('该页面不存在。'));
    }

    if (isWiki) {
      req.breadcrumbs('Wiki', '/wiki');
    }
    req.breadcrumbs(page.title);
    res.render('page/show', {
      page: page,
      isWiki: isWiki
    });
  });
};