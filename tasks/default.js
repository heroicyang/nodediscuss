/**
 * grunt 默认任务，显示各种 task 的运行方式
 * @author heroic
 */

module.exports = exports = function(grunt) {
  grunt.registerTask('default', function() {
    grunt.log.writeln('\nUsage:');

    // create config
    grunt.log.writetableln(
      [36, 50],
      [
        indent('grunt createConfig [options]', 2),
        'create config [development]'
      ]
    );
    grunt.log.writeln(indent('Options:', 4));
    grunt.log.writetableln(
      [36, 50],
      [
        indent('--env=<env>', 6),
        'create the given <env> config'
      ]
    );
    grunt.log.writeln();

    // run unit test
    grunt.log.writetableln(
      [36, 50],
      [
        indent('grunt test [options]', 2),
        'run unit tests [all]'
      ]
    );
    grunt.log.writeln(indent('Options:', 4));
    grunt.log.writetableln(
      [36, 50],
      [
        indent('--target=<target>', 6),
        'only run tests matching <target> (model|api|controller)'
      ]
    );
    grunt.log.writeln();

    // build
    grunt.log.writetableln(
      [36, 50],
      [
        indent('grunt build [options]', 2),
        'build front-end [development]'
      ]
    );
    grunt.log.writeln(indent('Options:', 4));
    grunt.log.writetableln(
      [36, 50],
      [
        indent('--target=<target>', 6),
        'build front-end for <target> (development|dev|production|pro)'
      ]
    );
    grunt.log.writetableln(
      [36, 50],
      [
        indent('--dest=<dest>', 6),
        '<dest> directory for build. [assets]'
      ]
    );
  });
};

function indent(text, spaces) {
  spaces = new Array((spaces || 0) + 1);
  return spaces.join('\u0020') + text;
}