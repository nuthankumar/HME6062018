'use strict';





var adal = require('adal-node')
const config = require('./config')
const sql = require('mssql'),
  jwt = require('jsonwebtoken'),
  request = require('request'),
  _ = require('lodash'),
  aad = require('azure-ad-jwt')


var Promise = require('bluebird'),
  requestPromise = Promise.promisify(require("request"))

Promise.promisifyAll(requestPromise)

module.exports = function (context, req) {
  var AuthenticationContext = adal.AuthenticationContext;

  let params = req.body,
    email = params.username,
    name = email.substring(0, email.lastIndexOf("@")),
    domain = email.substring(email.lastIndexOf("@") + 1)
  // if (domain !== config.domain) {
  if (!params.isAdmin) {
    let authorization = req.headers['authorization']
    if (!authorization && !params.password) {
      context.res = {
        status: 403,
        body: 'Authorization header or password required'
      }
      context.done()
    }

    if (authorization) {
      var bearer = authorization.split(' ')
      var jwtToken = bearer[1]

      if (!jwtToken) {
        context.res = {
          status: 403,
          body: 'token is missing.'
        }
        context.done()
      }

      /*
      Authorization: admin-bearer-token
      {
        "username": "user1@abc.com",
        "isAdmin": false
      }
    */

      /* AzureAD token verification */
      aad.verify(jwtToken, null, (error, result) => {

        if (error) {
          context.res = {
            status: 403,
            body: 'Failed to authenticate token'
          }
          context.done()
        }

        if (result) {
          const sqlPool = new sql.ConnectionPool(config.sqlConfig, err => {
            if (err) {
              context.res = {
                status: 404,
                body: err
              }
              context.done()
            }

            sqlPool.request()
              .query(`EXEC [dbo].[usp_GetUserByEmail] @EmailAddress='${email}'`, (err, result) => {
                if (err) {
                  context.res = {
                    status: 404,
                    body: err.stack
                  }
                  context.done()
                }
                if (result && result.recordsets) {
                  let user = result.recordset[0]
                  let jwtToken = jwt.sign(user, config.secret, {
                    expiresIn: '24h' // expires in 60 mins
                  }, (err, token) => {
                    context.res = {
                      status: 200,
                      body: {
                        tokenType: 'Bearer',
                        expiresIn: '24h',
                        accessToken: token,
                        refreshToken: token,
                        userId: user.User_EmailAddress,
                        familyName: user.User_LastName,
                        givenName: user.User_FirstName
                      }
                    }
                    context.done()
                  })
                }
              })
          })

          sqlPool.on('error', err => {
            if (err) {
              context.res = {
                status: 404,
                body: err.stack
              }
              context.done()
            }
          })
        }
      })
    } else {
      /*
        {
          "username": "user1@abc.com",
          "password": "abc-pwd",
          "isAdmin": false
        }
      */
      context.res = {
        status: 404,
        body: "Not Implemented yet!"
      }
      context.done()
    }
  } else {
    /*
      {
        "username": "nous-user@hme.com",
        "password": "hme-ad-pwd",
        "isAdmin": true
      }
    */
    // AzureAD Silent Authentication
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
          let groups = []
          if (tokenResponse.userId) {
            // Graph API to fetch user-groups
            const options = {
              url: `https://graph.windows.net/hme.com/users/${tokenResponse.userId}/getMemberGroups?api-version=1.6`,
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenResponse.accessToken}`
              },
              body: JSON.stringify({ securityEnabledOnly: false })
            }

            request(options, (error, response, body) => {
              if (body) {
                let userGroups = JSON.parse(body)
                Promise.map(userGroups.value, function (groupId) {
                  return requestPromise({
                    url: `https://graph.windows.net/hme.com/groups/${groupId}?api-version=1.6`,
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${tokenResponse.accessToken}`
                    }
                  })
                })
                  .each((result) => {
                    let groupName = JSON.parse(result.body).displayName
                    groups.push(groupName)
                  })
                  .then(function (results) {

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
                        givenName: tokenResponse.givenName,
                        groups: groups
                      }
                    }
                    context.done()
                  });
              }
            })
          }
        }
      })
  }
}

