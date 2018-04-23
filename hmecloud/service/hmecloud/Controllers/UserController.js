
const messages = require('../Common/Message')
const repository = require('../Repository/UserRepository')
const dateUtils = require('../Common/DateUtils')
const uuidv4 = require('uuid/v4')

/**
 * The method can be used to execute handel errors and return to routers.
 * @param  {input} message input from custom messages.
 * @param  {input} status input false.
 * @public
 */
const errorHandler = (message, status, request) => {
  let output = {}
  output.key = message
  output.status = status
  return output
}

/**
 * The method can be used to create user
 * @param  {input} user input from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const create = (user, callback) => {
  console.log('User Controller invoked..')
  let output = {}
  const values = {
    Uid: uuidv4().toUpperCase(),
    IsActive: user.isActive,
    IsVerified: 0,
    ResetPassword: 0,
    OwnerAccountId: user.accountId,
    CompanyId: user.companyId,
    FirstName: user.firstName,
    LastName: user.lastName,
    EmailAddress: user.userEmail,
    PasswordHash: 'abcd', // To be updated
    PasswordSalt: 'abcd', // to be updated
    CreatedDTS: user.createdDTS,
    CreatedBy: user.createdUserEmail,
    Stores: user.storeIds.toString(),
    UserRole: user.userRole
  }
  repository.create(values, (result) => {
    if (result.length > 0) {
      let isUserCreated = result[0]
      if (isUserCreated.IsUserCreated !== null && isUserCreated.IsUserCreated > 1) {
        output.key = 'usercreateSuccess'
        output.status = true
      } else {
        output.key = 'userAlreadyExist'
        output.status = false
      }
      callback(output)
    } else {
      output.key = 'usercreateFailure'
      output.status = false
      callback(output)
    }
  })
}

/**
 * The method can be used to execute get user
 * @param  {input} user input from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const get = (user, request, callback) => {
  let output = {}
  repository.get(user, (result) => {
    if (result) {
      let user = result
      user.FromDate = dateUtils.convertYYYYMMDD(user.FromDate)
      user.ToDate = dateUtils.convertYYYYMMDD(user.ToDate)
      user.OpenTime = dateUtils.converthhmmtt(user.OpenTime)
      user.CloseTime = dateUtils.converthhmmtt(user.CloseTime)
      user.TimeMeasure = messages.TimeMeasure[user.TimeMeasure]
      user.Type = messages.Type[user.Type]
      user.Format = messages.TimeFormat[user.Format]
      user.DeviceUUIds = user.Devices.split(',')
      user.AdvancedOption = (user.AdvancedOption === 1)
      user.LongestTime = (user.LongestTime === 1)
      user.SystemStatistics = (user.SystemStatistics === 1)
      user.Close = (user.Close === 1)
      user.Open = (user.Open === 1)

      output.data = user
      output.status = true
      callback(output)
    } else {
      output.key = 'noDataFound'
      output.status = false
      callback(output)
    }
  })
}

/**
 * The method can be used to execute getAll users
 * @param  {input} AccountId input from  user request
 * @param  {input} CreatedBy input from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const getAll = (input, request, callback) => {
  let output = {}
  repository.getAll(input.UserUid, (result) => {
    console.log('The result==', JSON.stringify(result))
    if (result.length > 0) {
      output.data = result
      output.status = true
      callback(output)
    } else {
      output.key = 'noDataFound'
      output.status = false
      callback(output)
    }
  })
}
/**
 * The method can be used to execute delete the user
 * @param  {input} input input from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const deleteById = (input, callback) => {
  let output = {}
  repository.deleteById(input.query.templateId, (result) => {
    if (result) {
      output.key = 'userdeleteSuccess'
      output.status = true
      callback(output)
    } else {
      output.key = 'noDataFound'
      output.status = false
      callback(output)
    }
  })
}

module.exports = {
  create,
  deleteById,
  get,
  getAll
}
