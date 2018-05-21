const validator = require('validator')
/**
 * get all validate method to validate the arguments which has been passed 
 * to controller is valida or not
 * @param  {endpoint} getAll webservice name
 * @param  {request} request  from  user request
 * @param  {response} callback Function will be called once the request executed.
 * @public
 */

const validateDevice = (input, callback) => {
    if (!input.duid) {
      let output = {}
      output.key = 'requiredDuid'
      output.status = false
      callback(output)
    }
    if (input.duid) {
      callback()
    }
  }
module.exports = {
    validateDevice
}
