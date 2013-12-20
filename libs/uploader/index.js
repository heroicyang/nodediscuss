/**
 * 文件上传类
 * @author heroic
 */

/**
 * Module dependencies
 */
var util = require('util'),
  path = require('path'),
  fs = require('fs'),
  uuid = require('node-uuid'),
  Strategy = require('./strategy');

/**
 * Module exports
 */
module.exports = exports = Uploader;

/**
 * Expose `Strategy` class
 */
exports.Strategy = Strategy;

/**
 * Uploader constructor
 */
function Uploader() {
  this._strategies = {};
}

/**
 * 使用给定的上传策略，如果提供了 `name` 参数，则会覆盖 `strategy` 的 `name` 属性
 *
 * Examples:
 *
 *    uploader.use(new LocalStrategy());
 *    uploader.use('local', new LocalStrategy());
 *    
 * @param  {String|Object} name     策略名称
 * @param  {Object} strategy        上传策略对象
 * @return {Uploader}
 */
Uploader.prototype.use = function(name, strategy) {
  if (!strategy) {
    strategy = name;
    name = strategy.name;
  }
  if (!name) {
    throw new Error('Uploader strategies must be have a name');
  }

  this._strategies[name] = strategy;
  return this;
};

/**
 * 从 Uploader 卸载指定的上传策略
 *
 * Examples:
 *
 *    uploader.unuse('local');
 * 
 * @param  {String} name  策略名称
 * @return {Uploader}
 */
Uploader.prototype.unuse = function(name) {
  delete this._strategies[name];
  return this;
};

/**
 * 根据指定的文件上传策略来上传文件
 * @param  {String}   strategy  文件上传策略名称
 * @param  {Object|Array}   files    文件对象或文件对象数组
 * @param  {Function} callback  回调函数
 *  - err    这个值基本上总是为 null ，因为文件上传的错误应该收集起来返回给客户端，...
 *            ...而且也不应该打断后面的文件上传。
 *  - uploadedFiles    上传成功的文件对象或文件数组
 *  - failedFiles    上传失败的文件对象或文件数组
 */
Uploader.prototype.upload = function(strategy, files, callback) {
  var name = strategy;
  strategy = this._strategies[name];
  if (!strategy) {
    return callback(new Error('没有该文件上传策略：' + name));
  }

  if (!util.isArray(files)) {
    files = [files];
  }

  var fileCount = files.length,
    uploadedFiles = [],
    failedFiles = [];
  files.forEach(function(file) {
    var uid = uuid.v1(),
      fileExt = path.extname(file.name);
    // 包装一下 callback，在调用时先将文件对象从本地磁盘删除
    // express 的 multipart 中间件在收到请求后会把文件存储在本地的 /tmp 或者配置时指定的目录
    var callbackWrap = function() {
      var args = arguments;
      fs.rmdir(file.path, function(err) {
        // 这里暂时不处理删除文件出错的情况，毕竟这不影响真正的业务逻辑
        return callback.apply(null, args);
      });
    };
    // 覆盖文件原有文件名
    file._name = file.name;
    file.name = uid + fileExt;

    // 使用对应的上传策略上传图片
    strategy.upload(file, function(err) {
      if (err) {
        // 只做错误收集，然后继续上传后面的文件
        file.error = err;
        failedFiles.push(file);
      } else {
        uploadedFiles.push(file);
      }

      fileCount -= 1;
      // 等到计数器变为 0 才去调用回调函数，代表所有文件都已上传
      if (fileCount === 0) {
        callbackWrap(null, uploadedFiles, failedFiles);
      }
    });
  });
};