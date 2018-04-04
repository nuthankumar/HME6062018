const jwt = require('jsonwebtoken')
const config = require('../../common/AuthKey')

function verifyToken (request, response, next) {
  // check header or url parameters or post parameters for token
  const jwtToken = request.headers['x-access-token']

  if (!jwtToken) {
    return response.status(403).send({
      auth: false,
      message: 'No token provided.'
    })
  }
  let encodeToken = new Buffer(jwtToken, 'base64')
  let token = encodeToken.toString('ascii')

  // verifies secret and checks exp
  jwt.verify(token, config.secret, function (err, decoded) {
    if (err) {
      return response
        .status(500)
        .send({
          auth: false,
          message: 'Failed to authenticate token.'
        })
    }
    request.userId = decoded.userId
    request.UserEmail = decoded.UserEmail
    request.UserName = decoded.UserName
    request.Role = decoded.Role
    next()
  })
}

module.exports = verifyToken
