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

    grunt.config('dest', dest);
    grunt.task.run('clean');

    switch(target) {
      case 'pro':
      case 'production':
      case 'release':
        grunt.log.writeln('Building client...');
        break;
      case 'dev':
      case 'development':
      default:
        grunt.task.run('stylus:development');
        grunt.task.run('concat:development');
        grunt.task.run('copy');
        grunt.task.run('watch:build');
        watching();
        break;
    }
  });

  function watching() {
    // 响应 `grunt-contrib-watch` 插件的 `watch` 事件，并根据...
    // ...变动的文件来运行相应的任务
    grunt.event.on('watch', function(action, filepath, target) {
      if (target !== 'build') {
        return;
      }
      if (filepath.indexOf('client/styl') !== -1) {
        grunt.task.run('clean:stylus');
        grunt.task.run('stylus:development');
      }
      if (filepath.indexOf('client/js') !== -1) {
        grunt.task.run('clean:js');
        grunt.task.run('concat:development');
        grunt.task.run('copy:js');
      }
      if (filepath.indexOf('client/img') !== -1) {
        grunt.task.run('clean:img');
        grunt.task.run('copy:img');
      }
    });
  }
};