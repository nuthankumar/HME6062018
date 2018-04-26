const validator = require('validator')

/**
 * get all validate method to validate the arguments which has been passed 
 * to controller is valida or not
 * @param  {endpoint} getAll webservice name
 * @param  {request} request  from  user request
 * @param  {response} callback Function will be called once the request executed.
 * @public
 */
const validate = (input, callback) => {
    
    if (!input.userUid) {
        let output = {}
        output.key = 'requiredUserUid'
        output.status = false
        callback(output)
    }
    if (input.userUid) {
        callback()
    }

}
module.exports = {
    validate
}
