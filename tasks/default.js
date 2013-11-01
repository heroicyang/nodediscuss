/**
 * grunt 默认任务，显示各种 task 的运行方式
 * @author heroic
 */

module.exports = exports = function(grunt) {
  grunt.registerTask('default', function() {
    grunt.log.writeln('\nUsage:');

    // create config
    grunt.log.writetableln(
      [40, 60],
      [
        indent('grunt createConfig [options]', 4),
        'create config [development]'
      ]
    );
    grunt.log.writeln(indent('Options:', 8));
    grunt.log.writetableln(
      [40, 60],
      [
        indent('--env=<env>', 12),
        'create the given env config'
      ]
    );
    grunt.log.writeln();

    // run unit test
    grunt.log.writetableln(
      [40, 60],
      [
        indent('grunt test [options]', 4),
        'run unit tests [all]'
      ]
    );
    grunt.log.writeln(indent('Options:', 8));
    grunt.log.writetableln(
      [40, 60],
      [
        indent('--target=<target>', 12),
        'only run tests matching <target> (model|api|controller)'
      ]
    );
  });
};

function indent(text, spaces) {
  spaces = new Array((spaces || 0) + 1);
  return spaces.join('\u0020') + text;
}