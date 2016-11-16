const express             = require('express');
const cors                = require('cors');
const bodyParser          = require('body-parser');
const genericErrorHandler = require('./generic-error-handler');
const requestLogger       = require('./logger').requestLogger;
const openapiGenerator    = require('../lib/openapi-generator');
const openapi             = require('express-openapi');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(genericErrorHandler);
app.use(requestLogger);
const openapiConfig = openapiGenerator(app);
openapi.initialize(openapiConfig);
app.use(genericErrorHandler);

module.exports = app;
