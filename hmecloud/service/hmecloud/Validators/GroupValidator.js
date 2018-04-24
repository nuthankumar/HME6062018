const validate = require('validator')
const groupController = require('../Controllers/GroupController')

const createGroup = (request, callback) => {
  if (request.body.name) {
    const input = {
      id: request.body.id,
      name: (request.body.name).trim(),
      description: request.body.description,
      groups: request.body.groups,
      stores: request.body.stores,
      userName: request.UserName,
      accountId: request.AccountId
    }
    if (!request.body.id) {
      groupController.createGroup(request, input, result => {
        callback(result)
      })
    } else {
      // Update Group
      groupController.updateGroup(request, input, result => {
        callback(result)
      })
    }
  } else {
    let output = {}
    output.key = 'groupNameEmpty'
    output.status = false
    callback(output)
  }
}
const getgroupDetails = (request, callback) => {
  let output = {}
  if (request.query.groupId) {
    const input = {
      groupId: request.query.groupId
    }
    groupController.getgroupDetails(request, input, result => {
      callback(result)
    })
  } else if (!request.query.groupId) {
    output.key = 'groupIdInvalid'
    output.status = false
    callback(output)
  }
}
const deleteGroupById = (request, callback) => {
  let output = {}
  if (request.query.groupId) {
    const input = {
      groupId: request.query.groupId,
      accountId: request.AccountId
    }
    const groupId = validate.isNumeric(input.groupId)
    if (!groupId) {
      output.key = 'groupIdInvalid'
      output.status = false
      callback(output)
    } else if (!input.accountId) {
      output.key = 'requiredAccountId'
      output.status = false
      callback(output)
    }
    if (groupId && input.accountId) {
      groupController.deleteGroupById(request, input, result => {
        callback(result)
      })
    }
  } else {
    output.key = 'invalidInput'
    output.status = false
    callback(output)
  }
}

const avaliabledGroups = (request, callback) => {
  let output = {}
  const input = {
    accountId: request.AccountId
  }

  if (!input.accountId) {
    output.key = 'requiredAccountId'
    output.status = false
    callback(output)
  }

  if (input.accountId) {
    groupController.avaliabledGroups(request, input, result => {
      callback(result)
    })
  }
}
const getAll = (request, callback) => {
  let output = {}
  if (request.AccountId || request.uuid) {
    const input = {
      accountId: request.AccountId,
      userUid: (request.uuid ? request.uuid:null)
    }
    if (!input.accountId && !input.userUid) {
      output.key = 'requiredAccountId'
      output.status = false
      callback(output)
    }
    if (input.accountId || input.userUid) {
      groupController.getAll(request, input, result => {
        callback(result)
      })
    }
  } else {
    output.key = 'requiredAccountId'
    output.status = false
    callback(output)
  }
}
module.exports = {
  createGroup,
  getgroupDetails,
  deleteGroupById,
  avaliabledGroups,
  getAll
}
