/**
 * Using this file Manage the Group Hierachy level - stores and groups
 * Operation : Basic CURD App
 */

// config the model
let Sequelize = require('sequelize')
Sequelize = new Sequelize('hmeCloud', 'sa', 'nous@123', {
  host: 'NIBC1329',
  dialect: 'mssql',
  operatorsAliases: false
})
const group = require('../../Model/groupModel/Group')
const groupDetails = require('../../Model/groupModel/GroupStore')
// Config messages
const messages = require('../../common/message')

// get functions using accountid & name  - for the List

const list = (input, callback) => {
  const condition = {
    where: {
      AccountId: input.accountId,
      CreatedBy: input.createdBy
    }
  }
  group.findAll(condition)
    .then(result => {
      const output = {}
      if (result.length > 0) {
        output.data = result
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

// create function

const create = (input, callback) => {
  const output = {}
  const condition = {
    where: {
      GroupName: input.name,
      AccountId: 0 // toDO: input.accountId update this //TODO: To be updated
    }
  }

  group.findAndCountAll(condition).then(count => {
    if (count.count === 0) {
      group.create({
        GroupName: input.name,
        Description: input.description,
        AccountId: 0, // input.accountId,  // TODO: To be updated
        CreatedBy: 'swathikumary@nousinfo.com', // TODO: To be updated
        UpdatedBy: 'swathikumary@nousinfo.com' // TODO: To be updated
      }).then(result => {
        if (input.groups.length > 0 || input.stores.length > 0) {
          let maxSize = (input.groups.length > input.stores.length) ? input.groups.length : input.stores.length
          for (var i = 0; i < maxSize; i++) {
            groupDetails.create({
              GroupId: result.Id,
              ChildGroupId: (input.groups[i] != undefined) ? input.groups[i] : null,
              StoreId: (input.stores[i] != undefined) ? input.stores[i] : null
            }).then(result1 => {
              output.data = messages.CREATEGROUP.groupSuccess1 + input.name + messages.CREATEGROUP.groupSuccess2,
              output.status = true
              callback(output)
            }).catch(error1 => {
              output.data = error1,
              output.status = false

              callback(output)
            })
          }
        }
      }).catch(error => {
        output.data = error,
        output.status = false

        callback(output)
      })
    } else {
      output.data = input.name + messages.CREATEGROUP.groupAlreadyExist,
      output.status = false

      callback(output)
    }
  }).catch(error1 => {
    output.data = error,
    output.status = false

    callback(output)
  })
}

const update = (input, callback) => {
  const output = {}
  const condition = {
    where: {
      Id: input.id,
      AccountId: 0 // toDO: input.accountId update this //TODO: To be updated
    }
  }
  group.findOne(condition).then(data => {
    if (data) {
      group.update(
        {
          Description: input.description,
          UpdatedBy: 'jaffer@nousinfo.com', // TODO: To be updated
          UpdatedDateTime: Date().now
        },
        { where: { Id: data.Id } }
      ).then(result1 => {
        const condition = {
          where: {
            GroupId: data.Id
          }
        }
        groupDetails.destroy(condition).then(result2 => {
          if (input.groups.length > 0 || input.stores.length > 0) {
            let maxSize = (input.groups.length > input.stores.length) ? input.groups.length : input.stores.length
            for (let i = 0; i < maxSize; i++) {
              groupDetails.create({
                GroupId: data.Id,
                ChildGroupId: (input.groups[i] != undefined) ? input.groups[i] : null,
                StoreId: (input.stores[i] != undefined) ? input.stores[i] : null
              }).then(result3 => {
                output.data = messages.CREATEGROUP.groupSuccess1 + input.name + messages.CREATEGROUP.groupUpdatesSuccess,
                output.status = true
                callback(output)
              }).catch(error3 => {
                output.data = error3,
                output.status = false

                callback(output)
              })
            }
          }
          output.data = messages.CREATEGROUP.groupSuccess1 + input.name + messages.CREATEGROUP.groupUpdatesSuccess,
          output.status = true
          callback(output)
        }).catch(error2 => {
          output.data = error2,
          output.status = false

          callback(output)
        })
      }).catch(error1 => {
        output.data = error1,
        output.status = false

        callback(output)
      })
    } else {
      // No data found for given group Id
      output.data = messages.CREATEGROUP.noDataForGivenId + input.id,
      output.status = true
      callback(output)
    }
  }).catch(error => {
    console.log('error occurred while updating..' + error)
    output.data = error,
    output.status = false

    callback(output)
  })
}

const getgroupDetails = (input, callback) => {
  let output = {}

  const condition = {
    where: {
      Id: input.groupId,
      CreatedBy: input.userName
    }
  }
  group.findOne(condition).then(result => {
    if (result) {
      // Getting the child Group and Store details
      const Query = "SELECT g.Id, g.GroupName,'group' AS type FROM[dbo].[Group] as g INNER JOIN GroupStore gd ON g.Id = gd.ChildGroupId WHERE gd.GroupId =" + input.groupId + " AND g.CreatedBy = '" + input.userName + "'"
      // 9 AND g.CreatedBy = 'swathikumary@nousinfo.com';
      Sequelize.query(Query, { type: Sequelize.QueryTypes.SELECT }).then(result1 => {
        if (result1) {
          output.data = ({ group: result, details: result1 })
          output.status = true

          callback(output)
        }
      }).catch(error1 => {
        output.data = error,
        output.status = false

        callback(output)
      })
    } else {
      output.data = 'Data notfound'
      output.status = false
    }
  }).catch(error => {
    output.data = error,
    output.status = false

    callback(output)
  })
}

/*
Deletes Group and its sub groups from table
@param   inputs [groupId and accountId ]
@param callBack
*/
const deleteGroupById = (input, callBack) => {
  const updateChildGroupId = {
    ChildGroupId: null
  }

  groupDetails
    .update(updateChildGroupId, {
      where: { ChildGroupId: input.groupId }
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

module.exports = {
  list,
  create,
  getgroupDetails,
  deleteGroupById,
  update
}
