const createHandler = require('azure-function-express').createHandler
const express = require('express')
const i18n = require('i18n')
const bodyParser = require('body-parser')

i18n.configure({
  locales: ['en', 'de'],
  directory: __dirname +'/locales'
})

// Router config

const groupHierarchy = require('./Router/groupRouter/Group')
const reportsTemplate = require('./Router/TemplatesRouter/Template')
const summaryreport = require('./Router/storeRouter/Store')

const app = express()
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

/**
 * start  Group hierarchy - Routing files
 */
app.use('/api/group', groupHierarchy)

// summary Report
app.use('/api/report', summaryreport)

// Report Templates
app.use('/api/reportTemplate', reportsTemplate)

// app.get('/api/sendmail', (req, res) => {

// })
/**
 * end
 */

// Binds the express app to an Azure Function handler
module.exports = createHandler(app)
