const validate = require('validator')
const groupController = require('../Controllers/GroupController')
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
            stores: request.body.stores,
            userName: request.UserName,
            accountId: request.AccountId
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
        output.error = request.t('CREATEGROUP.groupNameEmpty')
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
         output.error = request.t('CREATEGROUP.groupId')
         output.status = false
         callback(output)

        
     } else if (request.query.groupId && !request.query.userName) {
         output.error = request.t('LISTGROUP.createdBy')
         output.status = false
         callback(output)

        
     } else {
         output.error = request.t('CREATEGROUP.invalidInput')
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
                output.error = request.t('CREATEGROUP.groupId')
                output.status = false
                callback(output)

            
            } else if (!accountId) {
                output.error = request.t('LISTGROUP.accountId')
                output.status = false
                callback(output)
        }

        if(groupId && accountId) {
            groupController.deleteGroupById(input, result => {
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

    if (request.query.accountId && request.query.userName) {
        const input = {
            accountId: request.query.accountId,
            createdBy: request.query.userName
        }
        const accountId = validate.isNumeric(input.accountId)
        const createdBy = validate.isEmail(input.createdBy)
        if (!accountId) {
            let output = {}
            output.error = request.t('LISTGROUP.accountId')
            output.status = false
            callback(output)
        }
        if (!createdBy) {
            let output = {}
            output.error = request.t('LISTGROUP.createdBy')
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
        output.error = request.t('LISTGROUP.accountId')
        output.status = false
        callback(output)
       
    } else if (request.query.accountId && !request.query.userName) {
        let output = {}
        output.error = request.t('LISTGROUP.createdBy')
        output.status = false
        callback(output)
        
    } else {
        let output = {}
        output.error = request.t('LISTGROUP')
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
            output.error = request.t('LISTGROUP.accountId')
            output.status = false
            callback(output)
        }
        if (accountId) {
            groupController.getAll(input, result => {
                callback(result)
            })
        }
    } else if (!request.query.accountId) {
        output.error = request.t('LISTGROUP.accountId')
        output.status = false
        callback(output)
        
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
