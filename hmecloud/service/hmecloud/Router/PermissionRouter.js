const express = require('express')
const router = express.Router()
const controller = require('../Controllers/PermissionController')
const authenticator = require('../Controllers/AuthenticationController')
const hmeRouter = require('./HmeRouter')

/**
 * This service  using getAll users
 * @param  {endpoint} getAll webservice name
 * @param  {funct} authenticator  check JWT authentication
 * @param  {request} request  from  user request
 * @param  {response} callback Function will be called once the request executed.
 * @public
 */
router.get('/getAll', authenticator, (request, response) => {
    controller.getAll(request, result => hmeRouter.handelResult(result, response))
})

module.exports = router
