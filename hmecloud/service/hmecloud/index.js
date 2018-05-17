const createHandler = require('azure-function-express').createHandler

const express = require('express')
const i18next = require('i18next')
const i18nextMiddleware = require('i18next-express-middleware')
const Backend = require('i18next-node-fs-backend')
const path = require('path')
const bodyParser = require('body-parser')

// Router config

const groupRouter = require('./Router/GroupRouter')
const reportsTemplate = require('./Router/TemplateRouter')
const newReports = require('./Router/ReportsRouter')
const summaryReport = require('./Router/StoreRouter')
const userRouter = require('./Router/UserRouter')
const roleRouter = require('./Router/RoleRouter')
const permissionRouter = require('./Router/PermissionRouter')
const countryRouter = require('./Router/CountryRouter')

// JWT - Auth config
const authentication = require('./Router/AuthenticationRouter')

const app = express()

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: path.dirname(__dirname) + '/i18n/{{lng}}/{{ns}}.json',
      addPath: path.dirname(__dirname) + '/i18n/{{lng}}/{{ns}}.missing.json'
    },
    fallbackLng: 'en',
    preload: ['en', 'fr'],
    saveMissing: true
  })

app.use(i18nextMiddleware.handle(i18next))

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

// Report Templates
app.use('/api/newReports', newReports)

// Users
app.use('/api/user', userRouter)

// Roles
app.use('/api/role', roleRouter)

// Permissions
app.use('/api/permission', permissionRouter)

// Countries
app.use('/api/country', countryRouter)

app.use('/api/auth', authentication)
/**
 * end
 */

// Binds the express app to an Azure Function handler
module.exports = createHandler(app)
