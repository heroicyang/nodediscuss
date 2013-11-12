/**
 * 用于消息响应的中间件，利用 session 进行键值存储
 * @author heroic
 */

module.exports = exports = function() {
  return function(req, res, next) {
    req.flash = function(key, value) {
      if (this.session === undefined) {
        throw new Error('req.flash() requires sessions');
      }
      var msg = this.session.flash = this.session.flash || {};

      if (key && value) {
        msg[key] = value;
        return msg;
      } else if (key) {
        var val = msg[key];
        delete msg[key];
        return val;
      } else {
        this.session.flash = {};
        return msg;
      }
    };
    next();
  };
};