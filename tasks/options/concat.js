/**
 * `grunt-contrib-concat` 插件的相关配置
 * 合并前端的 js 文件，生成指定目录的 js 文件
 * 目标目录通过 `grunt.config('dest')` 获取，...
 * ...在配置中则采取模板的方式获取 `<%= dest %>`
 * @author heroic
 */

var libs = [
  'client/js/vendor/jquery.js',
  'client/js/vendor/json2.js',
  'client/js/vendor/lodash.underscore.js',
  'client/js/vendor/backbone.js',
  'client/js/vendor/bootstrap.js',
  'client/js/vendor/marked.js',
  'client/js/vendor/highlight.js',
  'client/js/vendor/jquery.ui.widget.js',
  'client/js/vendor/jquery.iframe-transport.js',
  'client/js/vendor/jquery.fileupload.js',
  'client/js/vendor/require.js'
];

module.exports = exports = {
  vendor: {
    files: [{
      src: libs,
      dest: '<%= dest %>/js/vendor.js'
    }]
  },
  app: {
    files: [{
      src: libs.concat([
        'client/js/app.js',
        'client/js/common/*.js',
        'client/js/app/*.js'
      ]),
      dest: '<%= dest %>/js/app.js'
    }]
  },
  admin: {
    files: [{
      src: ['client/js/app/admin/*.js'],
      dest: '<%= dest %>/js/admin.js'
    }]
  }
};