
const messages = require('../Common/Message')
const repository = require('../Repository/RoleRepository')

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
 * @param  {input} AccountId input from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const getAll = (request, callback) => {
  let output = {}
  repository.getAll(request.AccountId, (result) => {
    if (result.length > 0) {
      output.data = result
      output.status = true
      callback(output)
    } else {
      errorHandler(messages.LISTGROUP.notfound, false)
    }
  })
}

module.exports = {
  getAll
}
