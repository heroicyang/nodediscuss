/**
 * 节点组相关的 API
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  _ = require('lodash'),
  models = require('../models'),
  Section = models.Section;

/**
 * 获取节点组列表
 * @param  {Object}   options
 *  - query          optional   查询条件，默认查询全部
 *  - notPaged       optional   不分页则传入 true，默认 false
 *  - pageIndex      optional   当前页数，默认 1
 *  - pageSize       optional   返回的记录数，默认 20
 *  - sort  {Object} optional   排序规则，默认按创建时间倒序
 * @param  {Function} callback
 *  - err
 *  - results
 *    - totalCount    符合查询条件节点组记录总数
 *    - sections      节点组列表
 */
exports.query = function(options, callback) {
  options = options || {};
  var conditions = options.query || options.conditions || {};

  Section.paginate(conditions, options, function(err, count, sections) {
    if (err) {
      return callback(err);
    }

    // `notPaged === true` 的情况
    if (typeof sections === 'undefined') {
      return callback(null, { sections: count });
    }

    callback(null, {
      totalCount: count,
      sections: sections
    });
  });
};

/**
 * 根据条件获取单个节点组
 * @param  {Object}   conditions 查询条件
 * @param  {Function} callback
 *  - err
 *  - section
 */
exports.get = function(conditions, callback) {
  Section.findOne(conditions, callback);
};

/**
 * 创建节点组
 * @param  {Object}   sectionData  节点组对象
 * @param  {Function} callback
 *  - err
 *  - section
 */
exports.create = function(sectionData, callback) {
  Section.create(sectionData, callback);
};

/**
 * 根据主键编辑节点组
 * @param  {Object}   sectionData  节点组对象
 *  - _id|id   required    节点组 id
 * @param  {Function} callback
 *  - err
 *  - section
 */
exports.edit = function(sectionData, callback) {
  var id = sectionData.id || sectionData._id;
  sectionData = _.omit(sectionData, '_id');

  async.waterfall([
    function getSection(next) {
      Section.findById(id, function(err, section) {
        next(err, section);
      });
    },
    function updateSection(section, next) {
      if (!section) {
        return next(null, section);
      }
      _.extend(section, sectionData);
      section.save(function(err, section) {
        next(err, section);
      });
    }
  ], callback);
};

/**
 * 根据主键删除节点组
 * @param  {Object}   args
 *  - id     required   节点组 id
 * @param  {Function} callback
 *  - err
 *  - section
 */
exports.remove = function(args, callback) {
  var id = args.id;
  async.waterfall([
    function getSection(next) {
      Section.findById(id, function(err, section) {
        next(err, section);
      });
    },
    function removeSection(section, next) {
      if (!section) {
        return next(null, section);
      }
      section.remove(function(err, section) {
        next(err, section);
      });
    }
  ], callback);
};