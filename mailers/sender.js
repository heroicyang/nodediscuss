/**
 * 电子邮件发送服务
 * @author heroic
 */

/**
 * Module dependencies
 */
var nconf = require('nconf');
var nodemailer = require('nodemailer');

/**
 * 邮件发送逻辑
 * @param  {Object}   mailOptions
 * @param  {Function} callback
 */
exports.send = function(mailOptions, callback) {
  if (nconf.get('NODE_ENV') === 'development' ||
      nconf.get('debug') === true) {
    setImmediate(function() {
      console.dir(mailOptions);
      callback && callback(null);
    });
  } else {
    var options = nconf.get('mailer:options');
    var transport = nodemailer.createTransport("SMTP", options);
    transport.sendMail(mailOptions, function(err) {
      callback(err);
    });
  }
};