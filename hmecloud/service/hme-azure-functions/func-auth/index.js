'use strict';


/*
Authorization: admin-bearer-token
{
	"username": "user1@abc.com",
	"isAdmin": false
}
[OR]
{
	"username": "user1@abc.com",
	"password": "abc-pwd",
	"isAdmin": false
}
[OR]
{
	"username": "nous-user@hme.com",
	"password": "hme-ad-pwd",
	"isAdmin": true
}
*/


var adal = require('adal-node')
const config = require('./config')
const sql = require('mssql'),
  jwt = require('jsonwebtoken'),
  request = require('request'),
  _ = require('lodash')

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
  if (!params.isAdmin) { // to-do: add validations
    const sqlPool = new sql.ConnectionPool(config.sqlConfig, err => {
      if (err) {
        output.data = err
        output.status = false
        callback(output)
      }

      sqlPool.request()
        .query(`EXEC [dbo].[usp_GetUserByEmail] @EmailAddress='${email}'`, (err, result) => {
          if (err) {
            context.res = {
              status: 404,
              body: err.stack
            }
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
          // context.done();            
        })
    })

    sqlPool.on('error', err => {
      if (err) {
        context.res = {
          status: 404,
          body: err.stack
        }
      }
    })
  } else {
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
                console.log('userGroups: ', userGroups)

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
                    // all requests are done, data is in the results array
                    // console.log('results: ', results)

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

                // for (var i = 0, len = userGroups.length; i < len; i++) {
                //   request({
                //     url: `https://graph.windows.net/hme.com/groups/${userGroups[i]}?api-version=1.6`,
                //     method: 'GET',
                //     headers: {
                //       'Content-Type': 'application/json',
                //       'Authorization': `Bearer ${tokenResponse.accessToken}`
                //     }
                //   }, (err, res, b) => {
                //     if (b && JSON.parse(b).displayName) {
                //       groups.push(JSON.parse(b).displayName)
                //     }
                //   })
                // }

                // _.forEach(userGroups, function (groupId) {
                //   // Graph API to fetch ad-group-details
                //   request({
                //     url: `https://graph.windows.net/hme.com/groups/${groupId}?api-version=1.6`,
                //     method: 'GET',
                //     headers: {
                //       'Content-Type': 'application/json',
                //       'Authorization': `Bearer ${tokenResponse.accessToken}`
                //     }
                //   }, (err, res, b) => {
                //     if (b && JSON.parse(b).displayName) {
                //       groups.push(JSON.parse(b).displayName)                      
                //     }
                //   })
                // })
                // context.res = {
                //   status: 200,
                //   body: {
                //     tokenType: tokenResponse.tokenType,
                //     expiresIn: tokenResponse.expiresIn,
                //     expiresOn: tokenResponse.expiresOn,
                //     accessToken: tokenResponse.accessToken,
                //     refreshToken: tokenResponse.refreshToken,
                //     userId: tokenResponse.userId,
                //     familyName: tokenResponse.familyName,
                //     givenName: tokenResponse.givenName,
                //     groups: groups
                //   }
                // }
                // context.done()
              }
            })
          }
        }
      })
  }
}

