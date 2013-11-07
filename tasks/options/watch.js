/**
 * `grunt-contrib-watch` 插件的相关配置
 * 主要是监视客户端文件的改动，以便自动构建，方便开发
 * @author heroic
 */

module.exports = exports = {
  options: {
    spawn: false
  },
  build: {
    files: 'client/**/*'
  }
};