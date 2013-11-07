/**
 * Module dependencies
 */
var http = require('http'),
  express = require('express'),
  config = require('../config');

// Connect to mongodb
require('./mongodb').connect();

// Load mongoose models
require('../models');

var app = express();

// Load express settings
require('./settings')(app);

// Load routes
require('./routes')(app);

// Start server
http.createServer(app)
  .listen(process.env.PORT || config.port || 8080);