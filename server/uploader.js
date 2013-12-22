/**
 * 文件上传服务
 * @author heroic
 */

/**
 * Module dependencies
 */
var path = require('path'),
  url = require('url');
var _ = require('lodash');
var Uploader = require('../libs/uploader'),
  LocalStrategy = require('../plugins/local_uploader'),
  QiniuStrategy = require('../plugins/qiniu_uploader');
var config = require('../config');

var uploader = new Uploader();
var strategy = config.uploader.strategy;

/** 加载 LocalStrategy 插件 */
if (strategy === 'local') {
  uploader.use(new LocalStrategy({
    uploadPath: path.join(process.cwd(),
        config.media.cwd, config.media.uploadPath)
  }));
}

/** 加载 QiniuStrategy 插件 */
if (strategy === 'qiniu') {
  uploader.use(new QiniuStrategy({
    uploadPath: path.join(config.media.cwd, config.media.uploadPath),
    accessKey: config.uploader.options.accessKey,
    secretKey: config.uploader.options.secretKey,
    bucket: config.uploader.options.bucket,
    domain: config.uploader.options.domain
  }));
}

/** 暴露上传文件的方法 */
exports.upload = function(files, callback) {
  uploader.upload(strategy, files, callback);
};

/** 处理上传图片的请求 */
exports.uploadImageHandler = function() {
  var mediaURL;
  if (config.media.domain) {
    mediaURL = config.media.domain +
        path.join(config.media.cwd, config.media.uploadPath);
  } else {
    // 在没有指定 media.domain 时，会将 media.cwd 配置为 express.static
    mediaURL = url.format({
      protocol: 'http',
      host: config.host,
      pathname: config.media.uploadPath
    });
  }

  return function(req, res, next) {
    exports.upload(req.files.images, function(err, uploadedFiles, failedFiles) {
      if (err) {
        return next(err);
      }
      
      if (!_.isArray(uploadedFiles)) {
        uploadedFiles = [uploadedFiles];
      }

      uploadedFiles = _.map(uploadedFiles, function(file) {
        file.url = mediaURL + '/' + file.name;
        return file;
      });

      var results = _.map(uploadedFiles.concat(failedFiles), function(file) {
        return _.pick(file, [
          'name', 'originalFilename', 'url', 'size', 'type', 'error'
        ]);
      });

      res.send(JSON.stringify(results));
    });
  };
};