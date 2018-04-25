'use strict';

var adal = require('adal-node'),
  crypto = require('crypto')

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
          let sqlPool = new sql.ConnectionPool(config.sqlConfig, err => {
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

      let sqlPool = new sql.ConnectionPool(config.sqlConfig, err => {
        if (err) {
          context.res = {
            status: 404,
            body: err
          }
          context.done()
        }

        sqlPool.request()
          .query(
          `SELECT [User_ID]
            , [User_UID]
            , [User_OwnerAccount_ID]
            , [User_Company_ID]
            , [User_EmailAddress]
            , [User_FirstName]
            , [User_LastName]
            , [User_PasswordHash]
            , [User_PasswordSalt]
            , [User_IsActive]
            , [User_IsVerified]
            , CASE WHEN acct.Account_User_ID IS NULL THEN 0 ELSE 1 END [IsAccountOwner]
        FROM [dbo].[tbl_Users] usr
            LEFT JOIN tbl_Accounts acct ON acct.Account_User_ID = usr.[User_ID]
        WHERE [User_IsActive] = 1 AND [User_EmailAddress]='${email}'`, (err, result) => {
            if (err) {
              context.res = {
                status: 404,
                body: err.stack
              }
              context.done()
            }
            if (result && result.recordsets) {
              let user = result.recordset[0]

              if (isAuthenticated(user.User_PasswordHash, params.password, user.User_PasswordSalt)) {
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
              } else {
                context.res = {
                  status: 403,
                  body: "Unauthorized"
                }
                context.done()
              }
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

function isAuthenticated(userHash, password, salt) {
  var hashed = '';
  console.log(password, salt)

  var hash = function (str) {
    return crypto.createHash('sha512').update(str).digest('hex').toUpperCase()
  }
  hashed = hash(password + salt)
  for (let i = 1; i <= 2048; i++) {
    let inp = hashed + salt
    hashed = hash(inp);
  }
  console.log(userHash, hashed)
  return userHash === hashed
}

