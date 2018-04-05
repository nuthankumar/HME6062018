var express = require("express");
var morgan = require("morgan");
var passport = require("passport");
var BearerStrategy = require('passport-azure-ad').BearerStrategy;

var options = {
    identityMetadata: "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration/",
    clientId: "00000000-xxxx-0000-xxxx-000000000000",
    validateIssuer: false,
    loggingLevel: 'warn',
    passReqToCallback: false
};

module.exports = function (context, req) {

/*
    context.log('http-trigger', req.body); //to-do: use bunyan
*/

    //to-do: implement core-translator-mediator
    if (req.body.params === null || req.body.params === 'undefined') {
        context.res = {
            status: 400,
            body: "request body cannot be empty"
        };
        context.done();
    }

    // Check for client id placeholder
    if (options.clientId === req.header.clientId) {
        context.log("Please update 'options' with the client id (application id) of your application");
        return;
    }

    var bearerStrategy = new BearerStrategy(options,
        function (token, done) {
            // Send user info using the second argument
            done(null, {}, token);
        }
    );

    passport.initialize();
    passport.use(bearerStrategy);

    passport.authenticate('oauth-bearer', {session: false}),(req, res) => {
        var claims = req.authInfo;
        context.log('User info: ', req.user);
        context.log('Validated claims: ', claims);
        
        context.res = {
            status: 200,
            body: {'name': claims['name']}
        };
        context.done();
    }

    context.done();
};