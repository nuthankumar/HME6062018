
const validate = require('validator')
const groupRepository = require('../Repository/GroupRepository')
const messages = require('../Common/Message')
const validator = require('../Validators/GroupValidator')


// get functions using accountid & name  - for the List

// create function

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
            groupRepository.createGroup(input, result => {
               callback(result)
             })
        } else {
            // Update Group
            groupRepository.updateGroup(input, result => {
                callback(result)
            })
        }
    } else {
        response.status(400).send({
            error: messages.CREATEGROUP.groupNameEmpty,
            status: false
        })
    }



}

const update = (input, callback) => {
  const output = {}
  const condition = {
    where: {
      Id: input.id,
      AccountId: 100 // toDO: input.accountId update this //TODO: To be updated
    }
  }
  group.findOne(condition).then(data => {
    if (data) {
      if (data.GroupName !== input.name) {
        const condition = {
          where: {
            GroupName: input.name,
            AccountId: 100 // toDO: input.accountId update this //TODO: To be updated
          }
        }
        group.findAndCountAll(condition).then(count => {
          if (count.count > 0) {
            output.data = input.name + messages.CREATEGROUP.groupAlreadyExist
            output.status = false
            callback(output)
          } else {
            updateGroupData(input, (response) => {
              if (response.status === true) {
                output.data = response.data
                output.status = response.status

                callback(output)
              } else {
                output.data = response.error
                output.status = response.status

                callback(output)
              }
            })
          }
        }).catch(error4 => {
          output.data = error4
          output.status = false

          callback(output)
        })
      } else {
        updateGroupData(input, (response) => {
          if (response.status === true) {
            output.data = response.data
            output.status = response.status
            callback(output)
          } else {
            output.data = response.error
            output.status = response.status
            callback(output)
          }
        })
      }
    } else {
      // No data found for given group Id
      output.data = messages.CREATEGROUP.noDataForGivenId + input.id
      output.status = true
      callback(output)
    }
  }).catch(error => {
    output.data = error
    output.status = false

    callback(output)
  })
}

const updateGroupData = (input, callback) => {
  const output = {}
  group.update({
    GroupName: input.name,
    Description: input.description,
    UpdatedBy: 'jaffer@nousinfo.com', // TODO: To be updated
    UpdatedDateTime: Date().now
  }, {
    where: {
      Id: input.id
    }
  }).then(result1 => {
    const condition = {
      where: {
        GroupId: input.id
      }
    }
    groupDetails.destroy(condition).then(result2 => {
      if (input.groups.length > 0 || input.stores.length > 0) {
        let maxSize = input.groups.length
        for (var i = 0; i < maxSize; i++) {
          group.update({
            ParentGroup: null
          }, {
            returning: true,
            where: {
              ParentGroup: (input.id)
            }
          })
            .then(results1 => {

            }).catch(error1 => {
              output.data = error1
              output.status = false

              callback(output)
            })
          group.update({
            ParentGroup: input.id
          }, {
            returning: true,
            where: {
              Id: (input.groups[i])
            }
          })
            .then(results1 => {

            }).catch(error1 => {
              output.data = error1
              output.status = false

              callback(output)
            })
        }

        let maxSizes = input.stores.length
        for (var j = 0; j < maxSizes; j++) {
          groupDetails.create({
            GroupId: input.id,
            StoreId: input.stores[j]
          }).then(result1 => {

          }).catch(error1 => {
            output.data = error1
            output.status = false

            callback(output)
          })
        }
      }
      output.data = messages.CREATEGROUP.groupSuccess1 + input.name + messages.CREATEGROUP.groupUpdatesSuccess
      output.status = true
      callback(output)
    }).catch(error2 => {
      output.data = error2
      output.status = false

      callback(output)
    })
  }).catch(error1 => {
    output.data = error1
    output.status = false

    callback(output)
  })
}

