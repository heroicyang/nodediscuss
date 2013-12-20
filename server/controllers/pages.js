/**
 * Page controllers
 * @author heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash');
var config = require('../../config'),
  api = require('../api');
var error = require('../utils/error'),
  NotFoundError = error.NotFoundError;

/** Wiki 列表页面 */
exports.wikis = function(req, res, next) {
  var pageIndex = req.query.pageIndex;
  var pagination = {
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  };

  api.Page.query({
    conditions: {
      slug: {
        $regex: 'wiki\/',
        $options: 'i'
      }
    },
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  }, function(err, count, pages) {
    if (err) {
      return next(err);
    }
    
    pagination.totalCount = count;
    req.breadcrumbs('Wiki');
    res.render('page/wikis', {
      wikis: pages,
      pagination: pagination
    });
  });
};

/** 创建新 wiki */
exports.createWiki = function(req, res, next) {
  var method = req.method.toLowerCase();

  if ('get' === method) {
    req.breadcrumbs('Wiki', '/wiki');
    req.breadcrumbs('创建 Wiki');
    res.render('page/edit_wiki', {
      wiki: req.flash('body'),
      err: req.flash('err')
    });
  } else if ('post' === method) {
    var data = _.clone(req.body);
    data.slug = 'wiki/' + data.slug;
    data.creatorId = req.currentUser.id;
    api.Page.add(data, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/wiki');
    });
  }
};

/** 编辑 wiki */
exports.editWiki = function(req, res, next) {
  var method = req.method.toLowerCase();

  if ('get' === method) {
    var slug = 'wiki/' + req.params.slug;
    api.Page.get({
      slug: slug
    }, function(err, page) {
      if (err) {
        return next(err);
      }
      if (!page) {
        return next(new NotFoundError('该页面不存在。'));
      }

      page.slug = page.slug.replace('wiki/', '');
      req.breadcrumbs(page.title, '/' + page.slug);
      req.breadcrumbs('编辑 Wiki');
      res.render('page/wiki_edit', {
        wiki: _.extend(page, req.flash('body')),
        err: req.flash('err')
      });
    });
  } else if ('post' === method) {
    var data = _.clone(req.body);
    data.editorId = req.currentUser.id;
    data.slug = 'wiki/' + data.slug;
    api.Page.edit(data, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/' + data.slug);
    });
  }
};

/** 页面详细信息 */
exports.get = function(req, res, next) {
  var slug = req.params[0],
    isWiki = false;
  if (slug.indexOf('wiki/') !== -1) {
    isWiki = true;
  }

  api.Page.get({
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