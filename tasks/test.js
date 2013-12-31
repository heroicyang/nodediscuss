/**
 * 单元测试任务
 * @author heroic
 */

module.exports = exports = function(grunt) {
  grunt.registerTask('test', function() {
    process.env.NODE_ENV = 'test';
    grunt.task.run([
      'mochaTest:test',
      'mochaTest:travis-cov'
    ]);
  });

  grunt.registerTask('testCovHtml', function() {
    process.env.NODE_ENV = 'test';
    grunt.task.run([
      'mochaTest:test',
      'mochaTest:html-cov'
    ]);
  });

  grunt.registerTask('testCoveralls', function() {
    process.env.NODE_ENV = 'test';
    grunt.task.run('mochaTest:coveralls');
  });
};