/**
 * 将文件上传至七牛云存储
 * @author  heroic
 */

/**
 * Module dependencies
 */
var path = require('path');
var qn = require('qn');
var extend = require('../extend'),
  UploaderStrategy = extend.UploaderStrategy;

/**
 * QiniuStrategy constructor
 * @param {Object} options
 *  - uploadPath     文件上传到哪个目录
 *  - accessKey      七牛云存储 AK
 *  - secretKey      七牛云存储 SK
 *  - bucket         要存储文件的空间
 *  - domain         该空间的域名
 */
function QiniuStrategy(options) {
  options = options || {};
  UploaderStrategy.call(this);
  this.name = 'qiniu';
  this.uploadPath = options.uploadPath;
  this.options = options;
}

/** 从 Strategy 继承 */
extend(QiniuStrategy, UploaderStrategy);

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