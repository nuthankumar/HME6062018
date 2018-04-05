const express = require('express')
const validate = require('validator')
const router = express.Router()
const i18n = require('i18n')

// controller config
// Config error messages
const messages = require('../Common/Message')
// Router config

const groupController = require('../Controllers/GroupController')

// Checking testing
router.get('/getname', (req, res) => {
  i18n.init(req, res)
  res.setLocale('de')
  var greeting = res.__('greet')
  console.log('The locale value==' + greeting)
  res.json({ message: greeting })
})

/**
 * Service for creating a new group
 * using name,desc,group,stores
 */
router.post('/creategroup', (request, response) => {
  if (request.body.name) {
    const input = {
      id: request.body.id,
      name: request.body.name,
      description: request.body.description,
      groups: request.body.groups,
      stores: request.body.stores
    }

    if (!request.body.id) {
      // Create Group
      groupController.create(input, result => {
        if (result.status === true) {
          response.status(200).send(result)
        } else {
          response.status(400).send(result)
        }
      })
    } else {
      // Update Group
      groupController.update(input, result => {
        if (result.status === true) {
          response.status(200).send(result)
        } else {
          response.status(400).send(result)
        }
      })
    }
  } else {
    response.status(400).send({
      error: messages.CREATEGROUP.groupNameEmpty,
      status: false
    })
  }
})

/**
 * This Service is used to get the Group details to edit the group
 */

router.get('/edit', (request, res) => {
  console.log('The edit service is invoked')
  if (request.query.groupId && request.query.userName) {
    const input = {
      groupId: request.query.groupId,
      userName: request.query.userName
    }
    groupController.getgroupDetails(input, response => {
      if (response.status === true) {
        res.status(200).send(response)
      } else {
        res.status(400).send(response)
      }
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
})

/**
 * This Service is used to Delete the Group details to from group and its child groups
 * @param requestuest
 * @param response
 */

router.delete('/delete', (request, res) => {
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
      groupController.deleteGroupById(input, response => {
        if (response === 0) {
          res.status(200).send(messages.CREATEGROUP.noRecordsFound)
        } else if (response.data !== null && response.status) {
          if (response === 1) {
            res.status(200).send(messages.CREATEGROUP.RecordDeleted)
          } else {
            res.status(200).send(messages.CREATEGROUP.RecordsDeleted)
          }
        } else {
          res.status(500).send(response.data)
        }
      })
    }
  } else {
    res
      .status(400)
      .send({ error: messages.CREATEGROUP.invalidInput, status: false })
  }
})

/**
 * Service to provide list of all groups with child group hierarchy
 * using accountId, username
 */
router.get('/listgrouphierarchy', (request, res) => {
  if (request.query.accountId && request.query.userName) {
    const input = {
      AccountId: request.query.accountId,
      CreatedBy: request.query.userName
    }
    const accountId = validate.isNumeric(input.AccountId)
    const createdBy = validate.isEmail(input.CreatedBy)
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
    // if (accountId && input.createdBy) {
    groupController.listGroupHierarchy(input, response => {
      if (response.status === true) {
        res.status(200).send(response)
      } else {
        res.status(400).send(response)
      }
    })
    // }
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
})

/**
 * end
 */

router.get('/availabledetails', (request, res) => {
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
      groupController.avaliabledGroups(input, response => {
        if (response.status === true) {
          res.status(200).send(response)
        } else {
          res.status(400).send(response)
        }
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
})

router.get('/getAll', (request, response) => {
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
      groupController.getAll(input, result => {
        if (result.status === true) {
          response.status(200).send(result)
        } else {
          response.status(400).send(result)
        }
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
})

module.exports = router
