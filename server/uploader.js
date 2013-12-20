/**
 * 文件上传服务
 * @author heroic
 */

/**
 * Module dependencies
 */
var path = require('path');
var Uploader = require('../libs/uploader'),
  LocalStrategy = require('../plugins/local_uploader'),
  QiniuStrategy = require('../plugins/qiniu_uploader');
var config = require('../config');

var uploader = new Uploader();

/** 加载 LocalStrategy 插件 */
if (config.uploader.strategy === 'local') {
  uploader.use(new LocalStrategy({
    uploadPath: path.join(process.cwd(),
        config.media.cwd, config.media.uploadPath)
  }));
}

/** 加载 QiniuStrategy 插件 */
if (config.uploader.strategy === 'qiniu') {
  uploader.use(new QiniuStrategy({
    uploadPath: path.join(config.media.cwd, config.media.uploadPath),
    accessKey: config.uploader.options.accessKey,
    secretKey: config.uploader.options.secretKey,
    bucket: config.uploader.options.bucket,
    domain: config.uploader.options.domain
  }));
}

/**
 * 包装一个快捷调用的方法并暴露出去
 */
exports.upload = function(files, callback) {
  uploader.upload(config.uploader.strategy, files, callback);
};