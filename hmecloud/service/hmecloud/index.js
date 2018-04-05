const createHandler = require('azure-function-express').createHandler
const express = require('express')
const i18n = require('i18n')
const bodyParser = require('body-parser')

i18n.configure({
  locales: ['en', 'de'],
  directory: __dirname + '/locales'
})

// Router config

const groupRouter = require('./Router/GroupRouter')
const reportsTemplate = require('./Router/TemplateRouter')
const summaryReport = require('./Router/StoreRouter')

// JWT - Auth config
const authentication = require('./Router/AuthenticationRouter')

const app = express()
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
