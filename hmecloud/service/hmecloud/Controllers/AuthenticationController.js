const jwt = require('jsonwebtoken')
const config = require('../Common/AuthKey')
const aad = require('azure-ad-jwt')

function verifyToken(request, response, next) {
  const authorization = request.headers['authorization']

  if (!authorization) {
    return response.status(403).send({
      auth: false,
      message: 'authorization header is missing.'
    })
  }

  if (authorization) {
    var bearer = authorization.split(' ')
    var jwtToken = bearer[1]

    if (!jwtToken) {
      return response.status(403).send({
        auth: false,
        message: 'token is missing.'
      })
    }

    /* AzureAD token verification */
    aad.verify(jwtToken, null, (error, result) => {
      if (result) {
        request.userUid = result.puid
        request.UserEmail = result.unique_name
        request.UserName = result.name
        next()
      }

      if (error) {
        /* SQLUser token verification */
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
          request.AccountId = decoded.User_OwnerAccount_ID
          request.companyId = decoded.User_Company_ID
          next()
        })
      }
    });
  }
}

module.exports = verifyToken
