const express = require('express')
const validate = require('validator');
const router = express.Router();
const i18n = require("i18n");

// controller config
// Config error messages
const messages = require('../../common/message')
// Router config

const groupController =require('../../Controller/groupController/groupHierarchy')


// Checking testing
router.get('/getname', (req, res) => {
    i18n.init(req, res);
    res.setLocale('de');
    var greeting = res.__('greet');
    console.log("The locale value==" + greeting)
    res.json({ message: greeting });
  });


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
            groupController.list(input, ((response) => {
                if (response.status === true) {
                    res.status(200).send(response)
                } else {
                    res.status(400).send(response)
                }
            }));
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
        if (!req.body.groupId) {
            const input = {
                name: req.body.name,
                description: req.body.description,
                groups: req.body.groups,
                stores: req.body.stores
            }
            groupController.create(input, ((response) => {

                if (response.status === true) {
                    res.status(200).send(response)
                } else {
                    res.status(400).send(response)
                }
            }));

        } else {
            //TODO: Edit update
        }
    } else {
        res.status(400).send({
            error: messages.CREATEGROUP.groupNameEmpty,
            status: false
        });
     }
});


/**
 * This Service is used to get the Group details to edit the group 
 */

router.get('/edit', (req, res) => {
    console.log("The edit service is invoked");
    if (req.query.groupId && req.query.userName) {
        const input = {
            groupId: req.query.groupId,
            userName: req.query.userName
        };
        groupController.getgroupDetails(input, ((response) => {
            if (response.status === true) {
                res.status(200).send(response)
            } else {
                res.status(400).send(response)
            }
        }));
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
});

/**
 * This Service is used to Delete the Group details to from group and its child groups
 * @param request
 * @param response
 */

router.delete("/deletegroup", (req, res) => {
   

    const input = {
        groupId: req.query.groupId,
        accountId: req.query.accountId
    };
    

    if ((input.groupId || input.accountId || null === input.groupId) || (input.groupId === "")) {
       
        res
            .status(400)
            .send({ error: messages.DELETEGROUP.invalidParameters, status: false });
    } else if ((input.accountId === null) | (input.accountId === "")) {
        res
            .status(400)
            .send({ error: messages.DELETEGROUP.invalidaccountId, status: false });
    } else if (!validate.isNumeric(input.groupId)) {
        res
            .status(400)
            .send({ error: messages.DELETEGROUP.groupIdNotANumber, status: false });
    } else if (!validate.isNumeric(input.accountId)) {
        res
            .status(400)
            .send({ error: messages.DELETEGROUP.accountIdNotANumber, status: false });
    } else {

        groupController.deleteGroupById(input, response => {
            if (response.data === 0) {
                res.status(200).send(messages.DELETEGROUP.noRecordsFound);
            } else if (response.data !== null && response.status) {
               
                if (response.data === 1) {
                    res.status(200).send(messages.DELETEGROUP.RecordDeleted);
                } else {
                    res.status(200).send(messages.DELETEGROUP.RecordsDeleted);
                }
            } else {
               
                res.status(500).send(response.data);
            }
        });
    }
});


/**
 * end
 */








module.exports = router