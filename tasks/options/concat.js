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
        'client/js/libs/jquery-1.8.3.js',
        'client/js/libs/bootstrap.js'
      ],
      dest: '<%= dest %>/js/lib.js'
    }]
  }
};