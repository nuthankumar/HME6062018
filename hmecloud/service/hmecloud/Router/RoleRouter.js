const express = require('express')
const router = express.Router()
const controller = require('../Controllers/RoleController')
const authenticator = require('../Controllers/AuthenticationController')

const handelResult = (result, response) => {
    if (result.status === true) {
        response.status(200).send(result)
    } else {
        response.status(204).send(result)
    }
}

/**
 * This service  using getAll users
 * @param  {endpoint} getAll webservice name
 * @param  {funct} authenticator  check JWT authentication
 * @param  {request} request  from  user request
 * @param  {response} callback Function will be called once the request executed.
 * @public
 */
router.get('/getAll', authenticator, (request, response) => {
    controller.getAll(request, result => handelResult(result, response))
})


module.exports = router
