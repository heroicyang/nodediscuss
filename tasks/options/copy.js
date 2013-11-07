/**
 * `grunt-contrib-copy` 插件的相关配置
 * 将前端静态资源拷贝到目标目录，目标目录通过 `grunt.config('dest')` 获取，...
 * ...在配置中则采取模板的方式获取 `<%= dest %>`
 * @author heroic
 */

module.exports = exports = {
  js: {
    files: [{
      expand: true,
      cwd: 'client/js/',
      src: ['*.js'],
      dest: '<%= dest %>/js/'
    }]
  },
  font: {
    files: [{
      expand: true,
      cwd: 'client/fonts/',
      src: ['*'],
      dest: '<%= dest %>/fonts/'
    }]
  },
  img: {
    files: [{
      expand: true,
      cwd: 'client/img/',
      src: ['**'],
      dest: '<%= dest %>/img/'
    }]
  }
};