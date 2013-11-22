/**
 * 文件上传类
 * @author heroic
 */

/**
 * Module dependencies
 */
var util = require('util'),
  path = require('path'),
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
 *  - err          如果是单一文件上传，只要上传出错，该 err 即代表错误对象；
 *                 如果是批量文件上传，这个值总是为 null ，因为此时不应该打断后面的文件上传。
 *  - file|files   文件名变更之后的文件对象或文件数组
 *  - errors       本次上传的文件中出错的文件及其错误信息。如果是上传单一文件，则该值始终为 null
 *    - filename      原来的文件名
 *    - err           具体的出错原因
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
    errors = {};
  files.forEach(function(file) {
    var uid = uuid.v1(),
      fileExt = path.extname(file.name);
    // 覆盖文件原有文件名
    file._name = file.name;
    file.name = uid + fileExt;

    // 使用对应的上传策略上传图片
    strategy.upload(file, function(err) {
      if (err) {
        // 此时需要再判断一下，如果本次只上传一个文件，且已经出错了
        // 则直接调用回调函数，上面的 forEach 本身也没有数据继续往下执行了
        if (fileCount === 1) {
          return callback(err);
        }
        // 否则只做错误收集，然后继续上传后面的文件
        errors[file._name] = err;
      }

      // 此时还要再判断一下，如果本次只上传一个文件，而且也没有出错
      // 那也直接调用回调函数，告诉其上传成功
      if (fileCount === 1) {
        return callback(null, file);
      }

      // 如果是批量文件上传，不管出错与否，都得等到计数器变为 0 才去调用回调函数
      fileCount -= 1;
      if (fileCount === 0) {
        callback(null, files, errors);
      }
    });
  });
};