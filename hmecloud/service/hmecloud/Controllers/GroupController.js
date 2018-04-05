
const validate = require('validator')
const groupRepository = require('../Repository/GroupRepository')
const messages = require('../Common/Message')



// get functions using accountid & name  - for the List

// create function

const createGroup = (input, callback) => {
    groupRepository.createGroup(input, result => {
        callback(result)
    })
}

const updateGroup = (input, callback) => {

    groupRepository.updateGroup(input, result => {
        callback(result)
    })
}
const getgroupDetails = (input, callback) => {
    groupRepository.getgroupDetails(input, result => {
        callback(result)
    })
}

const deleteGroupById = (input, callback) => {

    groupRepository.deleteGroupById(input, result => {
        callback(result)
    })
   
}

const avaliabledGroups = (input, callback) => {
    groupRepository.avaliabledGroups(input, result => {
        callback(result)
    })
}

const getAll = (input, callback) => {

    groupRepository.getAll(input, result => {
        callback(result)
    })
}

module.exports = {
  createGroup,
  getgroupDetails,
  deleteGroupById,
  avaliabledGroups,
  getAll,
  updateGroup
}
