'use strict';

var adal = require('adal-node')
const config = require('./config')

module.exports = function (context, req) {
  var AuthenticationContext = adal.AuthenticationContext;

  let params = req.body

  const authorityUrl = config.authorityHostUrl + '/' + config.tenant,

    authContext = new AuthenticationContext(authorityUrl)

  authContext.acquireTokenWithUsernamePassword(config.resource, params.username,
    params.password, config.clientId, function (err, tokenResponse) {
      if (err) {
        context.res = {
          status: 404,
          body: err.stack
        }
      } else {
        context.res = {
          status: 200,
          body: {
            tokenType: tokenResponse.tokenType,
            expiresIn: tokenResponse.expiresIn,
            expiresOn: tokenResponse.expiresOn,
            accessToken: tokenResponse.accessToken,
            refreshToken: tokenResponse.refreshToken,
            userId: tokenResponse.userId,
            familyName: tokenResponse.familyName,
            givenName: tokenResponse.givenName
          }
        }
      }
      context.done()
    })
}