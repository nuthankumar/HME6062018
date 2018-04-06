const express = require('express')
const router = express.Router()
const validator = require('../Validators/TemplateValidator')
const authenticator = require('../Controllers/AuthenticationController')

const handelResult = (result, response) => {
  if (result.status === true) {
    response.status(200).send(result)
  } else {
    response.status(400).send(result)
  }
}
/**
 * This service  using create template
 * @param  {endpoint} create webservice name
 * @param  {funct} authenticator  check JWT authentication
 * @param  {request} request  from  user request
 * @param  {response} callback Function will be called once the request executed.
 * @public
 */
router.post('/create', authenticator, (request, response) => {
  validator.createTemplate(request, result => handelResult(result, response))
})

/**
 * This service  using get template
 * @param  {endpoint} get webservice name
 * @param  {funct} authenticator  check JWT authentication
 * @param  {request} request  from  user request
 * @param  {response} callback Function will be called once the request executed.
 * @public
 */
router.get('/get', authenticator, (request, response) => {
  validator.getTemplate(request.query, result => handelResult(result, response))
})

/**
 * This service  using getAll templates
 * @param  {endpoint} getAll webservice name
 * @param  {funct} authenticator  check JWT authentication
 * @param  {request} request  from  user request
 * @param  {response} callback Function will be called once the request executed.
 * @public
 */
router.get('/getAll', authenticator, (request, response) => {
  validator.getalltemplate(request.query, result => handelResult(result, response))
})

/**
 * This service  using delete template
 * @param  {endpoint} delete webservice name
 * @param  {funct} authenticator  check JWT authentication
 * @param  {request} request  from  user request
 * @param  {response} callback Function will be called once the request executed.
 * @public
 */
router.delete('/delete', authenticator, (request, response) => {
  validator.deleteTemplate(request.query, result => handelResult(result, response))
})
module.exports = router
