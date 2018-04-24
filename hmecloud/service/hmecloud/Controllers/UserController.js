
const repository = require('../Repository/UserRepository')
const uuidv4 = require('uuid/v4')
const passwordUtil = require('../Common/PasswordUtil')
const messages = require('../Common/Message')

/**
 * The method can be used to create user
 * @param  {input} user input from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const create = (user, callback) => {
    let output = {}
    let generatePassword = passwordUtil.generatePassword(messages.COMMON.PASSWORDLENGTH)
    let salt = passwordUtil.generateSalt(messages.COMMON.SALTLENGTH)
    let hashValue = passwordUtil.computeHash(generatePassword.toLowerCase(), salt)

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
    PasswordHash: hashValue.toUpperCase(), 
    PasswordSalt: salt, 
    CreatedDTS: user.createdDTS,
    CreatedBy: user.userUid,
    Stores: user.storeIds.toString(),
    UserRole: user.userRole
  }
  repository.create(values, (result) => {
    if (result.length > 0) {
      let isUserCreated = result[0]
      if (isUserCreated.IsUserCreated !== null && isUserCreated.IsUserCreated > 0) {
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

const update = (user, callback) => {
  let output = {}
  const values = {
    Uid: user.uuId,
    IsActive: user.isActive,
    FirstName: user.firstName,
    LastName: user.lastName,
    EmailAddress: user.userEmail,
    UpdatedDTS: user.createdDTS,
    Stores: user.storeIds.toString(),
    UserRole: user.userRole
  }
  repository.update(values, (result) => {
    if (result.length > 0) {
      let isUserUpdated = result[0]
      if (isUserUpdated.IsUserUpdated !== null && isUserUpdated.IsUserUpdated > 0) {
        output.key = 'userupdatedSuccess'
        output.status = true
      } else {
        output.key = 'noDataFound'
        output.status = false
      }
      callback(output)
    } else {
      output.key = 'userupdateFailure'
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
const get = (user, callback) => {
  let output = {}
  repository.get(user.uuId, (result) => {
    if (result.length > 0) {
      let userProfile = result[0]
      let userRole = result[1]
      let userStores = result[2]
      let user = {}
      if (userProfile) {
        user.uuId = userProfile.User_UID
        user.isActive = userProfile.User_IsActive
        user.firstName = userProfile.User_FirstName
        user.lastName = userProfile.User_LastName
        user.userEmail = userProfile.User_EmailAddress
      }
      user.userRole = ''
      if (userRole) {
        user.userRole = userRole.Role_UID
      }
      user.storeIds = []
      if (userStores) {
        let storeIds = []
        for (let i = 0; i < userStores.length; i++) {
          let userStore = userStores[i]
          storeIds.push(userStore.Store_ID)
        }
        user.storeIds = storeIds
      }

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
 * The method can be used to execute get user audit
 * @param  {input} user input from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const getAudit = (user, callback) => {
  let output = {}
  repository.getAudit(user.uuId, (result) => {
    if (result.length > 0) {
      let logs = []
      for (let i = 0; i < result.length; i++) {
        let log = {
          lastLogin: result[i].Audit_LastLogin,
          record: result[i].Audit_Action,
          page: result[i].audit_page,
          action: result[i].page_action
        }
        logs.push(log)
      }
      output.data = logs
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
  repository.deleteById(input.uuId, (result) => {
    if (result.length > 0) {
      let isUserDeleted = result[0]
      if (Number(isUserDeleted.IsUserDeleted) > 0) {
        output.key = 'userdeleteSuccess'
        output.status = true
        callback(output)
      } else {
        output.key = 'noDataFound'
        output.status = false
        callback(output)
      }
    } else {
      output.key = 'userDeleteFailed'
      output.status = false
      callback(output)
    }
  })
}

module.exports = {
  create,
  deleteById,
  get,
  getAudit,
  getAll,
  update
}
