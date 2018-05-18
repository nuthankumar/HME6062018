const messages = require('../Common/Message')
const repository = require('../Repository/BrandRepository')
const validator = require('../Validators/BrandValidator')

/**
 * The method can be used to execute handel errors and return to routers.
 * @param  {input} message input from custom messages.
 * @param  {input} status input false.
 * @public
 */
const errorHandler = (message, status) => {
  let output = {}
  output.key = message
  output.status = status
  return output
}

/**
 * The method can be used to execute getAll users
 * @param  {input} request input from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const getAll = (request, callback) => {  

  validator.validate(input, (err) => {
    if (err) {
      callback(err)
    }
    repository.getAll(input, (result) => {
      if (result.data && result.data.length > 0) {
        let output = {}
        output.data = result.data[0]
        output.status = true
        callback(output)
      } else {
        callback(errorHandler(messages.LISTGROUP.notfound, false))
      }
    })
  })
}

module.exports = {
  getAll
}
