const jwt = require('jsonwebtoken')
const config = require('../Common/AuthKey')
const express = require('express')
const authVerfiy = require('../Controllers/AuthenticationController')
const router = express.Router()
// JWT token creation
router.get('/login', (request, response) => {
  const userDetails = {
    userUid: 'XD2J8Q7KQ7HO3TLQXTGIPWSVSQZK5ZBH',
    UserName: 'HME Admin',
    UserEmail: 'admin@hme.com',
    AccountId: 1311,
    Role: 'Admin',
    UserPreferencesValue: 11 // After authentication get the Preference value from itbl_User_Preferences table based on logged in user Id
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
// check the JWT token
router.post('/verifyJWT', authVerfiy, (request, response, next) => {
  if (authVerfiy) {
    console.log('userUid', request.userUid)
  }
  // response.send(Actual functionality )
})

router.get('/getUser', authVerfiy, (request, response) => {
  const userDetails = {
    userUid: request.userUid,
    UserEmail: request.UserEmail,
    UserName: request.UserName,
    AccountId: request.AccountId,
    companyId: request.companyId
  }
  const output = {
    data: userDetails,
    status: true
  }
  response.send(output)
})

module.exports = router
