/**
 * `grunt-contrib-clean` 插件的相关配置
 * 用于在前端构建时先清除掉之前的构建文件
 * @author heoric
 */

module.exports = exports = {
  stylus: ['<%= dest %>/css'],
  js: ['<%= dest %>/js'],
  img: ['<%= dest %>/img']
};