/**
 * 根据默认的 config 创建相应环境的配置
 * @author heroic
 */

module.exports = exports = function(grunt) {
  grunt.registerTask('createConfig', function() {
    var env = grunt.option('env') || process.env.NODE_ENV || 'development';
    var defaultConf = JSON.parse(grunt.file.read('config/default.json'));
    defaultConf.session.secret = createRandomString();

    grunt.file.write('config/' + env + '.json',
        JSON.stringify(defaultConf, null, 2));
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