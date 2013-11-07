module.exports = exports = {
  development: {
    options: {
      'include css': true
    },
    files: [{
      src: ['client/styl/style.styl'],
      dest: '<%= dest %>/css/style.css'
    }]
  }
};