/**
 * 节点管理
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  api = require('../../../api');

exports.index = function(req, res, next) {
  async.parallel({
    sections: function(next) {
      api.section.query({
        notPaged: true
      }, function(err, results) {
        if (err) {
          return next(err);
        }
        next(null, results.sections);
      });
    },
    tags: function(next) {
      api.tag.query({
        notPaged: true
      }, function(err, results) {
        if (err) {
          return next(err);
        }
        next(null, results.tags);
      });
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    res.render('admin/tag/index', results);
  });
};