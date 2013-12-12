/**
 * 节点组管理
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  api = require('../../../api');

exports.index = function(req, res, next) {
  api.section.query({
    pageSize: Infinity,
    sort: {
      order: -1,
      createdAt: -1
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    async.map(results.sections, function(section, next) {
      api.tag.count({
        'section.id': section._id
      }, function(err, count) {
        if (err) {
          return next(err);
        }
        section.tagCount = count;
        next(null, section);
      });
    }, function(err, sections) {
      if (err) {
        return next(err);
      }
      res.render('admin/section/index', {
        sections: sections
      });
    });
  });
};