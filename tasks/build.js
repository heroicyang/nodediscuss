/**
 * 构建客户端，编译 stylus，合并压缩 css、js，拷贝 fonts 和 images
 * @author heroic
 */

/**
 * Module dependencies
 */
var path = require('path');

module.exports = exports = function(grunt) {
  grunt.registerTask('build', function() {
    var target = grunt.option('target'),
      dest = grunt.option('dest') || 'assets';
    dest = path.join(process.cwd(), dest);

    switch(target) {
      case 'dev':
      case 'development':
        grunt.config('dest', dest);
        grunt.task.run('stylus:development');
        grunt.task.run('copy');
        grunt.task.run('watch');
        break;
    }

    grunt.event.on('watch', function(action, filepath) {
      switch(path.dirname(filepath)) {
        case 'client/styl':
          grunt.task.run('stylus:development');
          break;
      }
    });
  });
};