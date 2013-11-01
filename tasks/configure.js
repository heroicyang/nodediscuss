/**
 * 根据默认的 config 创建相应环境的配置
 * @author heroic
 */

/**
 * Module dependencies
 */
var path = require('path');

module.exports = exports = function(grunt) {
  var configPath = path.join(__dirname, '../config'),
    defaultConf = path.join(configPath, 'default.js');

  grunt.registerTask('createConfig', 'According to the env option to create config.', function() {
    var env = grunt.option('env') || process.env.NODE_ENV || 'development';
    grunt.file.copy(defaultConf, path.join(configPath, env + '.js'));
    grunt.log.ok(env + ' config is successfully created.');
  });
};