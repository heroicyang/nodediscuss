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
  static: {
    host: '',
    rootDir: path.join(__dirname, '../public'),
    uploadDir: path.join(__dirname, '../public/uploads/')
  }
};