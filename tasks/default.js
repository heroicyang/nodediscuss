/**
 * 注册 grunt 默认任务
 * @author heroic
 */

module.exports = exports = function(grunt) {
  grunt.registerTask('default', function() {
    grunt.log.writeln('Running default task...');
  });
};