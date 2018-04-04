const express = require('express')
const validate = require('validator')
const router = express.Router()
const i18n = require('i18n')

// controller config
// Config error messages
const messages = require('../../common/message')
// Router config

const groupController = require('../../Controller/groupController/groupHierarchy')

// Checking testing
router.get('/getname', (req, res) => {
  i18n.init(req, res)
  res.setLocale('de')
  var greeting = res.__('greet')
  console.log('The locale value==' + greeting)
  res.json({ message: greeting })
})

/**
 * Service to provide list of all groups
 * using accountId, username
 */
router.get('/list', (req, res) => {
  if (req.query.accountId && req.query.userName) {
    const input = {
      accountId: req.query.accountId,
      createdBy: req.query.userName
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
      groupController.list(input, (response) => {
        if (response.status === true) {
          res.status(200).send(response)
        } else {
          res.status(400).send(response)
        }
      })
    }
  } else if (!req.query.accountId && req.query.userName) {
    res.status(400).send({
      error: messages.LISTGROUP.accountId,
      status: false
    })
  } else if (req.query.accountId && !req.query.userName) {
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

/**
 * Service for creating a new group
 * using name,desc,group,stores
 */
router.post('/create', (req, res) => {
  if (req.body.name) {
    const input = {
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      groups: req.body.groups,
      stores: req.body.stores
    }

    if (!req.body.id) {
      // Create Group
      groupController.create(input, (response) => {
        if (response.status === true) {
          res.status(200).send(response)
        } else {
          res.status(400).send(response)
        }
      })
    } else {
      // Update Group
      groupController.update(input, (response) => {
        if (response.status === true) {
          res.status(200).send(response)
        } else {
          res.status(400).send(response)
        }
      })
    }
  } else {
    res.status(400).send({
      error: messages.CREATEGROUP.groupNameEmpty,
      status: false
    })
  }
})

/**
 * This Service is used to get the Group details to edit the group
 */

router.get('/edit', (req, res) => {
  if (req.query.groupId && req.query.userName) {
    const input = {
      groupId: req.query.groupId,
      userName: req.query.userName
    }
    groupController.getgroupDetails(input, (response) => {
      if (response.status === true) {
        res.status(200).send(response)
      } else {
        res.status(400).send(response)
      }
    })
  } else if (!req.query.groupId && req.query.userName) {
    res.status(400).send({
      error: messages.CREATEGROUP.groupId,
      status: false
    })
  } else if (req.query.groupId && !req.query.userName) {
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
 * @param request
 * @param response
 */

router.delete('/deletegroup', (req, res) => {
  if (req.query.groupId && req.query.accountId) {
    const input = {
      groupId: req.query.groupId,
      accountId: req.query.accountId
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
 * end
 */

module.exports = router
