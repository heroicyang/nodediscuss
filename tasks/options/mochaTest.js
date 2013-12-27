module.exports = exports = {
  test: {
    options: {
      ui: 'bdd',
      require: [
        'should',
        'blanket'
      ],
      reporter: 'spec'
    },
    src: ['test/models/*.test.js']
  },
  coverage: {
    options: {
      reporter: 'html-cov',
      quiet: true,
      captureFile: 'coverage.html'
    },
    src: ['test/models/*.js']
  }
};