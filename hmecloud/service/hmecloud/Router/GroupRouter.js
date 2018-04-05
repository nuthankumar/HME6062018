const express = require('express')
const validate = require('validator')
const router = express.Router()
const groupValidator = require('../Validators/GroupValidator')
const authValidator = require('../Controllers/AuthenticationController')


/**
 * Service for creating a new group
 * using name,desc,group,stores
 */
router.post('/creategroup', authValidator, (request, response, next) => {
    console.log("THe accountId====" + request.AccountId)
    groupValidator.createGroup(request, result => {
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

router.get('/editgroup', authValidator, (request, response) => {
    groupValidator.getgroupDetails(request, result => {
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

router.delete('/deletegroup', authValidator, (request, response) => {

    groupValidator.deleteGroupById(request, result => {
        if (result === true) {
            response.status(200).send(messages.CREATEGROUP.noRecordsFound)
        } else {
            response.status(400).send(result)
        } 
    })
})
/**
 *  Service to get the available Group and Store details
 */

router.get('/availabledetails', authValidator, (request, response) => {
    groupValidator.avaliabledGroups(request, result => {
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
router.get('/getAll', authValidator, (request, response) => {

    groupValidator.getAll(request, result => {
        if (result.status === true) {
            response.status(200).send(result)
        } else {
            response.status(400).send(result)
        }
    })
})

module.exports = router
