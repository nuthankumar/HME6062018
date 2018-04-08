const createHandler = require('azure-function-express').createHandler
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/**
 * This Method  using implement of Authentication controller
 * @param  {filename} Authenticationcontroller from controller floder
 * @public
 */
const authentication = require('./Router/AuthenticationRouter')

/**
 * This Webservices Representing JWT Authentication
 * @param  {filename} authentication method name from Controller
 * @public
 */

app.use('/api/authentication', authentication)

module.exports = createHandler(app)
