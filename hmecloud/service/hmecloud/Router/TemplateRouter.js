const express = require('express')
const router = express.Router()
const templatValidator = require('../Validators/TemplateValidator')
const authValidator = require('../Controllers/AuthenticationController')

router.get('/getall', authValidator, (request, response) => {
  templatValidator.getalltemplate(request.query, (result) => {
    response.status(200).send(result)
  })
})

module.exports = router
