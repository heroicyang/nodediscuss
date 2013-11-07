/**
 * `grunt-simple-mocha` 插件的相关配置
 * 运行各种单元测试
 * @author heroic
 */
module.exports = exports = {
  options: {
    ignoreLeaks: true,
    ui: 'bdd',
    reporter: 'spec'
  },
  model: {
    src: ['test/model/*.test.js']
  },
  api: {
    src: []
  }
};