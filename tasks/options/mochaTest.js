module.exports = exports = {
  test: {
    options: {
      ui: 'bdd',
      require: [
        'should',
        'test/blanket'
      ],
      reporter: 'spec'
    },
    src: ['test/models/*.test.js']
  },
  'html-cov': {
    options: {
      reporter: 'html-cov',
      quiet: true,
      captureFile: 'coverage.html'
    },
    src: ['test/models/*.test.js']
  },
  'travis-cov': {
    options: {
      reporter: 'travis-cov'
    },
    src: ['test/models/*.test.js']
  }
};