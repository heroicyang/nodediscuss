/**
 * 文件上传服务
 * @author heroic
 */

/**
 * Module dependencies
 */
var path = require('path'),
  Uploader = require('../plugins/uploader'),
  uploader = new Uploader(),
  LocalStrategy = require('../plugins/local_uploader'),
  config = require('../config');

/** 加载 LocalStrategy 插件 */
uploader.use(new LocalStrategy({
  uploadPath: path.join(process.cwd(), config.media.cwd, config.media.uploadPath)
}));

/**
 * 包装一个快捷调用的方法并暴露出去
 */
exports.upload = function(files, callback) {
  uploader.upload(config.uploader.strategy, files, callback);
};