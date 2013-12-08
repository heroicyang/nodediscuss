/**
 * `grunt-contrib-cssmin` 插件的配置
 * @author heroic
 */

module.exports = exports = {
  min: {
    options: {
      banner: '<%= banner %>',
      keepSpecialComments: 0
    },
    files: {
      '<%= dest %>/css/style.min.css': ['<%= dest %>/css/style.css']
    }
  }
};