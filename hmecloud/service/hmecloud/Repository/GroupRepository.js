/**
 * Using this file Manage the Group Hierachy level - stores and groups
 * Operation : Basic CURD App
 */
const db = require('../DataBaseConnection/Configuration')
const group = require('../Model/Group')
const groupDetails = require('../Model/GroupStore')
const sqlQuery = require('../Common/DataBaseQueries')
const messages = require('../Common/Message')

// get functions using accountid & name  - for the List

const createGroup = (input, callback) => {
  const output = {}
  const condition = {
    where: {
      GroupName: input.name,
        AccountId: input.accountId
    }
  }

  group.findAndCountAll(condition).then(count => {
    if (count.count === 0) {
      group.create({
        GroupName: input.name,
        Description: input.description,
          AccountId: input.accountId, 
          CreatedBy: input.userName, 
          UpdatedBy: input.userName 
      }).then(result => {
        if (input.groups.length > 0 || input.stores.length > 0) {
          let maxSize = input.groups.length
          for (var i = 0; i < maxSize; i++) {
            group.update({
              ParentGroup: result.Id
            }, {
              returning: true,
              where: {
                id: (input.groups[i] !== undefined) ? input.groups[i] : null
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
              GroupId: result.Id,
              StoreId: (input.stores[j] !== undefined) ? input.stores[j] : null
            }).then(result1 => {

            }).catch(error1 => {
              output.data = error1
              output.status = false

              callback(output)
            })
          }
        }
        output.data = messages.CREATEGROUP.groupSuccess1 + input.name + messages.CREATEGROUP.groupSuccess2
        output.status = true
        output.result = result.Id
        callback(output)
      }).catch(error => {
        output.data = error
        output.status = false

        callback(output)
      })
    } else {
      output.data = input.name + messages.CREATEGROUP.groupAlreadyExist
      output.status = false

      callback(output)
    }
  }).catch(error1 => {
    output.data = error1
    output.status = false

    callback(output)
  })
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
  const output = {}
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

const getgroupDetails = (input, callback) => {
    let output = {}
     db.query(sqlQuery.GroupHierarchy.getgroupDetails, {
        replacements: { groupId: input.groupId},
        type: db.QueryTypes.SELECT
    }).then(result => {
        if (result.length > 0) {
            const groupData = []
            for (let i = 1; i < result.length; i++) {
                groupData.push(result[i])
            }
            output.data = ({
                group: result[0],
                details: groupData
            })
            output.status = true
            callback(output)
        } else {
            output.data = messages.CREATEGROUP.noDataForGivenId
            output.status = false
            callback(output)
        }
      }).catch(error => {
        output.data = error
        output.status = false
        callback(output)
      })
} 

const deleteGroupById = (input, callBack) => {
  const updateParentGroup = {
    ParentGroup: null
  }

  groupDetails
    .update(updateParentGroup, {
      where: {
        ParentGroup: input.groupId
      }
    }).then(updatedRows => {
      group
        .destroy({
          where: {
            AccountId: input.accountId,
            Id: input.groupId
          }
        })
        .then((result) => {
          const output = {
            data: result,
            status: true
          }
          return callBack(output)
        })
        .catch((error) => {
          const output = {
            data: error,
            status: false
          }
          return callBack(output)
        })
    })
}

const avaliabledGroups = (input, callback) => {
    const output = {}
    db.query(sqlQuery.GroupHierarchy.getAllAvailableGroupsAndStores, {
        replacements: { accountId: input.accountId },
        type: db.QueryTypes.SELECT
    }).then(result => {
    if (result.length > 0) {
      output.data = result
      output.status = true
    } else {
      output.data = messages.CREATEGROUP.noDataForGivenId
      output.status = false
    }
    callback(output)
  }).catch(error => {
    output.data= error,
    output.status= false
    callback(output)
  })
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

const getAll = (input, callback) => {
    db.query(sqlQuery.GroupHierarchy.getGroupHierarchy, {
        replacements: { accountId: input.accountId },
        type: db.QueryTypes.SELECT
    }).then(result => {
    const output = {}
    if (result) {
      let hierarchy = []
      result.forEach((item) => {
        addToHierarchy(hierarchy, item)
      })
      output.data = hierarchy
      output.status = true
    } else {
      output.data = 'notfound'
      output.status = false
    }
    callback(output)
  }).catch(error => {
    const output = {
      data: error,
      status: false
    }
    callback(output)
  })
}

module.exports = {
    createGroup,
  getgroupDetails,
  deleteGroupById,
    updateGroup,
  avaliabledGroups,
  addToHierarchy,
  getAll
}
