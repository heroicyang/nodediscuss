/**
 * Page 类方法
 * @author heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * 编辑页面
 * @param  {Object}   pageData
 *  - id         required    页面 id
 *  - editorId   required    编辑者 id
 * @param  {Function} callback
 *  - err
 *  - page    编辑后的 page 对象
 */
exports.edit = function(pageData, callback) {
  var id = pageData.id || pageData._id,
    editorId = pageData.editorId;

  pageData = _.omit(pageData, '_id');

  this.findById(id, function(err, page) {
    if (err) {
      return callback(err);
    }
    if (!page || _.isEmpty(pageData)) {
      return callback(null, page);
    }

    _.extend(page, pageData);
    if (!_.contains(page.authorIds, editorId)) {
      page.authorIds.push(editorId);
    }
    page.save(callback);
  });
};