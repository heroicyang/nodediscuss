/**
 * `grunt-mocha-test` 插件的配置
 * @author heroic
 */

module.exports = exports = {
  test: {
    options: {
      ui: 'bdd',
      require: [
        'should',
        'test/instrument'
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
  },
  coveralls: {
    options: {
      require: [
        'should',
        'test/instrument'
      ],
      reporter: 'mocha-lcov-reporter'
    },
    src: ['test/models/*.test.js']
  }
};