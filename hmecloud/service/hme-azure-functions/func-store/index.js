
const validator = require('./model.validator');
//to-do: return promise within same folder
const repo = require('../../hmecloud/Repository/StoresRepository'); 

module.exports = function (context, req) {

/*
    context.log('http-trigger', req.body); //to-do: use bunyan
    context.log('null', req.body.params === null); 
    context.log('undefined', req.body.params == 'undefined'); 
*/    

    //to-do: implement core-translator-mediator
    if (req.body.params === null || req.body.params === 'undefined') {
        context.res = {
            status: 400,
            body: "request body cannot be empty"
        };
        context.done();
    }

    let obj = req.body.params;

    if (!validator.isValidTemplate(obj)) {
        context.res = {
            status: 400,
            body: "err-validation"
        };
        context.done();
    }

    //to-do: return promise within same folder
    repo.getRawCarDataReport(obj, response => {
        if (response.status) {
            context.res = {
                body: response
            };
        } else {
            context.res = {
                status: 400,
                body: response
            };
        }
        context.done();
    });

    context.done();
};