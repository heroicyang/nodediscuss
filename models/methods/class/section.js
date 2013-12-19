/**
 * Section 类方法
 * @author heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * 获取节点组数据
 * @param  {Object}   options
 *  - query          optional   查询条件，默认查询全部
 *  - notPaged       optional   不分页则传入 true，默认 false
 *  - pageIndex      optional   当前页数，默认 1
 *  - pageSize       optional   返回的记录数，默认 20
 *  - sort  {Object} optional   排序规则，默认按创建时间倒序
 * @param  {Function} callback
 *  - err
 *  - count     记录总数
 *  - sections  节点组数据
 */
exports.query = function(options, callback) {
  options = options || {};
  var conditions = options.query || options.conditions || {};
  options = _.omit(options, ['query', 'conditions']);
  this.paginate(conditions, options, callback);
};

/**
 * 增加新节点组
 * @param {Object}   sectionData    节点组数据
 * @param {Function} callback
 *  - err
 *  - section
 */
exports.add = function(sectionData, callback) {
  this.create(sectionData, callback);
};

/**
 * 修改节点组信息
 * @param  {Object}   userData   节点组数据
 *  - id     required   节点组 id
 * @param  {Function} callback
 *  - err
 *  - section
 */
exports.edit = function(sectionData, callback) {
  var id = sectionData.id || sectionData._id;
  sectionData = _.omit(sectionData, ['_id, id']);

  this.findById(id, function(err, section) {
    if (err) {
      return callback(err);
    }

    if (!section || _.isEmpty(sectionData)) {
      return callback(null, section);
    }

    _.extend(section, sectionData);
    section.save(callback);
  });
};

/**
 * 根据条件查询单一节点组
 * @param  {Object}   conditions   查询条件
 * @param  {Function} callback
 *  - err
 *  - section
 */
exports.get = function(conditions, callback) {
  this.findOne(conditions, callback);
};

/**
 * 根据条件统计节点组数量
 * @param  {Object}   conditions   查询条件
 * @param  {Function} callback
 *  - err
 *  - count
 */
exports.getCount = function(conditions, callback) {
  this.count(conditions, callback);
};

/**
 * 根据条件查询单个节点组并删除该节点组
 * @param  {Object}   conditions   查询条件
 * @param  {Function} callback
 *  - err
 *  - section
 */
exports.destroy = function(conditions, callback) {
  this.get(conditions, function(err, section) {
    if (err) {
      return callback(err);
    }
    if (!section) {
      return callback(null, section);
    }
    section.remove(callback);
  });
};