/**
 * 单元测试任务
 * @author heroic
 */

module.exports = exports = function(grunt) {
  grunt.registerTask('test', function() {
    grunt.task.run([
      'mochaTest:test',
      'mochaTest:travis-cov'
    ]);
  });

  grunt.registerTask('testCovHtml', function() {
    grunt.task.run([
      'mochaTest:test',
      'mochaTest:html-cov'
    ]);
  });

  grunt.registerTask('testCoveralls', function() {
    grunt.task.run('mochaTest:coveralls');
  });
};