/**
 * 定义 FavoriteCatalogueSchema 的 pre-hooks
 * @author heroic
 */

/**
* Module dependencies
*/
var when = require('../when');

/**
* Bootstrap
* @param  {Mongoose.Schema} schema
*/
module.exports = exports = function(schema) {
  schema
   .pre('save', true, when('isNew').then(incFavoriteCatalogueCountOfUser))
   .pre('save', true, when('isNew').then(incFavoriteUserCountOfCatalogue))
   .pre('remove', true, decFavoriteCatalogueCountOfUser)
   .pre('remove', true, decFavoriteUserCountOfCatalogue);
};

/**
 * 增加对应用户的 favoriteCatalogueCount 值
 */
function incFavoriteCatalogueCountOfUser(next, done) {
  next();

  var User = this.model('User');
  User.findByIdAndUpdate(this.userId, {
    $inc: {
      favoriteCatalogueCount: 1
    }
  }, done);
}

/**
 * 增加对应节点的 favoriteUserCount 值
 */
function incFavoriteUserCountOfCatalogue(next, done) {
  next();

  var Catalogue = this.model('Catalogue');
  Catalogue.findByIdAndUpdate(this.catalogue.id, {
    $inc: {
      favoriteUserCount: 1
    }
  }, done);
}

/**
 * 减少对应用户的 favoriteCatalogueCount 值
 */
function decFavoriteCatalogueCountOfUser(next, done) {
  next();

  var User = this.model('User');
  User.findByIdAndUpdate(this.userId, {
    $inc: {
      favoriteCatalogueCount: -1
    }
  }, done);
}

/**
 * 减少对应节点的 favoriteUserCount 值
 */
function decFavoriteUserCountOfCatalogue(next, done) {
  next();

  var Catalogue = this.model('Catalogue');
  Catalogue.findByIdAndUpdate(this.catalogue.id, {
    $inc: {
      favoriteUserCount: -1
    }
  }, done);
}