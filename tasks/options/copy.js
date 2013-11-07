module.exports = exports = {
  js: {
    files: [{
      expand: true,
      cwd: 'client/js/',
      src: ['**'],
      dest: '<%= dest %>/js/'
    }]
  },
  font: {
    files: [{
      expand: true,
      cwd: 'client/fonts/',
      src: ['*'],
      dest: '<%= dest %>/fonts/'
    }]
  },
  img: {
    files: [{
      expand: true,
      cwd: 'client/img/',
      src: ['**'],
      dest: '<%= dest %>/img/'
    }]
  }
};