'use strict';

var adal = require('adal-node')
const config = require('./config')
const sql = require('mssql'),
  jwt = require('jsonwebtoken')

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
        .query(`SELECT [User_ID]
        ,[User_UID]
        ,[User_OwnerAccount_ID]
        ,[User_Company_ID]
        ,[User_EmailAddress]
        ,[User_FirstName]
        ,[User_LastName]
        FROM [hmeCloud].[dbo].[tbl_Users] 
        WHERE [User_IsActive] = 1 AND [User_EmailAddress] = '${email}'`, (err, result) => {
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
}