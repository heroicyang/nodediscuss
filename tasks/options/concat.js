/**
 * `grunt-contrib-concat` 插件的相关配置
 * 合并前端的 js 文件，生成指定目录的 js 文件
 * 目标目录通过 `grunt.config('dest')` 获取，...
 * ...在配置中则采取模板的方式获取 `<%= dest %>`
 * @author heroic
 */

module.exports = exports = {
  development: {
    files: [{
      src: [
        'client/js/lib/jquery.js',
        'client/js/lib/json2.js',
        'client/js/lib/lodash.underscore.js',
        'client/js/lib/backbone.js',
        'client/js/lib/bootstrap.js',
        'client/js/lib/marked.js',
        'client/js/lib/highlight.js',
        'client/js/lib/jquery.ui.widget.js',
        'client/js/lib/jquery.iframe-transport.js',
        'client/js/lib/jquery.fileupload.js',
        'client/js/lib/require.js'
      ],
      dest: '<%= dest %>/js/lib.js'
    }]
  }
};