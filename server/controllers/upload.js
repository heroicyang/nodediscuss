/**
 * 文件上传控制器
 * @author heroic
 */

/**
 * Module dependencies
 */
var path = require('path'),
  url = require('url');
var _ = require('lodash');
var config = require('../../config'),
  uploader = require('../uploader');

var uploadURL;
if (config.media.domain) {
  uploadURL = config.media.domain +
      path.join(config.media.cwd, config.media.uploadPath);
} else {
  // 因为在没有指定 host 的情况下，会将 media.cwd 配置为 express.static
  uploadURL = url.format({
    protocol: 'http',
    host: config.host,
    pathname: config.media.uploadPath
  });
}

exports.uploadImage = function(req, res, next) {
  uploader.upload(req.files.images, function(err, uploadedFiles, failedFiles) {
    if (err) {
      return next(err);
    }
    
    if (!_.isArray(uploadedFiles)) {
      uploadedFiles = [uploadedFiles];
    }

    uploadedFiles = _.map(uploadedFiles, function(file) {
      file.url = uploadURL + '/' + file.name;
      return file;
    });

    var results = _.map(uploadedFiles.concat(failedFiles), function(file) {
      return _.pick(file, [
        'name', 'originalFilename', 'url', 'size', 'type', 'error'
      ]);
    });

    res.send(JSON.stringify({
      success: true,
      files: results
    }));
  });
};