/**
 * Using this file Manage the Group Hierachy level - stores and groups
 * Operation : Basic CURD App
 */
const db = require('../DataBaseConnection/Configuration')
const repository = require('./Repository')
const group = require('../Model/Group')
const groupDetails = require('../Model/GroupStore')
const sqlQuery = require('../Common/DataBaseQueries')
const messages = require('../Common/Message')

// get functions using accountid & name  - for the List

const createGroup = (input, callback) => {
  repository.execute(sqlQuery.GroupHierarchy.createGroup, {
    replacements: { groupName: input.name, description: input.description, accountId: input.accountId, userName: input.userName, groups: input.groups.toString(), stores: input.stores.toString() },
    type: db.QueryTypes.SELECT
  }, result => callback(result))
}
const updateGroup = (input, callback) => {
  const output = {}
  const condition = {
    where: {
      Id: input.id,
      AccountId: input.accountId
    }
  }
  group.findOne(condition).then(data => {
    if (data) {
      if (data.GroupName !== input.name) {
        const condition = {
          where: {
            GroupName: input.name,
            AccountId: input.accountId
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
  group.update({
    GroupName: input.name,
    Description: input.description,
    UpdatedBy: input.userName,
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

const getgroupDetails = (groupId, callback) => {
  repository.execute(sqlQuery.GroupHierarchy.getgroupDetails, {
    replacements: { groupId: groupId },
    type: db.QueryTypes.SELECT
  }, result => callback(result))
}

const deleteGroupById = (groupId, callback) => {
  repository.execute(sqlQuery.GroupHierarchy.deleteGroupByGroupId, {
    replacements: { groupId: groupId },
    type: db.QueryTypes.SELECT
  }, result => callback(result))
}

const avaliabledGroups = (accountId, callback) => {
  repository.execute(sqlQuery.GroupHierarchy.getAllAvailableGroupsAndStores, {
    replacements: { accountId: accountId },
    type: db.QueryTypes.SELECT
  }, result => callback(result))
}

const getAll = (accountId, callback) => {
  repository.execute(sqlQuery.GroupHierarchy.getGroupHierarchy, {
    replacements: { accountId: accountId },
    type: db.QueryTypes.SELECT
  }, result => callback(result))
}

module.exports = {
  createGroup,
  getgroupDetails,
  deleteGroupById,
  updateGroup,
  avaliabledGroups,
  getAll
}
