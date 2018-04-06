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

router.post('/create', authenticator, (request, response) => {
  validator.createTemplate(request, result => handelResult(result, response))
})
router.get('/get', authenticator, (request, response) => {
  validator.getTemplate(request.query, result => handelResult(result, response))
})
router.get('/getAll', authenticator, (request, response) => {
  validator.getalltemplate(request.query, result => handelResult(result, response))
})
router.delete('/delete', authenticator, (request, response) => {
  validator.deleteTemplate(request.query, result => handelResult(result, response))
})
module.exports = router
