const userController = require('../Controllers/UserController')
const create = (request, callback) => {
  if (request.body.firstName) {
    const input = {
      uuId: request.body.uuId,
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      userEmail: request.body.userEmail,
      isActive: request.body.isActive,
      userRole: request.body.userRole,
      storeIds: request.body.storeIds,
      createdDTS: request.body.createdDateTime,
      createdUserEmail: request.UserEmail,
      userUid: request.userUid,
      accountId: request.AccountId,
      companyId: request.companyId
    }
    if (!request.body.uuId) {
      userController.create(input, result => {
        callback(result)
      })
    } else {
      // Update Group
      // groupController.updateGroup(request, input, result => {
      //    callback(result)
      // })
    }
  } else {
    let output = {}
    output.key = 'firstNameEmpty'
    output.status = false
    callback(output)
  }
}

const get = (request, callback) => {
  let output = {}
  if (request.query.uuId) {
    const input = {
      uuId: request.query.uuId
    }
    userController.get(input, result => {
      callback(result)
    })
  } else if (!request.query.uuId) {
    output.key = 'invalidUserUUID'
    output.status = false
    callback(output)
  }
}

module.exports = {
  create,
  get
}
