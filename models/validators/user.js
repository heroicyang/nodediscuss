/**
 * Adds validators to UserSchema
 * @author heroic
 */

/**
 * Module dependencies
 */
var validate = require('../validate');

/**
 * Bootstrap
 * @param {Mongoose.Schema} schema
 * @return {Function}
 */
module.exports = exports = function(schema) {
  addEmailValidators(schema);
  addUsernameValidators(schema);
  addPasswordValidators(schema);
  addWebsiteValidators(schema);
};

/**
 * Adds validators on `email` path
 * @param {Mongoose.Schema} schema
 */
function addEmailValidators(schema) {
  schema.path('email')
    .validate(function(email) {
      return !!email;
    }, 'An email is required!')
    .validate(function(email) {
      return !!validate(email).isEmail();
    }, 'Doesn\'t look like a valid email.')
    .validate(function(email, done) {
      var self = this,
        User = this.model(this.constructor.modelName);
      User.findOneByEmail(email, function(err, user) {
        if (err) {
          throw err;
        }
        if (user) {
          return done(user.id === self.id);
        }
        done(true);
      });
    }, 'This email is already registered.');
}

/**
 * Adds validators on `username` path
 * @param {Mongoose.Schema} schema
 */
function addUsernameValidators(schema) {
  schema.path('username')
    .validate(function(username) {
      return username.length >= 6;
    }, 'Username must be at least 6 characters.')
    .validate(function(username) {
      return username.length <= 16;
    }, 'Username must be less than 16 characters.')
    .validate(function(username) {
      return !!validate(username).is(/^[a-zA-Z0-9\-_]+$/);
    }, 'Invalid username! Alphanumerics only.')
    .validate(function(username, done) {
      var self = this,
        User = this.model(this.constructor.modelName);
      User.findOneByUsername(username, function(err, user) {
        if (err) {
          throw err;
        }
        if (user) {
          return done(user.id === self.id);
        }
        done(true);
      });
    }, 'This username is already taken.');
}

/**
 * Adds validators on `passwordHashed` path
 * @param {Mongoose.Schema} schema
 */
function addPasswordValidators(schema) {
  schema.path('passwordHashed')
    .validate(function() {
      if (this.isNew) {
        return !!this.password;
      }
      return true;
    }, 'Password cannot be blank.')
    .validate(function() {
      if (!this.password) {
        return true;
      }
      return this.password.length >= 6;
    }, 'Password must be at least 6 characters.')
    .validate(function() {
      if (!this.password) {
        return true;
      }
      return this.password.length <= 31;
    }, 'Password must be less than 31 characters.');
}

/**
 * Adds validators on `website` path
 * @param {Mongoose.Schema} schema
 */
function addWebsiteValidators(schema) {
  schema.path('website')
    .validate(function(website) {
      if (website) {
        return !!validate(website).isUrl();
      }
      return true;
    }, 'Doesn\'t look like a valid website url.');
}