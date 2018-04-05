const express = require('express')
const router = express.Router()
const templatValidator = require('../Validators/TemplateValidator')

router.get('/getall', (request, response) => {
  templatValidator.getalltemplate(request, (result) => {
    response.status(200).send(result)
  })
})

module.exports = router
