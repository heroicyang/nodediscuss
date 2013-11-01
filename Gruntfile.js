var glob = require('glob'),
  path = require('path'),
  join = path.join;

module.exports = function(grunt) {
  var config = {
    pkg: grunt.file.readJSON('package.json')
  };
  grunt.util._.extend(config, loadConfig('./tasks/options/'));
  grunt.initConfig(config);

  // load all grunt tasks matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);

  // load all grunt custom tasks
  grunt.loadTasks('tasks');
};

function loadConfig(configPath) {
  var config = {};

  glob.sync('*', { cwd: configPath })
    .forEach(function(configFile) {
      var prop = configFile.replace(/\.js$/, '');
      config[prop] = require(join(__dirname, configPath, configFile));
    });

  return config;
}