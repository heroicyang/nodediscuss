/**
 * 常量
 * @author heroic
 */

/**
 * 定义 model 中会用到的常量
 * @type {Object}
 */
define(exports, {
  // 通知类型
  NOTIFICATION_TYPE: {
    COMMENT: 1,         // 某人评论了你的话题
    REPLY_COMMENT: 2,   // 某人回复了你的评论
    FOLLOW: 3,          // 某人关注了你
    AT: 4               // 某人@了你
  }
});

module.exports = exports;
exports.define = define;

/**
 * 定义常量，真正意义上的常量，只可读不可写
 * @param  {Object} object  用于绑定常量的对象
 * @param  {String} name    常量名称
 * @param  {[type]} value   常量值
 * @return {Object}         绑定常量的对象
 */
function define(object, name, value) {
  var key;

  // 如果传入的第二个参数为一个对象，则遍历该对象进行常量定义
  if (typeof name === 'object') {
    for (key in name) {
      if (name.hasOwnProperty(key)) {
        define(object, key, name[key]);
      }
    }
  } else {
    Object.defineProperty(object, name, {
      value:        value,
      enumerable:   true,
      writable:     false,
      configurable: false
    });
  }

  return object;
}