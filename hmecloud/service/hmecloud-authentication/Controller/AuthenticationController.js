const jwt = require('jsonwebtoken')
const config = require('../Common/AuthKey')
const message= require('../Common/Message')

function verifyToken (request, response, next) {
  const jwtToken = request.headers['x-access-token']

  if (!jwtToken) {
    return response.status(403).send({
      auth: false,
      message: message.Authentication.tokenNotFound
    })
  }
  let encodeToken = Buffer.from(jwtToken, 'base64')
  let token = encodeToken.toString('ascii')

  jwt.verify(token, config.secret, function (err, decoded) {
    if (err) {
      return response
        .status(500)
        .send({
          auth: false,
          message: message.Authentication.incorrectToken
        })
    }
    request.userId = decoded.userId
    request.UserEmail = decoded.UserEmail
    request.UserName = decoded.UserName
    request.Role = decoded.Role
    request.AccountId = decoded.AccountId
    next()
  })
}

module.exports = verifyToken
