/**
 * 定义 SectionSchema 的 pre-hooks
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async');

/**
* Bootstrap
* @param  {Mongoose.Schema} schema
*/
module.exports = exports = function(schema) {
  schema
    .pre('remove', removeAllCatalogues);
};

/**
 * 删除节点域下面的所有节点
 */
function removeAllCatalogues(next) {
  var Catalogue = this.model('Catalogue');
  Catalogue.find({
    'section.id': this.id
  }, function(err, catalogues) {
    if (err) {
      return next(err);
    }

    async.each(catalogues, function(catalogue, next) {
      catalogue.remove(next);
    }, next);
  });
}