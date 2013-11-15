/**
 * 节点相关的 API
 * @author heroic
 */

/**
 * Module dependencies
 */
var models = require('../models'),
  Tag = models.Tag;

exports.getGroupedTags = function(callback) {
  Tag.findAllGroupedBySection(callback);
};