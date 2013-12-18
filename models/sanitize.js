/**
 * 对 document 中的字段进行 xss 过滤
 * @author heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash'),
  sanitize = require('validator').sanitize;

/**
 * 对该文档的字段进行 xss 过滤
 * @param  {Mongoose.Document} doc     文档对象
 * @param  {String|Array}      fields  字段
 */
module.exports = exports = function(doc, fields) {
  if (!_.isArray(fields)) {
    fields = [fields];
  }

  _.each(fields, function(field) {
    if (doc[field]) {
      doc[field] = sanitize(doc[field]).xss();
    }
  });
};