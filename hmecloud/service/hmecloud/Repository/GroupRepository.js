/**
 * Using this file Manage the Group Hierachy level - stores and groups
 * Operation : Basic CURD App
 */
const db = require('../DataBaseConnection/Configuration').db
const repository = require('./Repository')
const sqlQuery = require('../Common/DataBaseQueries')

const createGroup = (input, callback) => {
  repository.execute(sqlQuery.GroupHierarchy.createGroup, {
    replacements: { groupName: input.name, description: input.description, accountId: input.accountId, userName: input.userName, groups: input.groups.toString(), stores: input.stores.toString() },
    type: db.QueryTypes.SELECT
  }, result => callback(result))
}
const updateGroup = (input, callback) => {
  repository.execute(sqlQuery.GroupHierarchy.updateGroup, {
    replacements: { groupId: input.id, groupName: input.name, description: input.description, accountId: input.accountId, userName: input.userName, groups: input.groups.toString(), stores: input.stores.toString() },
    type: db.QueryTypes.SELECT
  }, result => callback(result))
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
