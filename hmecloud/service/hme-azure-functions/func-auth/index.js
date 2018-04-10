'use strict';

var adal = require('adal-node');

module.exports = function (context, req) {
  var AuthenticationContext = adal.AuthenticationContext;

  let params = req.body
  const tenant = 'nousinfo.onmicrosoft.com',
    authorityHostUrl = 'https://login.microsoftonline.com',
    clientId = 'bb902204-5228-4e3c-8d79-d4e0bd722bc9'

  const authorityUrl = authorityHostUrl + '/' + tenant,
    resource = '00000002-0000-0000-c000-000000000000',
    authContext = new AuthenticationContext(authorityUrl)

  authContext.acquireTokenWithUsernamePassword(resource, params.username,
    params.password, clientId, function (err, tokenResponse) {
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
      context.done();
    })
}