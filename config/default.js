var path = require('path');

module.exports = exports = {
  debug: false,
  host: 'localhost',
  session: {
    secret: '',
    maxAge: 604800000
  },
  mongo: {
    db: 'cnodeclub',
    servers: [
      '127.0.0.1:27017'
    ]
  },
  // 基于当前工作目录，即 `process.cwd()`
  static: {
    host: '',
    rootDir: '/assets',
    uploadDir: '/assets/uploads'
  }
};