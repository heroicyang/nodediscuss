/**
 * `grunt-contrib-concat` 插件的相关配置
 * 合并前端的 js 文件，生成指定目录的 js 文件
 * 目标目录通过 `grunt.config('dest')` 获取，...
 * ...在配置中则采取模板的方式获取 `<%= dest %>`
 * @author heroic
 */

var vendors = [
  'bower_components/jquery/jquery.js',
  'bower_components/json2/json2.js',
  'bower_components/lodash/dist/lodash.underscore.js',
  'bower_components/backbone/backbone.js',
  'bower_components/bootstrap/js/alert.js',
  'bower_components/bootstrap/js/button.js',
  'bower_components/bootstrap/js/dropdown.js',
  'bower_components/bootstrap/js/modal.js',
  'bower_components/bootstrap/js/tooltip.js',
  'bower_components/bootstrap/js/tab.js',
  'bower_components/bootstrap/js/collapse.js',
  'bower_components/bootstrap/js/transition.js',
  'bower_components/marked/lib/marked.js',
  'bower_components/highlightjs/highlight.pack.js',
  'bower_components/jquery-file-upload/js/vendor/jquery.ui.widget.js',
  'bower_components/jquery-file-upload/js/jquery.iframe-transport.js',
  'bower_components/jquery-file-upload/js/jquery.fileupload.js',
  'bower_components/responsive-nav/responsive-nav.js',
  'bower_components/requirejs/require.js'
];

module.exports = exports = {
  vendor: {
    files: [{
      src: vendors,
      dest: '<%= dest %>/js/vendor.js'
    }]
  },
  app: {
    files: [{
      src: vendors.concat([
        'client/js/app.js',
        'client/js/app/common/*.js',
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