const getgroupDetails = (request, callback) => {


    if (request.query.groupId && request.query.userName) {
        const input = {
            groupId: request.query.groupId,
            userName: request.query.userName
        }
        groupRepository.getgroupDetails(input, result =>{
            callback(result)
        })

    } else if (!request.query.groupId && request.query.userName) {
        res.status(400).send({
            error: messages.CREATEGROUP.groupId,
            status: false
        })
    } else if (request.query.groupId && !request.query.userName) {
        res.status(400).send({
            error: messages.LISTGROUP.createdBy,
            status: false
        })
    } else {
        res.status(400).send({
            error: messages.CREATEGROUP.invalidInput,
            status: false
        })
    }
}

const deleteGroupById = (request, callback) => {


    if (request.query.groupId && request.query.accountId) {
        const input = {
            groupId: request.query.groupId,
            accountId: request.query.accountId
        }

        const groupId = validate.isNumeric(input.groupId)
        const accountId = validate.isNumeric(input.accountId)

        if (!groupId) {
            res
                .status(400)
                .send({ error: messages.CREATEGROUP.groupId, status: false })
        } else if (!accountId) {
            res
                .status(400)
                .send({ error: messages.LISTGROUP.accountId, status: false })
        }

        if (groupId && accountId) {
            groupRepository.deleteGroupById(input, result => {
                callback(result)
            })
        }
    } else {
        res
            .status(400)
            .send({ error: messages.CREATEGROUP.invalidInput, status: false })
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
            res.status(400).send({
                error: messages.LISTGROUP.accountId,
                status: false
            })
        }
        if (!createdBy) {
            res.status(400).send({
                error: messages.LISTGROUP.createdBy,
                status: false
            })
        }
        if (accountId && input.createdBy) {
            groupRepository.avaliabledGroups(input, result => {
               callback(result)
            })
        }
    } else if (!request.query.accountId && request.query.userName) {
        res.status(400).send({
            error: messages.LISTGROUP.accountId,
            status: false
        })
    } else if (request.query.accountId && !request.query.userName) {
        res.status(400).send({
            error: messages.LISTGROUP.createdBy,
            status: false
        })
    } else {
        res.status(400).send({
            error: messages.LISTGROUP,
            status: false
        })
    }
}


const getParent = (hierarchy, id) => {
  var found = false
  for (var index = 0; index < hierarchy.length && !found; index++) {
    var item = hierarchy[index]
    if (item.Id === id) {
      found = true
      return item
    } else {
      if (item.Children && item.Children.length) {
        var result = getParent(item.Children, id)
        if (result) {
          found = true
          return result
        }
      }
    }
  }
}

const addToHierarchy = (hierarchy, inputItem) => {
  if (inputItem.ParentGroupId === null) {
    hierarchy.push({
      Id: inputItem.Id,
      Name: inputItem.Name,
      Type: inputItem.Type,
      Children: []
    })
  } else {
    var parent = getParent(hierarchy, inputItem.ParentGroupId)
    console.log('id :' + inputItem.ParentGroupId + ' Parent :', parent)

    if (parent) {
      parent.Children.push({
        Id: inputItem.Id,
        Name: inputItem.Name,
        Type: inputItem.Type,
        Children: []
      })
    }
  }
}

const getAll = (request, callback) => {

    if (request.query.accountId) {
        const input = {
            accountId: request.query.accountId
        }
        const accountId = validate.isNumeric(input.accountId)
        if (!accountId) {
            response.status(400).send({
                error: messages.LISTGROUP.accountId,
                status: false
            })
        }

        if (accountId) {
            groupRepository.getAll(input, result => {
                callback(result)
            })
        }
    } else if (!request.query.accountId) {
        response.status(400).send({
            error: messages.LISTGROUP.accountId,
            status: false
        })
    } else {
        response.status(400).send({
            error: messages.LISTGROUP,
            status: false
        })
    }
}

module.exports = {
    createGroup,
  getgroupDetails,
  deleteGroupById,
  update,
  avaliabledGroups,
  addToHierarchy,
  getAll
}
