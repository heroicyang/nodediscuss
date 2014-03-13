/**
 * 文件上传服务
 * @author heroic
 */

/**
 * Module dependencies
 */
var path = require('path'),
  url = require('url');
var _ = require('lodash'),
  nconf = require('nconf');
var uploader = require('express-fileuploader'),
  LocalStrategy = uploader.LocalStrategy,
  QiniuStrategy = require('express-fileuploader-qiniu');

var strategy = nconf.get('uploader:strategy'),
  options = nconf.get('uploader:options'),
  uploadPath = path.join(nconf.get('media:cwd'), nconf.get('media:uploadPath'));

/** 加载 LocalStrategy 插件 */
if (strategy === 'local') {
  var domain = nconf.get('media:domain') || url.format({
    protocol: 'http',
    host: nconf.get('host')
  });
  uploader.use(new LocalStrategy({
    uploadPath: uploadPath,
    baseUrl: url.resolve(domain, nconf.get('media:uploadPath'))
  }));
}

/** 加载 QiniuStrategy 插件 */
if (strategy === 'qiniu') {
  uploader.use(new QiniuStrategy({
    uploadPath: uploadPath,
    options: options
  }));
}

/** 暴露上传文件的方法 */
exports.upload = function(files, callback) {
  uploader.upload(strategy, files, callback);
};

/** 处理上传图片的请求 */
exports.uploadImageHandler = function(req, res, next) {
  exports.upload(req.files.images, function(err, files) {
    if (err) {
      return next(err);
    }

    var results = _.map(files, function(file) {
      return _.pick(file, [
        'name', 'originalFilename', 'url', 'size', 'type', 'error'
      ]);
    });

    res.send(JSON.stringify(results));
  });
};
