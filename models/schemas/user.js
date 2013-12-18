/**
 * UserSchema definition
 * @author heroic
 */

/**
 * Module dependencies
 */
var crypto = require('crypto');
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var constants = require('../constants');

/**
 * Collection name in the database is `user`
 * @type {Schema}
 */
var UserSchema = new Schema({
  email: {
    type: String,
    index: true,
    unique: true,
    lowercase: true,
    set: function(val) {
      this.emailHash = crypto.createHash('md5').update(val).digest('hex');
      return val;
    }
  },
  emailHash: String,
  username: {
    type: String,
    index: true,
    unique: true,
    lowercase: true
  },
  passwordHashed: String,
  salt: String,
  nickname: {
    type: String,
    index: true
  },
  avatar: String,
  tagline: String,
  bio: String,
  website: {
    type: String,
    set: function(val) {
      if (val && !/(https?|s?ftp|git)/i.test(val)) {
        return 'http://' + val;
      }
    }
  },
  location: String,
  weibo: String,
  twitter: String,
  github: String,

  verified: {
    type: Boolean,
    default: false
  },
  state: {
    type: String,
    default: constants.USER_STATE.DEFAULT
  },

  topicCount: {
    type: Number,
    default: 0
  },
  favoriteTopicCount: {
    type: Number,
    default: 0
  },
  favoriteTagCount: {
    type: Number,
    default: 0
  },
  followerCount: {
    type: Number,
    default: 0
  },
  followingCount: {
    type: Number,
    default: 0
  },
  score: {
    type: Number,
    default: 0
  }
}, {
  collection: 'user'
});

/**
 * Virtual attributes
 */
UserSchema.virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.passwordHashed = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

/**
 * Expose schema and model name
 * @type {object}
 */
module.exports = {
  schema: UserSchema,
  modelName: 'User'
};