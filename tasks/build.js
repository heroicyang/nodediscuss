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
      default:
        grunt.config('dest', dest);
        grunt.task.run('stylus:development');
        grunt.task.run('copy');
        grunt.task.run('watch');
        break;
    }

    // 响应 `grunt-contrib-watch` 插件的 `watch` 事件，并根据...
    // ...变动的文件来运行相应的任务
    grunt.event.on('watch', function(action, filepath) {
      if (filepath.indexOf('client/styl') !== -1) {
        grunt.task.run('stylus:development');
      }
      if (filepath.indexOf('client/js') !== -1) {
        grunt.task.run('copy:js');
      }
    });
  });
};