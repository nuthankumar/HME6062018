const validate = require('validator')
const groupController = require('../Controllers/GroupController')
const messages = require('../Common/Message')

/**
 * Service to provide list of all groups
 * Rules : check accountId &
 */

const createGroup = (request, callback) => {

    if (request.body.name) {
        const input = {
            id: request.body.id,
            name: request.body.name,
            description: request.body.description,
            groups: request.body.groups,
            stores: request.body.stores
        }

        if (!request.body.id) {
            groupController.createGroup(input, result => {
                callback(result)
            })
        } else {
            // Update Group
            groupController.updateGroup(input, result => {
                callback(result)
            })
        }
    } else {
        let output = {}
        output.error = messages.CREATEGROUP.groupNameEmpty
        output.status = false
        callback(output)
    }

}

const getgroupDetails = (request, callback) => {
    let output = {}
     if (request.query.groupId && request.query.userName) {
        const input = {
            groupId: request.query.groupId,
            userName: request.query.userName
        }
        groupController.getgroupDetails(input, result => {
            callback(result)
        })

     } else if (!request.query.groupId && request.query.userName) {
         output.error = messages.CREATEGROUP.groupId
         output.status = false
         callback(output)

        
     } else if (request.query.groupId && !request.query.userName) {
         output.error = messages.LISTGROUP.createdBy
         output.status = false
         callback(output)

        
     } else {
         output.error = messages.CREATEGROUP.invalidInput
         output.status = false
         callback(output)
    }
}

const deleteGroupById = (request, callback) => {
    let output = {}
        if (request.query.groupId && request.query.accountId) {
        const input = {
            groupId: request.query.groupId,
            accountId: request.query.accountId
            }
        const groupId = validate.isNumeric(input.groupId)
        const accountId = validate.isNumeric(input.accountId)
            if (!groupId) {
                output.error = messages.CREATEGROUP.groupId
                output.status = false
                callback(output)

            
            } else if (!accountId) {
                output.error = messages.LISTGROUP.accountId
                output.status = false
                callback(output)
        }

        if(groupId && accountId) {
            groupController.deleteGroupById(input, result => {
                callback(result)
            })
        }
        } else {
            output.error = messages.CREATEGROUP.invalidInput
            output.status = false
            callback(output)
        
    }
}

const avaliabledGroups = (request, callback) => {

    if (request.query.accountId && request.query.userName) {
        const input = {
            accountId: request.query.accountId,
            createdBy: request.query.userName
        }
        const accountId = validate.isNumeric(input.accountId)
        const createdBy = validate.isEmail(input.createdBy)
        if (!accountId) {
            let output = {}
            output.error = messages.LISTGROUP.accountId
            output.status = false
            callback(output)
        }
        if (!createdBy) {
            let output = {}
            output.error = messages.LISTGROUP.createdBy
            output.status = false
            callback(output)

        }
        if (accountId && input.createdBy) {
            groupController.avaliabledGroups(input, result => {
                callback(result)
            })
        }
    } else if (!request.query.accountId && request.query.userName) {
        let output = {}
        output.error = messages.LISTGROUP.accountId
        output.status = false
        callback(output)
       
    } else if (request.query.accountId && !request.query.userName) {
        let output = {}
        output.error = messages.LISTGROUP.createdBy
        output.status = false
        callback(output)
        
    } else {
        let output = {}
        output.error = messages.LISTGROUP
        output.status = false
        callback(output)

    }
}

const getAll = (request, callback) => {
    let output = {}
    if (request.query.accountId) {
        const input = {
            accountId: request.query.accountId
        }
        const accountId = validate.isNumeric(input.accountId)
        if (!accountId) {
            output.error = messages.LISTGROUP.accountId
            output.status = false
            callback(output)
        }
        if (accountId) {
            groupController.getAll(input, result => {
                callback(result)
            })
        }
    } else if (!request.query.accountId) {
        output.error = messages.LISTGROUP.accountId
        output.status = false
        callback(output)

        
    } else {
        output.error = messages.LISTGROUP
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
