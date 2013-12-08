/**
 * `grunt-contrib-uglify` 插件配置
 * @author heroic
 */

module.exports = exports = {
  options: {
    banner: '<%= banner %>'
  },
  dist: {
    src: '<%= dest %>/js/app.js',
    dest: '<%= dest %>/js/app.min.js'
  }
};