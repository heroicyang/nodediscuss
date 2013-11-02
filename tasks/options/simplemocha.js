module.exports = exports = {
  options: {
    ignoreLeaks: true,
    ui: 'bdd',
    reporter: 'spec'
  },
  model: {
    src: ['test/model/*.test.js']
  },
  api: {
    src: []
  }
};