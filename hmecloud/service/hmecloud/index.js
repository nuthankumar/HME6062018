const createHandler = require('azure-function-express').createHandler

var express = require('express');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-express-middleware');
const Backend = require('i18next-node-fs-backend');

const bodyParser = require('body-parser');

// Router config

const groupRouter = require('./Router/GroupRouter')
const reportsTemplate = require('./Router/TemplateRouter')
const summaryReport = require('./Router/StoreRouter')

// JWT - Auth config
const authentication = require('./Router/AuthenticationRouter')

const app = express()

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: __dirname + '/i18n/{{lng}}/{{ns}}.json',
      addPath: __dirname + '/i18n/{{lng}}/{{ns}}.missing.json'
    },
    fallbackLng: 'en',
    preload: ['en', 'fr'],
    saveMissing: true
  });

  app.use(i18nextMiddleware.handle(i18next));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

/**
 * start  Group hierarchy - Routing files
 */
app.use('/api/group', groupRouter)

// summary Report
app.use('/api/report', summaryReport)

// Report Templates
app.use('/api/reportTemplate', reportsTemplate)

app.use('/api/auth', authentication)
/**
 * end
 */

// Binds the express app to an Azure Function handler
module.exports = createHandler(app)
