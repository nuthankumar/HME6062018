
const groupRepository = require('../Repository/GroupRepository')

const createGroup = (request, input, callback) => {
  let output = {}
  groupRepository.createGroup(input, result => {
    if (result.length > 0) {
      let isGroupCreated = result[0]
      if (isGroupCreated.hasOwnProperty('groupId')) {
        output.data = request.t('CREATEGROUP.groupSuccess1') + input.name + request.t('CREATEGROUP.groupSuccess2')
        output.status = true
      } else if (isGroupCreated.hasOwnProperty('groupcount') && isGroupCreated.groupcount > 0) {
        output.data = input.name + request.t('CREATEGROUP.groupAlreadyExist')
        output.status = false
      }
    } else {
      output.data = request.t('CREATEGROUP.groupSuccess1') + input.name + request.t('CREATEGROUP.groupCreationFailed')
      output.status = false
    }
    callback(output)
  })
}

const updateGroup = (request, input, callback) => {
  let output = {}
    groupRepository.updateGroup(input, result => {
    if (result.length > 0) {
        let isGroupUpdated = result[0]
        let isGroupexist = result[1]
       
        if (isGroupexist.hasOwnProperty('IsGroupAlreadyExist') && isGroupexist.IsGroupAlreadyExist) {
            output.data = "Group Already exist " + input.name
            output.status = false
        } else if (isGroupUpdated.hasOwnProperty('groupId') && isGroupUpdated.groupId)
        {
            output.data = request.t('CREATEGROUP.groupSuccess1') + input.name + request.t('CREATEGROUP.groupUpdatesSuccess')
            output.status = true
      }else{
        output.data = request.t('CREATEGROUP.noDataForGivenName') + input.name
        output.status = false
      }
    } else {
      output.data = request.t('CREATEGROUP.groupSuccess1') + input.name + request.t('CREATEGROUP.groupUpdationFailed')
      output.status = false
    }
    callback(output)
  })
}
const getgroupDetails = (request, input, callback) => {
  let output = {}
  groupRepository.getgroupDetails(input.groupId, result => {
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
      output.data = request.t('CREATEGROUP.noDataForGivenId') + input.groupId
      output.status = false
      callback(output)
    }
  })
}

const deleteGroupById = (request, input, callback) => {
  let output = {}
  groupRepository.deleteGroupById(input.groupId, result => {
    if (result[0].deletedRecords > 0) {
      output.data = request.t('CREATEGROUP.groupIdNo') + input.groupId + request.t('CREATEGROUP.RecordDeleted')
      output.status = true
    } else {
      output.data = request.t('CREATEGROUP.noDataForGivenId') + input.groupId
      output.status = false
    }
    callback(output)
  })
}

const avaliabledGroups = (request, input, callback) => {
  let output = {}
  groupRepository.avaliabledGroups(input.accountId, result => {
    if (result.length > 0) {
      output.data = result
      output.status = true
    } else {
      output.data = request.t('CREATEGROUP.noDataForGivenId') + input.accountId
      output.status = false
    }
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
      StoreNumber: inputItem.Store_Number,
      Brand: inputItem.Brand_Description,
      Children: []
    })
  } else {
    var parent = getParent(hierarchy, inputItem.ParentGroupId)
    if (parent) {
      parent.Children.push({
        Id: inputItem.Id,
        Name: inputItem.Name,
        StoreNumber: inputItem.Store_Number,
        Brand: inputItem.Brand_Description,
        Children: []
      })
    }
  }
}

const getAll = (request, input, callback) => {
  const output = {}
    groupRepository.getAll(input.accountId, result => {
    if (result) {
      let hierarchy = []
      result.forEach((item) => {
        addToHierarchy(hierarchy, item)
      })
      output.data = hierarchy
      output.status = true
    } else {
      output.data = request.t('CREATEGROUP.noDataForGivenId') + input.accountId
      output.status = false
    }
    callback(output)
  })
}

module.exports = {
  createGroup,
  getgroupDetails,
  deleteGroupById,
  avaliabledGroups,
  getAll,
  updateGroup,
  addToHierarchy
}
