/**
 * Page controllers
 * @author heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash'),
  nconf = require('nconf');
var api = require('../api');
var error = require('../utils/error'),
  NotFoundError = error.NotFoundError;

/** Wiki 列表页面 */
exports.wikis = function(req, res, next) {
  var pageIndex = req.query.pageIndex;
  var pagination = {
    pageIndex: pageIndex,
    pageSize: nconf.get('pagination:pageSize')
  };

  api.Page.query({
    conditions: {
      slug: {
        $regex: 'wikis\/',
        $options: 'i'
      }
    },
    pageIndex: pageIndex,
    pageSize: nconf.get('pagination:pageSize')
  }, function(err, count, pages) {
    if (err) {
      return next(err);
    }
    
    pagination.totalCount = count;
    res.render('page/wikis', {
      wikis: pages,
      wikiCount: count,
      pagination: pagination
    });
  });
};

/** 创建新 wiki */
exports.createWiki = function(req, res, next) {
  var method = req.method.toLowerCase();

  if ('get' === method) {
    res.render('page/edit', {
      wiki: req.flash('body'),
      err: req.flash('err')
    });
  } else if ('post' === method) {
    var data = _.clone(req.body);
    data.slug = 'wikis/' + data.slug;
    data.creatorId = req.currentUser.id;
    api.Page.add(data, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/wikis');
    });
  }
};

/** 编辑 wiki */
exports.editWiki = function(req, res, next) {
  var method = req.method.toLowerCase();

  if ('get' === method) {
    var slug = 'wikis/' + req.params.slug;
    api.Page.get({
      slug: slug
    }, function(err, page) {
      if (err) {
        return next(err);
      }
      if (!page) {
        return next(new NotFoundError('该页面不存在。'));
      }

      page.slug = page.slug.replace('wikis/', '');
      res.render('page/wikis', {
        wiki: _.extend(page, req.flash('body')),
        err: req.flash('err')
      });
    });
  } else if ('post' === method) {
    var data = _.clone(req.body);
    data.editorId = req.currentUser.id;
    data.slug = 'wikis/' + data.slug;
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
  if (slug.indexOf('wikis/') !== -1) {
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

    req.breadcrumbs(page.title);
    res.locals.site = res.locals.site || {};
    res.locals.site.title = page.title + ' - ' + nconf.get('site:name');
    res.locals.site.description = page.title;
    res.render('page/show', {
      page: page,
      isWiki: isWiki
    });
  });
};