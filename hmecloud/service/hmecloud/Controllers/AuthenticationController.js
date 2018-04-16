const jwt = require('jsonwebtoken')
const config = require('../Common/AuthKey')
const aad = require('azure-ad-jwt');

function verifyToken(request, response, next) {

  const authorization = request.headers['authorization']
  if (!authorization) {
    return response.status(403).send({
      auth: false,
      message: 'authorization header is missing.'
    })
  }

  if (authorization) {
    var bearer = authorization.split(" ");
    var jwtToken = bearer[1];

    if (!jwtToken) {
      return response.status(403).send({
        auth: false,
        message: 'token is missing.'
      })
    }
    /* AzureAD token verification*/
    /*
    if (jwtToken) {
      aad.verify(jwtToken, null, function (err, result) {
        if (result) {
          console.log("JWT is valid", result);
        } else {
          console.log("JWT is invalid: " + err);
        }
      });
    }
    */
    // let encodeToken = Buffer.from(jwtToken, 'base64')
    // let token = encodeToken.toString('ascii')
    jwt.verify(jwtToken, config.secret, function (err, decoded) {
      console.log('err: ', err)
      
      if (err) {
        return response
          .status(500)
          .send({
            auth: false,
            message: 'Failed to authenticate token.'
          })
      }
      
      request.userUid = decoded.User_UID
      request.UserEmail = decoded.User_EmailAddress
      request.UserName = `${decoded.User_LastName}, ${decoded.User_FirstName}`
      // request.Role = decoded.Role
      request.AccountId = decoded.User_OwnerAccount_ID
      // request.UserPreferenceValue = decoded.UserPreferencesValue
      next()
    })
  }
  /*
  // check header or url parameters or post parameters for token
  const jwtToken = request.headers['x-access-token']

  if (!jwtToken) {
    return response.status(403).send({
      auth: false,
      message: 'No token provided.'
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
          message: 'Failed to authenticate token.'
        })
    }
    request.userId = decoded.userId
    request.UserEmail = decoded.UserEmail
    request.UserName = decoded.UserName
    request.Role = decoded.Role
    request.AccountId = decoded.AccountId
    request.UserPreferenceValue = decoded.UserPreferencesValue
    next()
  })
  */
}

module.exports = verifyToken
