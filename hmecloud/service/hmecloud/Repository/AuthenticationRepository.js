const jwt = require('jsonwebtoken')
const config = require('../Common/AuthKey')
const message = require('../Common/Message')

function verifyToken (request, response, next) {
  // check header or url parameters or post parameters for token
  const jwtToken = request.headers['x-access-token']

  if (!jwtToken) {
    return response.status(403).send({
      auth: false,
      message: message.JWT.TOKENMISS
    })
  }
  let encodeToken = Buffer.from(jwtToken, 'base64')
  let token = encodeToken.toString('ascii')

  // verifies secret and checks exp
  jwt.verify(token, config.secret, function (err, decoded) {
    if (err) {
      return response
        .status(500)
        .send({
          auth: false,
          message: message.JWT.TOKENMISS
        })
    }
    request.userUid = decoded.userUid
    request.UserEmail = decoded.UserEmail
    request.UserName = decoded.UserName
    request.Role = decoded.Role
    request.AccountId = decoded.AccountId
    request.UserPreferenceValue = decoded.UserPreferencesValue
    next()
  })
}

module.exports = verifyToken
