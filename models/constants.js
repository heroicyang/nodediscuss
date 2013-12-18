/**
 * Model 层需要用到的常量定义
 * 说明：常量值使用 `string` 是因为 mongoose schema 的...
 *    ...枚举验证(`enum`)只支持 `string` 类型
 * @author heroic
 */

/**
 * Module dependencies
 */
var constants = require('../libs/node-constants');

var consts = module.exports = exports;

/** 用户状态 */
constants.define(consts, 'USER_STATE', {
  DEFAULT: '0',      // 默认状态，即刚注册时
  ACTIVATED: '1',    // 已激活
  BLOCKED: '2'       // 被锁定，不允许任何写入操作
});

/** 提醒系统的通知类型 */
constants.define(consts, 'NOTIFICATION_TYPE', {
  COMMENT: '1',         // 某人评论了你的话题
  REPLY_COMMENT: '2',   // 某人回复了你的评论
  FOLLOW: '3',          // 某人关注了你
  AT: '4'               // 某人@了你
});