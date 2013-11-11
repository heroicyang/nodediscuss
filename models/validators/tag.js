/**
 * Adds validators to TagSchema
 * @author  heroic
 */

 /**
  * Module dependencies
  */
var ObjectId = require('mongoose').Types.ObjectId,
   _ = require('lodash');

/**
 * Bootstrap
 * @param {Mongoose.Schema} schema
 * @return {Function}
 */
module.exports = exports = function(schema) {
  addNameValidators(schema);
  addSectionValidators(schema);
};

/**
 * Adds validators on `name` path
 * @param {Mongoose.Schema} schema
 */
function addNameValidators(schema) {
  schema.path('name')
    .required(true, 'A tag name is required!');
}

/**
 * Adds validators on `section.id` path
 * @param {Mongoose.Schema} schema
 */
function addSectionValidators(schema) {
  schema.path('section.id')
    .required(true, 'Section can not be blank!')
    .validate(function(sectionId) {
      try {
        sectionId = new ObjectId(sectionId);
      } catch (e) {
        return false;
      }
      return true;
    }, 'Invalid section id!')
    .validate(function(sectionId, done) {
      var Section = this.model('Section'),
        self = this;

      Section.findById(sectionId, function(err, section) {
        if (err || !section) {
          return done(false);
        }

        _.extend(self.section, {
          name: section.name
        });
        done(true);
      });
    }, 'Section does not exist.');
}