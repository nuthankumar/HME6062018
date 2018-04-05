const express = require('express')
const validate = require('validator')
const router = express.Router()
const i18n = require('i18n')

const groupController = require('../Controllers/GroupController')
/**
 * Service for creating a new group
 * using name,desc,group,stores
 */
router.post('/creategroup', (request, response) => {
    groupController.createGroup(request, result => {
        if (result.status === true) {
            response.status(201).send(result)
        } else {
            response.status(400).send(result)
        }
    })
})

/**
 * This Service is used to get the Group details to edit the group
 */

router.get('/editgroup', (request, response) => {
    groupController.getgroupDetails(request, result => {
        if (result.status === true) {
            response.status(200).send(result)
        } else {
            response.status(400).send(result)
        }
    })
})

/**
 * This Service is used to Delete the Group details to from group and its child groups
 * @param requestuest
 * @param response
 */

router.delete('/deletegroup', (request, response) => {

    groupController.deleteGroupById(request, result => {
        if (result === 0) {
            response.status(200).send(messages.CREATEGROUP.noRecordsFound)
        } else if (result.data !== null && result.status) {
            if (result === 1) {
                response.status(200).send(messages.CREATEGROUP.RecordDeleted)
            } else {
                response.status(200).send(messages.CREATEGROUP.RecordsDeleted)
            }
        } else {
            response.status(500).send(result.data)
        }
    })
})
/**
 *  Service to get the available Group and Store details
 */

router.get('/availabledetails', (request, response) => {
    groupController.avaliabledGroups(request, result => {
        if (result.status === true) {
            response.status(200).send(result)
        } else {
            response.status(400).send(result)
        }
    })


  
})

/*
 * Service to get the Group Hierarchy
 */
router.get('/getAll', (request, response) => {

    groupController.getAll(request, result => {
        if (result.status === true) {
            response.status(200).send(result)
        } else {
            response.status(400).send(result)
        }
    })
})

module.exports = router
