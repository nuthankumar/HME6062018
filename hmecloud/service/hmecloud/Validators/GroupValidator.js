const validate = require('validator')
const groupController = require('../Controllers/GroupController')

const createGroup = (request, callback) => {
  if (request.body.name) {
    const input = {
      id: request.body.id,
      name: request.body.name,
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
    output.error = request.t('CREATEGROUP.groupNameEmpty')
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
        output.error = request.t('CREATEGROUP.groupId')
        output.status = false
        callback(output)
    }
}
const deleteGroupById = (request, callback) => {
  let output = {}
  if (request.query.groupId ) {
    const input = {
      groupId: request.query.groupId,
      accountId: request.AccountId
    }
    const groupId = validate.isNumeric(input.groupId)
    if (!groupId) {
      output.error = request.t('CREATEGROUP.groupId')
      output.status = false
      callback(output)
    } else if (!input.accountId) {
      output.error = request.t('LISTGROUP.accountId')
      output.status = false
      callback(output)
    }
    if (groupId && input.accountId) {
      groupController.deleteGroupById(request, input, result => {
       callback(result)
      })
    }
  } else {
    output.error = request.t('CREATEGROUP.invalidInput')
    output.status = false
    callback(output)
  }
}

const avaliabledGroups = (request, callback) => {
    const input = {
      accountId: request.AccountId
      }

    if (!input.accountId) {
        output.error = request.t('LISTGROUP.accountId')
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
  if (request.AccountId) {
    const input = {
      accountId: request.AccountId
    }
<<<<<<< HEAD
    // const accountId = validate.isNumeric(input.accountId)
    if (!input.AccountId) {
=======
     if (!input.accountId) {
>>>>>>> 690420220d862eef2590d1ebe54e420d4a3fa322
      output.error = request.t('LISTGROUP.accountId')
      output.status = false
      callback(output)
    }
    if (input.AccountId) {
      groupController.getAll(request, input, result => {
        callback(result)
      })
    }
<<<<<<< HEAD
  } else if (!request.AccountId) {
    output.error = request.t('LISTGROUP.accountId')
    output.status = false
    callback(output)
=======
>>>>>>> 690420220d862eef2590d1ebe54e420d4a3fa322
  } else {
    output.error = request.t('LISTGROUP')
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
