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

  grunt.registerTask('createConfig', function() {
    var env = grunt.option('env') || process.env.NODE_ENV || 'development';

    var config = grunt.file.read(defaultConf, { encoding: 'utf8' });
    config = config.replace(/secret: '(.*)'/, function(group, p1) {
      return 'secret: \'' + createRandomString() + '\'';
    });
    grunt.file.write(path.join(configPath, env + '.js'), config, { encoding: 'utf8' });
    grunt.log.ok(env + ' config is successfully created.');
  });
};

/**
* Random string for secret key
* @return {String} random string
*/
function createRandomString() {
  var chars = '0123456789;[ABCDEFGHIJKLM]NOPQRSTUVWXTZ#&*abcdefghijklmnopqrstuvwxyz',
    strLength = 10,
    randomString = '';
  for (var i = 0; i < strLength; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    randomString += chars.substring(rnum, rnum + 1);
  }
  return randomString;
}