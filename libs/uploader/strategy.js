/**
 * 文件上传策略接口，其它上传策略需继承并实现
 * @author heroic
 */

/**
* 构造函数
*/
function Strategy() {
}

/**
* 上传文件
* @param  {Object} file  文件对象
*/
Strategy.prototype.upload = function(file, callback) {
  throw new Error('Strategy#upload must be overridden by subclass');
};

/**
* Module exports
*/
module.exports = exports = Strategy;