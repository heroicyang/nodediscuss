/**
 * Module dependencies
 */
var http = require('http');
var express = require('express'),
  nconf = require('nconf');

// Configure
require('../config').configure();

// Connect to mongodb
require('./mongodb').connect();

// Load mongoose models
require('../models');

// Load moment language globally
require('moment').lang('zh-cn');

var app = express();

// Load express settings
require('./settings')(app);

// Load routes
require('./routes')(app);

// Start server
http.createServer(app)
  .listen(process.env.PORT || nconf.get('port') || 8080);