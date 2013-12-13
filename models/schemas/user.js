/**
 * UserSchema definition
 * @author heroic
 */

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Collection name in the database is `user`
 * @type {Schema}
 */
var UserSchema = new Schema({
  email: {
    type: String,
    index: true,
    unique: true,
    lowercase: true
  },
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
  website: String,
  location: String,
  weibo: String,
  twitter: String,
  github: String,

  verified: {
    type: Boolean,
    default: false
  },
  state: {
    activated: {
      type: Boolean,
      default: false
    },
    migrated: {
      type: Boolean,
      default: false
    },
    blocked: {
      type: Boolean,
      default: false
    }
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
  number: Number,
  score: {
    type: Number,
    default: 0
  },
  level: String
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