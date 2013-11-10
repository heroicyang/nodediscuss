/**
 * `grunt-contrib-stylus` 插件的相关配置
 * 编译前端的 stylus 样式文件，生成指定目录的 css 文件
 * 目标目录通过 `grunt.config('dest')` 获取，...
 * ...在配置中则采取模板的方式获取 `<%= dest %>`
 * @author heroic
 */

module.exports = exports = {
  development: {
    options: {
      compress: true,
      'include css': true
    },
    files: [{
      src: ['client/styl/index.styl'],
      dest: '<%= dest %>/css/style.css'
    }]
  }
};