const jwt = require('jsonwebtoken')
const config = require('../Common/Message')
const express = require('express')
const authVerfiy = require('../Controllers/AuthenticationController')
const router = express.Router()

/**
 * This router  using create JWT Token for Authenticate
 * @param  {request} input user Details form frontend
 * @param  {response} output token willbe send reponse to frontend
 * @public
 */
router.get('/login', (request, response) => {
  console.log("cd")
  const userDetails = {
    userId: 1,
    UserName: 'HME Admin',
    UserEmail: 'admin@hme.com',
    AccountId: 100,
    Role: 'Admin'
  }
  let jwtToken = jwt.sign(userDetails, config.secret, {
    expiresIn: (5 * 60000) // expires in 5 mins
  })
  let encodeToken = Buffer.from(jwtToken)
  let token = encodeToken.toString('base64')
  const output = {
    token: token,
    status: true
  }
  response.send(output)
})

/**
 * This router  using verfiy JWT Token for Authenticate
 * @param  {authVerfiy} authVerfiy  form controller
 * @param  {request} input user Details form frontend
 * @param  {response} output token willbe send reponse to frontend
 * @public
 */
router.post('/verifyJWT', authVerfiy, (request, response, next) => {

  if (authVerfiy) {
    let userId = request.userId
    response.status(200).send({userId})
  }
})

module.exports = router
