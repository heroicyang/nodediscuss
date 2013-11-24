/**
 * 将文件上传至七牛云存储
 * @author  heroic
 */

/**
 * Module dependencies
 */
var util = require('util'),
  path = require('path'),
  qn = require('qn'),
  Strategy = require('../uploader').Strategy;

/**
 * QiniuStrategy constructor
 * @param {Object} options
 */
function QiniuStrategy(options) {
  options = options || {};
  Strategy.call(this);
  this.name = 'qiniu';
  this.uploadPath = options.uploadPath;
  this.options = options;
}

/** 从 Strategy 继承 */
util.inherits(QiniuStrategy, Strategy);

/**
 * 实现 upload 方法
 * @param  {Object}   file     文件对象
 * @param  {Function} callback 回调函数
 *  - err     Error
 */
QiniuStrategy.prototype.upload = function(file, callback) {
  var client = qn.create({
    accessKey: this.options.accessKey,
    secretKey: this.options.secretKey,
    bucket: this.options.bucket,
    domain: this.options.domain
  });
  
  client.uploadFile(file.path, {
    key: path.join(this.uploadPath, file.name)
  }, function(err) {
    callback(err);
  });
};

/**
 * Module exports
 */
module.exports = exports = QiniuStrategy;