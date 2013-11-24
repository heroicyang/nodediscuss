/**
 * 暴露所有 controller
 * @author heroic
 */

module.exports = exports = {
  upload: require('./upload'),
  user: require('./user'),
  topic: require('./topic'),
  comment: require('./comment'),
  notification: require('./notification')
};