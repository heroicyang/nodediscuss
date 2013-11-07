/**
 * Module dependencies
 */
var http = require('http'),
  express = require('express');

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
  .listen(process.env.PORT || 8080);