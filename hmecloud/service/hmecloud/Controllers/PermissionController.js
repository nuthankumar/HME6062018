
// const messages = require('../Common/Message')
const repository = require('../Repository/PermissionRepository')
const validator = require('../Validators/PermissionValidator')

/**
 * The method can be used to execute getAll user's permission
 * @param  {input} userUid input from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const getAll = (request, callback) => {
  const input = {
    userUid: request.query.uuid ? request.query.uuid : (request.userUid ? request.userUid : null)
  }
  validator.validate(input, (err) => {
    if (err) {
      callback(err)
    }
    repository.getAll(input, callback)
  })
}

module.exports = {
  getAll
}
