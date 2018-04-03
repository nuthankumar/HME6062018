const jwt = require('jsonwebtoken')
const config = require('../Common/AuthKey')
const express = require('express')
const authVerfiy = require('../Controllers/AuthenticationController/Authentication')
const router = express.Router()
// JWT token creation
router.get('/login', (request, response) => {
  const userDetails = {
    userId: 1,
    UserName: 'abhradipr',
    UserEmail: 'abhradipr@nousinfo.com',
    AccountId: 100,
    Role: 'Admin'
  }
  let jwtToken = jwt.sign(userDetails, config.secret, {
    expiresIn: (5 * 60000) // expires in 5 mins
  })
  let encodeToken = new Buffer(jwtToken)
  let token = encodeToken.toString('base64')
  const output = {
    token: token,
    status: true
  }
  response.send(output)
})
// check the JWT token
router.post('/verifyJWT', authVerfiy, (request, response, next) => {
  if (authVerfiy) {
    console.log('UserID', request.userId)
  }
  // response.send(Actual functionality )
})

module.exports = router
