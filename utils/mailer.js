/**
 * Module dependencies
 */
var Mailer = require('../plugins/mailer'),
  mailer = new Mailer(),
  NodeMailerStrategy = require('../plugins/nodemailer'),
  config = require('../config');

if (process.env.NODE_ENV === 'production') {
  mailer.unuse('log');
}

mailer.use(new NodeMailerStrategy(config.mailer.options));

module.exports = exports = mailer;