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
const authentication = require('./Controller/AuthenticationController')

/**
 * This Webservices Representing JWT Authentication
 * @param  {filename} authentication method name from Controller
 * @public
 */

app.use('/api/auth', authentication)

module.exports = createHandler(app)
