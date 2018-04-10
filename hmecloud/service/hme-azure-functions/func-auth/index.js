'use strict';

const adal = require('adal-node')
const jwt = require('jsonwebtoken')
const config = require('./config')

module.exports = function (context, req) {
  var AuthenticationContext = adal.AuthenticationContext;

  let params = req.body,
    email = params.username,
    name = email.substring(0, email.lastIndexOf("@")),
    domain = email.substring(email.lastIndexOf("@") + 1)

  if (domain !== 'nousinfo.com') {
    // to-do: login flow using details from database
    let jwtToken = jwt.sign({ unique_name: email, role: 'user' }, config.secret, {
      expiresIn: 3599 // expires in 60 mins
    }, (err, token) => {
      console.log(token)
      context.res = {
        status: 200,
        body: {
          tokenType: 'Bearer',
          expiresIn: 3599,
          // expiresOn: tokenResponse.expiresOn,
          accessToken: token,
          refreshToken: token,
          // userId: tokenResponse.userId,
          // familyName: tokenResponse.familyName,
          // givenName: tokenResponse.givenName
        }
      }
      context.done();
    })
  } else {
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
}