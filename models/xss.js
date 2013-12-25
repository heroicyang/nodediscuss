/**
 * 对 mongoose document 中指定的字段进行 `xss` 过滤
 * @author heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash'),
  xss = require('xss');

// 配置 xss 白名单
xss.whiteList.code = ['class'];
xss.whiteList.span = ['class'];

/**
 * Exports
 * @param  {Mongoose.Document} doc     文档对象
 * @param  {String|Array}      fields  字段
 */
module.exports = exports = function(doc, fields) {
  if (!_.isArray(fields)) {
    fields = [fields];
  }
  _.each(fields, function(field) {
    if (doc[field]) {
      doc[field] = xss(doc[field]);
    }
  });
};