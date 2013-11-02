/**
 * 单元测试任务
 * @author heroic
 */

module.exports = exports = function(grunt) {
  grunt.registerTask('test', function() {
    var target = grunt.option('target');
    switch(target) {
      case 'model':
        grunt.task.run('simplemocha:model');
        break;
      case 'api':
        grunt.log.writeln('Running api tests...');
        break;
      case 'controller':
        grunt.log.writeln('Running controller tests...');
        break;
      default:
        grunt.task.run('simplemocha');
    }
  });
};